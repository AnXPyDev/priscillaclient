package ukf.priscillaclient.web

import org.cef.CefClient
import ukf.priscillaclient.components.WebView

class ProtectedWebClient(val client: CefClient, val filter: WebFilter?) {
    init {
        if (filter != null) {
            client.addRequestHandler(ProtectedRequestHandler(filter))
        }
    }

    fun webView(url: String?) = WebView(client.createBrowser(url, false, false))
}