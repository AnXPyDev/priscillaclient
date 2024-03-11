package ukf.priscillaclient

import javafx.application.Application
import javafx.scene.Group
import javafx.scene.Scene
import javafx.scene.web.WebView
import javafx.stage.Stage

class PriscillaClient : Application() {
    override fun start(stage: Stage?) {
        stage!!

        val root = Group()

        val web = WebView()
        web.engine.load("https://priscilla.fitped.eu")

        println("User agent: ${web.engine.userAgent}")

        root.children.add(web)

        val scene = Scene(root, 1280.0, 720.0);

        scene.widthProperty().addListener { observable, oldValue, newValue ->  web.prefWidth = newValue.toDouble() }
        scene.heightProperty().addListener { observable, oldValue, newValue ->  web.prefHeight = newValue.toDouble() }

        stage.title = "Priscilla Client OpenJFX test"
        stage.scene = scene
        stage.show()
    }
}