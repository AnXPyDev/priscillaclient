package ukf.priscillaclient


import me.friwi.jcefmaven.*;
import org.cef.*;
import org.cef.CefSettings.ColorType

class CefManager {
    val builder: CefAppBuilder
    val app: CefApp
    val client: CefClient

    init {
        builder = CefAppBuilder()
        builder.cefSettings.windowless_rendering_enabled = false
        app = builder.build()
        client = app.createClient()
    }

    fun webView(url: String?) = WebView(this,
            client.createBrowser(url ?: "https://localhost", false, false)
        )
}