module priscillaclient {
    requires kotlin.stdlib;
    requires kotlinx.serialization.json;

    requires jcef;
    requires jcefmaven;
    requires java.desktop;

    requires com.formdev.flatlaf;

    exports ukf.priscillaclient;
}