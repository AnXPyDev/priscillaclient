package ukf.priscillaclient.web

interface WebFilter {
    fun isUrlAllowed(url: String): Boolean {
        return true;
    }
}