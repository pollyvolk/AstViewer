package org.pollyvolk.astviewer;

import org.pollyvolk.astviewer.webserver.FormData;
import org.pollyvolk.astviewer.webserver.Handler;
import org.pollyvolk.astviewer.webserver.Response;

import java.util.Map;

public class ViewerWebInterface implements Handler {
    /**
     * Конструктор веб-интерфейса
     */
    ViewerWebInterface() {
    }

    /**
     * Обрабатывает запрос, содержащий параметры, например, http://localhost:8000?param_1=xxx&param_2=yyy
     * @param request Распарсенные параметры запроса
     * @return Ответ веб-интерфейсу
     */
    @Override
    public Response handle(Map<String, FormData> request) {
        if (request.containsKey("action")) {
            String action = request.get("action").getValue();
            // Разбор запросов.
        }

        return new Response() {
            @Override
            public String getContentType() {
                return "application/json";
            }

            @Override
            public byte[] getData() {
                return "{ }".getBytes();
            }
        };
    }

    /**
     * Обрабатывает запрос, не содержащий параметров.
     * В данной реализации мы пока не обрабатываем такие запросы
     * @param address Адрес
     * @return всегда null, но в будущем все может поменяться
     */
    @Override
    public Response handle(String address) {
        return null;
    }

    /**
     * Имплементация интерфейса Response, возвращающая целое число
     */
    static private class IntResponse implements Response {
        int value;

        IntResponse(int value) {
            this.value = value;
        }

        @Override
        public String getContentType() {
            return "application/json";
        }

        @Override
        public byte[] getData() {
            String data = "{\"value\":" + value + '}';
            return data.getBytes();
        }
    }

    /**
     * Имплементация интерфейса Response, возвращающая текст
     */
    static private class TextResponse implements Response {
        String value;

        TextResponse(String value) {
            this.value = value;
        }

        @Override
        public String getContentType() {
            return "plain/text";
        }

        @Override
        public byte[] getData() {
            return value.getBytes();
        }
    }

    /**
     * Имплементация интерфейса Response, возвращающая булевое значение
     */
    static private class BooleanResponse implements Response {
        boolean value;

        BooleanResponse(boolean value) {
            this.value = value;
        }

        @Override
        public String getContentType() {
            return "application/json";
        }

        @Override
        public byte[] getData() {
            String data = "{\"value\":" + value + '}';
            return data.getBytes();
        }
    }
}
