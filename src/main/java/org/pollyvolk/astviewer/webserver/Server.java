package org.pollyvolk.astviewer.webserver;

import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.URLDecoder;
import java.nio.file.Files;
import java.util.TreeMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Встраиваемый веб-сервер
 */
public final class Server {
	/**
	 * Запускает встраиваемый веб-сервер
	 * @param opt параметры
	 * @param handler обработчик запросов
	 * @return объект сервера
	 */
	public static Server start(WebOptions opt, Handler handler) {
		Server server = new Server(opt, handler);
		server.start();
		return server;
	}

	/**
	 * Конструктор, вызывается из статического метода
	 * @param opt параметры
	 * @param handler обработчик запросов
	 */
	private Server(WebOptions opt, Handler handler) {
		listener = new Listener(opt, handler);
		thread = new Thread(listener);
	}

	/**
	 * Запускает обработку запросов
	 */
	private void start() {
		thread.start();
	}

	/**
	 * @return true если веб-сервер зааущен
	 */
	public boolean isAlive() {
		return thread.isAlive();
	}

	/**
	 * Останавливает веб-сервер
	 */
	public void stop() {
		listener.stop();
	}
	
	private Listener listener;
	private Thread thread;

	/**
	 * Внутренний слушатель запросов.
	 * Он слушает сокеты и запускает внутренний обработчик запросов
	 */
	private static class Listener implements Runnable {
		private WebOptions opt;
		private Handler handler;
		private volatile boolean work;

		/**
		 * Конструктор слушателя
		 * @param opt парамметры сервера
		 * @param handler адрес внешнего обработчика запросов
		 */
		public Listener(WebOptions opt, Handler handler) {
			this.opt = opt;
			this.handler = handler;
			work = true;
		}

		/**
		 * Этот метод вызывается в отдельном потоке.
		 * Он слушает сокет, и, когда приходит запрос, вызывает внутренний обработчик.
		 */
		public void run() {
			ServerSocket ss = null;
			try {
		        ss = new ServerSocket(opt.port);
		        ExecutorService pool = Executors.newFixedThreadPool(opt.threadCount);
		        while (work)
		        {
		            Socket s = ss.accept();
		            pool.submit(new Processor(s, opt.wwwRoot, handler));
		        }
		        pool.shutdownNow();
			}
			catch (Throwable e) {
				System.err.println("HTTP server failed: " + e.toString());
			}

			try {
				if (ss != null)
					ss.close();
			}
			catch (IOException e) {
				e.printStackTrace();
			}
		}
		
		public void stop() {
			work = false;
		}
	}

	/**
	 * Внутренний обработчик запросов
	 * Он получает запрос в необработанном виде по протоколу http, парсит его и запускает
	 * внешний обработчик с разобранными параметрами
	 */
    private static class Processor implements Runnable {
		/**
		 * Метод, которым закодирован запрос от веб-интерфейса
		 */
		private enum Method {
    		UNKNOWN,
    		GET,
    		POST
    	}

		/**
		 * Конструктор внутреннего обработчика
		 * @param socket сокет, через который передаются данные
		 * @param wwwRoot адрес корневой папки
		 * @param handler адрес внешнего обработчика
		 */
        private Processor(Socket socket, String wwwRoot, Handler handler) {
        	this.socket = socket;
        	this.wwwRoot = wwwRoot;
        	this.handler = handler;
        	this.method = Method.UNKNOWN;
        }

        private Socket socket;
        private String wwwRoot;
        private Handler handler;
        private String address;
        private Method method;
        private int contentLength;
        private String postData;
        private String boundary;

		/**
		 * Этот метод вызывается в отдельном потоке.
		 * Он получает данные, разбирает их, вызывает внешний обработчик и возвращает ответ веб-интерфейсу.
		 */
		public void run() {
            try {
            	// Сразу ответить 102, чтобы веб-страница подождала ответ
            	writeResponse("102 Processing", null, null);

            	// Чтение данных
                BufferedReader buff = new BufferedReader(new InputStreamReader(socket.getInputStream()));
                while(true)
                {
                	// Разбор заголовка запроса - здесь нас интересует метод, форма и длина передаваемых данных
                    String s = buff.readLine();
                    if(s == null || s.trim().length() == 0) {
                        break;
                    }
                    if (s.startsWith("GET")) {
                    	int n = s.indexOf("HTTP");
                    	if (n != -1)
                    		address = s.substring(4,  n - 1);
                    	method = Method.GET;
                    }
                    else if (s.startsWith("POST")) {
                    	int n = s.indexOf("HTTP");
                    	if (n != -1)
                    		address = s.substring(5,  n - 1);
                    	method = Method.POST; 
                    }
                    else if (s.startsWith("Content-Length:")) {
                    	try {
                    		contentLength = Integer.parseInt(s.substring(16));
                    	}
                    	catch(NumberFormatException e) {
                    		contentLength = 0;
                    	}
                    }
                    else if (s.startsWith("Content-Type: multipart/form-data;")) {
                    	int n = s.indexOf("boundary=");
                    	if (n != -1)
                    		boundary = s.substring(n + 9);
                    }
                }
                if (method == Method.POST && contentLength > 0) {
                	/* Если данные переданы методом POST, то их надо получить из стандартного входа (то есть как бы
					   из консоли). Из-зв странной особенности консоли мы не можем считать данные все сразу (их там
					    просто нет), и поэтому надо считывать в цикле, пока не будут прочитаны все данные */
                	Thread.sleep(250);
                	char[] tmp = new char[contentLength];
                	char[] data = new char[contentLength];
                	int offset = 0;
                	int readCnt;
                	while (offset < contentLength) {
                		readCnt = buff.read(tmp);
                		if (readCnt == -1)
                			break;
                		System.arraycopy(tmp, 0, data, offset, readCnt);
                		offset += readCnt;
                    	writeResponse("202 Accepted", null, null);
                	}
            		postData = String.valueOf(data);
                }
                
                if (method == Method.UNKNOWN) {
            		writeResponse("200 OK", "text/javascript", null);
                }
                else if ((address != null && address.startsWith("/?")) || (method == Method.POST && boundary == null)) {
                	// Разбор запроса, пришедшего после знака ? адресной строки
                	TreeMap<String, FormData> map = new TreeMap<String, FormData>();
                	String request;
                	if (method == Method.GET)
                		request = address.substring(2);
                	else
                		request = postData;
                	String[] split = request.split("&");
                	for(String pair : split) {
                		if (pair != null && !pair.equals("")) {
                    		String[] keyVal = pair.split("=");
                    		if (keyVal.length == 2) {
                    			String key = URLDecoder.decode(keyVal[0], "UTF-8");
                    			FormData value = new FormData(URLDecoder.decode(keyVal[1], "UTF-8"));
                    			map.put(key, value);
                    		}
                		}
                	}
                	Response response = handler.handle(map);
                	if (response != null)
						writeResponse("200 OK", response.getContentType(), response.getData());
                	else
                		writeResponse("500 Internal Server Error", null, null);
                }
                else if (method == Method.POST && boundary != null) {
                	/* Разбор данных, закодированных в multipart-form-data формате.
					   Таким способом можно передавать файлы */
                	TreeMap<String, FormData> map = new TreeMap<String, FormData>();
                	String[] split = postData.split("--" + boundary);
                	for(String part : split) {
                		int i = part.indexOf("Content-Disposition");
                		if (i > -1 && i < 10) {
                			int j = part.indexOf("\r\n\r\n");
                			if (j > -1) {
            					String fileName = null;
                				String value = part.substring(j + 4, part.length() - 2);
                				String header = part.substring(0, j);
                				int k = header.indexOf("name=\"");
                				if (k > -1)
                				{
                					header = header.substring(k + 6);
                					k = header.indexOf('"');
                					String key = header.substring(0, k);
                					header = header.substring(k + 1);
                					k = header.indexOf("filename=\"");
                					if (k > -1)
                					{
                						header = header.substring(k + 10);
                						k = header.indexOf('"');
                						fileName = header.substring(0, k);
                					}
                					map.put(key, new FormData(fileName, value));
                				}
                			}
                		}
                	}
                	Response response = handler.handle(map);
                	if (response != null)
                		writeResponse("200 OK", response.getContentType(), response.getData());
                	else
                		writeResponse("500 Internal Server Error", null, null);
                }
                else {
                	// Иначе, если запроса нет, пытаемся найти и вернуть файл из папки wwwRoot
                	int paramsIdx = address.indexOf('?');
                	if (paramsIdx >= 0)
                		address = address.substring(0, paramsIdx);
                	if (address.equals("/") || address == null)
                		if (wwwRoot.endsWith("www")) {
							address = "/index.html";
						} else if (wwwRoot.endsWith("viewer")) {
							address = "/frames.html";
						}
                	else
                		address = URLDecoder.decode(address, "UTF-8");
                	Response response = handler.handle(address);
                	if (response != null) {
                		writeResponse("200 OK", response.getContentType(), response.getData());
                	}
                	else {
	                	String path = wwwRoot + address;
	                	try {
	                		File file = new File(path);
	                		if (file.exists())
	                		{
	                			byte[] data = Files.readAllBytes(file.toPath());
	                			String ext = null;
	                			int i = address.lastIndexOf('.');
	                			if (i > 0)
	                				ext = address.substring(i + 1).toLowerCase();
	                			String type = "application/unknown";
	                			if (ext != null) {
	                				switch(ext)
	                				{
	                				case "htm":
	                				case "html":
	                					type = "text/html";
	                					break;
	                				case "css":
	                					type = "text/css";
	                					break;
	                				case "js":
	                					type = "text/javascript";
	                					break;
	                				case "jpg":
	                				case "jpeg":
	                				case "png":
	                				case "gif":
	                					type = "image/" + ext;
	                					break;
	                				default:
	                					type = "application/" + ext;
	                				}
	                			}
	                    		writeResponse("200 OK", type, data);
	                		}
	                		else
	                    		writeResponse("404 Not Found", null, null);
	                	}
	                	catch (Throwable t) {
	                		writeResponse("500 Internal Server Error", null, null);
	                	}
                	}
                }
            }
            catch (Throwable t) {
            	if (!(t instanceof java.net.SocketException))
            		t.printStackTrace();
            }
            finally {
                try {
                    socket.close();
                }
                catch (Throwable t) {
                	t.printStackTrace();
                }
            }
        }

		/**
		 * Возвращает ответ веб-интерфейсу
		 * @param code код ответа (например 404 Not Found)
		 * @param type тип данных ответа
		 * @param data данные
		 */
        private void writeResponse(String code, String type, byte[] data) throws Throwable {
        	OutputStream stream = socket.getOutputStream();
        	if (code != null) {
	        	if (type == null)
	        		type = "application/unknown";
	        	StringBuilder b = new StringBuilder();

	        	b.append("HTTP/1.1 ");
	        	b.append(code);
	        	b.append("\r\n");
	            
	        	b.append("Access-Control-Allow-Origin: *\r\n");
	        	
	        	b.append("Content-Type: ");
	        	b.append(type);
	        	b.append("\r\n");
	        	
	        	b.append("Content-Length: ");
	        	if (data != null)
	        		b.append(data.length);
	        	else
	        		b.append('0');
	        	b.append("\r\n");

	        	b.append("Connection: close\r\n");

	        	b.append("\r\n");
	        	
	            stream.write(b.toString().getBytes());
        	}
            if (data != null)
            	stream.write(data);
            stream.flush();
        }
    }
}
