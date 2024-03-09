package ukf.priscillaclient

import org.cef.browser.CefBrowser
import java.awt.BorderLayout
import java.awt.Dimension
import java.awt.FlowLayout
import javax.swing.JPanel

class WebView(manager_: CefManager, browser_: CefBrowser) : JPanel() {
    val manager = manager_;
    val browser = browser_;

    init {
        layout = BorderLayout()
        add(browser.uiComponent)
    }

    fun component() = browser.uiComponent
}