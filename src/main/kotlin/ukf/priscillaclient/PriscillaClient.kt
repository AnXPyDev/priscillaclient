package ukf.priscillaclient

import java.awt.Dimension
import javax.swing.JFrame

class PriscillaClient : JFrame() {

    val cefManager: CefManager
    val mainWebView: WebView


    init {
        cefManager = CefManager()
        mainWebView = cefManager.webView("https://priscilla.fitped.eu")

        title = "Priscilla Client"
        size = Dimension(1280, 720)

        setupUi()

        isVisible = true
    }

    fun setupUi() {
        add(mainWebView)
    }
}