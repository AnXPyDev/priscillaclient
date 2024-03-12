package ukf.priscillaclient.ui

import com.formdev.flatlaf.FlatDarkLaf
import com.formdev.flatlaf.FlatLightLaf
import com.formdev.flatlaf.themes.FlatMacDarkLaf
import ukf.priscillaclient.web.CefManager
import ukf.priscillaclient.web.ProtectedWebClient
import ukf.priscillaclient.components.WebView
import ukf.priscillaclient.web.filters.DomainWebFilter
import java.awt.BorderLayout
import java.awt.Dimension
import javax.swing.*

class PriscillaClient : JFrame() {

    val url_priscilla = "https://priscilla.fitped.eu"
    val url_translator = "https://translate.google.com"

    val cefManager: CefManager = CefManager()
    val toolBar: ToolBar


    val priscillaClient: ProtectedWebClient
    val translatorClient: ProtectedWebClient

    val mainWebView: WebView

    var theme: LookAndFeel? = null
        set(value: LookAndFeel?) {
            value ?: return
            println(value)
            UIManager.setLookAndFeel(value)
            SwingUtilities.updateComponentTreeUI(this)
        }

    init {

        theme = FlatDarkLaf()

        priscillaClient = cefManager.client(DomainWebFilter.PriscillaWebFilter())
        translatorClient = cefManager.client(null)

        mainWebView = priscillaClient.webView(url_priscilla)

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
        contentPane.add(toolBar, BorderLayout.WEST)
        pack()
    }
}