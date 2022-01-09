package org.pollyvolk.astviewer.webserver;

import java.util.Map;

/**
 * Обработчик запросов из веб-интерфейса
 */
public interface Handler {
	/**
	 * Обрабатывает запрос, содержащий параметры, например, http://localhost:8000?param_1=xxx&param_2=yyy
	 * @param request Распарсенные параметры запроса
	 * @return Ответ веб-интерфейсу
	 */
	Response handle(Map<String, FormData> request);

	/**
	 * Обрабатывает запрос, не содержащий параметры, но содержащий некоторый адрес, например,
	 *    http://localhost:8000/path/to/file
	 * Такой адрес можно перехватить и вернуть некоторые данные (если это требуется алгоритмом)
	 * Если вернуть null, веб-сервер будет пытаться найти этот файл в папке, указанной в параметре
	 * wwwRoot класса Options.
	 * @param address Адрес
	 * @return Ответ веб-интерфейсу
	 */
	Response handle(String address);
}
