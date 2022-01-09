package org.pollyvolk.astviewer;

import org.pollyvolk.astviewer.webserver.Server;
import org.pollyvolk.astviewer.webserver.WebOptions;

import java.sql.SQLException;

/**
 * Стартовый класс, с которого запускается веб-страница
 */
public class Main {
    public static void main(String[] args) throws SQLException {
        Options opt = Options.parse(args);

        if ("ast-viewer".equals(opt.action)) {
            WebOptions webOpts =
                    new WebOptions("./www/viewer");
            Server.start(webOpts, new ViewerWebInterface());
            System.out.println("Server started");
        }
    }
}
