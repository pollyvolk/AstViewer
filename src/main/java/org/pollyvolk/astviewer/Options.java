package org.pollyvolk.astviewer;

/**
 * Разобранные параметры командной строки
 */
class Options {
    /**
     * Название команды
     */
    public String action;

    /**
     * Конструктор для создания пустого параметра
     */
    private Options() {
        action = null;
    }

    /**
     * Разбирает параметры командной строки
     * @param args параметры, которые передаются в функцию main
     */
    public static Options parse(String[] args) {
        Options opt = new Options();
        opt.action = args[0];

        return opt;
    }
}

