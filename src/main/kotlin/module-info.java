module priscillaclient {
    requires kotlin.stdlib;

    requires javafx.base;
    requires javafx.controls;
    requires javafx.graphics;
    requires javafx.media;
    requires javafx.web;
    requires javafx.fxml;
    requires javafx.swing;

    opens ukf.priscillaclient to javafx.fxml;

    exports ukf.priscillaclient;

}