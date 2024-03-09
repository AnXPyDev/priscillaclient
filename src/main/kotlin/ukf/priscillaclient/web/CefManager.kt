package ukf.priscillaclient.web


import me.friwi.jcefmaven.*;
import org.cef.*;

class CefManager {
    val builder: CefAppBuilder
    val app: CefApp

    init {
        builder = CefAppBuilder()
        builder.cefSettings.windowless_rendering_enabled = false
        app = builder.build()
    }

    fun client(filter: WebFilter?) = ProtectedWebClient(app.createClient(), filter)
}