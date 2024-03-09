package ukf.priscillaclient

import org.cef.browser.CefBrowser
import java.awt.BorderLayout
import javax.swing.JPanel

class WebView(val browser: CefBrowser) : JPanel() {
    init {
        layout = BorderLayout()
        add(browser.uiComponent)
    }
}