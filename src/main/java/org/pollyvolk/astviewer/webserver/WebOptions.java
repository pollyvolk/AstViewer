package org.pollyvolk.astviewer.webserver;

/**
 * Настройки для запуска веб-сервера
 */
public class WebOptions {
	/**
	 * Порт, в адресной строке это значение после адреса: http://address:port?parameters
	 */
	public int port;

	/**
	 * Путь к папке, в которой лежат статичные файлы веб-интерфейса, например, файл index.html
	 */
	public String wwwRoot;

	/**
	 * Количество одновременно запускаемых потоков
	 */
	public int threadCount;

	/**
	 * Конструктор по умолчанию
	 */
	public WebOptions() {
		port = 8000;
		wwwRoot = "./www";
		threadCount = 16;
	}

	/**
	 * Конструктор с указанием рабочей директории
	 */
	public WebOptions(String wwwRoot) {
		port = 8000;
		this.wwwRoot = wwwRoot;
		threadCount = 16;
	}
}
