package org.pollyvolk.astviewer.webserver;

/**
 * Данные формы (одного контрола) на веб-странице
 */
public class FormData {
	/**
	 * Имя файла (если передан файл)
	 */
	private String fileName;

	/**
	 * Значение параметра или содержимое файла
	 */
	private String value;

	/**
	 * Конструктор
	 * @param value значение переданного параметра
	 */
	FormData(String value) {
		this.value = value;
	}

	/**
	 * Конструктор
	 * @param fileName имя файла
	 * @param value содержимое файла
	 */
	FormData(String fileName, String value) {
		this.fileName = fileName;
		this.value = value;
	}

	/**
	 * @return true если передаваемый параметр является файлом
	 */
	public boolean isFile() {
		return fileName != null;
	}

	/**
	 * @return имя файла (или null)
	 */
	public String getFileName() {
		return fileName;
	}

	/**
	 * @return значение параметра или содержимое файла
	 */
	public String getValue() {
		return value;
	}
}
