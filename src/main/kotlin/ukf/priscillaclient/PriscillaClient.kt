package ukf.priscillaclient

import com.formdev.flatlaf.FlatDarkLaf
import com.formdev.flatlaf.FlatLightLaf
import java.awt.BorderLayout
import java.awt.Dimension
import javax.swing.*

class PriscillaClient : JFrame() {

    val url_priscilla = "https://priscilla.fitped.eu"
    val url_translator = "https://translate.google.com"

    val cefManager: CefManager = CefManager()
    val toolBar: ToolBar

    val mainWebView: WebView

    var theme: LookAndFeel? = null
        set(value: LookAndFeel?) {
            value ?: return
            println(value)
            UIManager.setLookAndFeel(value)
            SwingUtilities.updateComponentTreeUI(this)
        }

    init {
        mainWebView = cefManager.webView(url_priscilla)
        toolBar = ToolBar()

        title = "Priscilla Client"

        setupUi()
        setupHooks()

        size = Dimension(1280, 720)

        isVisible = true
    }

    fun setupHooks() {
        toolBar.priscillaButtonCallback = { mainWebView.browser.loadURL(url_priscilla) }
        toolBar.translatorButtonCallback = { mainWebView.browser.loadURL(url_translator) }
        toolBar.lightThemeCallback = { theme = FlatLightLaf() }
        toolBar.darkThemeCallback = { theme = FlatDarkLaf() }
    }

    fun setupUi() {
        contentPane.layout = BorderLayout()
        contentPane.add(mainWebView, BorderLayout.CENTER)
        contentPane.add(toolBar, BorderLayout.SOUTH)
        pack()
    }
}