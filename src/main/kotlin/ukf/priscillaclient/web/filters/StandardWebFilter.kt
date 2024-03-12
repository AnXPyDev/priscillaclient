package ukf.priscillaclient.web.filters

import ukf.priscillaclient.web.WebFilter

open class StandardWebFilter : WebFilter {
    val httpsPrefix = "https://"
    val resourcePrefixes = arrayOf(
        "cdn", "cdnjs", "fonts"
    )

    final override fun isUrlAllowed(url: String): Boolean {
        if (!url.startsWith(httpsPrefix)) {
            return false;
        }

        var domain = url.removePrefix(httpsPrefix);
        domain = domain.substring(0, domain.indexOf("/"))

        return isDomainAllowed(domain)
    }

    open fun isDomainAllowed(domain: String): Boolean {
        for (prefix in resourcePrefixes) {
            if (domain.startsWith(prefix)) {
                return true;
            }
        }

        return false;
    }
}