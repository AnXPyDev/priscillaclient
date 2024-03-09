package ukf.priscillaclient

import org.cef.browser.CefBrowser
import org.cef.browser.CefFrame
import org.cef.callback.CefAuthCallback
import org.cef.callback.CefCallback
import org.cef.handler.*
import org.cef.misc.BoolRef
import org.cef.misc.IntRef
import org.cef.misc.StringRef
import org.cef.network.CefCookie
import org.cef.network.CefRequest
import org.cef.network.CefResponse
import org.cef.network.CefURLRequest

class ProtectedRequestHandler(val filter: WebFilter) : CefRequestHandler {
    inner class CookieAccessFilter : CefCookieAccessFilter {
        override fun canSendCookie(
            browser: CefBrowser?,
            frame: CefFrame?,
            request: CefRequest?,
            cookie: CefCookie?
        ): Boolean {
            return true
        }

        override fun canSaveCookie(
            browser: CefBrowser?,
            frame: CefFrame?,
            request: CefRequest?,
            response: CefResponse?,
            cookie: CefCookie?
        ): Boolean {
            return true
        }

    }

    val cookieAccessFilter = CookieAccessFilter()

    inner class ResourceRequestHandler : CefResourceRequestHandler {
        override fun getCookieAccessFilter(
            browser: CefBrowser?,
            frame: CefFrame?,
            request: CefRequest?
        ): CefCookieAccessFilter {
            return cookieAccessFilter
        }

        override fun onBeforeResourceLoad(browser: CefBrowser?, frame: CefFrame?, request: CefRequest?): Boolean {
            request!!
            val allowed = filter.isUrlAllowed(request.url)
            if (!allowed) {
                println("${request.url} BLOCKED")
            }
            return !allowed
        }

        override fun getResourceHandler(
            browser: CefBrowser?,
            frame: CefFrame?,
            request: CefRequest?
        ): CefResourceHandler? {
            return null;
        }

        override fun onResourceRedirect(
            browser: CefBrowser?,
            frame: CefFrame?,
            request: CefRequest?,
            response: CefResponse?,
            new_url: StringRef?
        ) {
        }

        override fun onResourceResponse(
            browser: CefBrowser?,
            frame: CefFrame?,
            request: CefRequest?,
            response: CefResponse?
        ): Boolean {
            return false
        }

        override fun onResourceLoadComplete(
            browser: CefBrowser?,
            frame: CefFrame?,
            request: CefRequest?,
            response: CefResponse?,
            status: CefURLRequest.Status?,
            receivedContentLength: Long
        ) {
        }

        override fun onProtocolExecution(
            browser: CefBrowser?,
            frame: CefFrame?,
            request: CefRequest?,
            allowOsExecution: BoolRef?
        ) {
        }

    }

    val resourceRequestHandler = ResourceRequestHandler()

    override fun onBeforeBrowse(
        browser: CefBrowser?,
        frame: CefFrame?,
        request: CefRequest?,
        user_gesture: Boolean,
        is_redirect: Boolean
    ): Boolean {
        return false;
    }

    override fun onOpenURLFromTab(
        browser: CefBrowser?,
        frame: CefFrame?,
        target_url: String?,
        user_gesture: Boolean
    ): Boolean {
        println("onOpenURLFromTab: ${target_url}")
        return filter.isUrlAllowed(target_url!!);
    }

    override fun getResourceRequestHandler(
        browser: CefBrowser?,
        frame: CefFrame?,
        request: CefRequest?,
        isNavigation: Boolean,
        isDownload: Boolean,
        requestInitiator: String?,
        disableDefaultHandling: BoolRef?
    ): CefResourceRequestHandler {
        return resourceRequestHandler
    }


    override fun getAuthCredentials(
        browser: CefBrowser?,
        origin_url: String?,
        isProxy: Boolean,
        host: String?,
        port: Int,
        realm: String?,
        scheme: String?,
        callback: CefAuthCallback?
    ): Boolean {
        return false;
    }

    override fun onCertificateError(
        browser: CefBrowser?,
        cert_error: CefLoadHandler.ErrorCode?,
        request_url: String?,
        callback: CefCallback?
    ): Boolean {
        return false;
    }

    override fun onRenderProcessTerminated(browser: CefBrowser?, status: CefRequestHandler.TerminationStatus?) {
    }


}