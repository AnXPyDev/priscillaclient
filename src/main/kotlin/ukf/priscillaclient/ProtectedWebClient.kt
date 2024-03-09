package ukf.priscillaclient

import org.cef.CefClient

class ProtectedWebClient(val client: CefClient, val filter: WebFilter?) {
    init {
        if (filter != null) {
            client.addRequestHandler(ProtectedRequestHandler(filter))
        }
    }

    fun webView(url: String?) = WebView(client.createBrowser(url, false, false))
}