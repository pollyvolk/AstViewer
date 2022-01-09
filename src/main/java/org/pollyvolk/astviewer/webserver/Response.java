package org.pollyvolk.astviewer.webserver;

/**
 * Ответ, который возвращается веб-интерфейсу
 */
public interface Response {
	/**
	 * @return тип возвращаемого контента, например, plain/text или application/json
	 */
	String getContentType();

	/**
	 * @return возвращаемые данные
	 */
	byte[] getData();
}
