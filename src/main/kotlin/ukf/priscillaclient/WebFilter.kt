package ukf.priscillaclient

interface WebFilter {
    fun isUrlAllowed(url: String): Boolean {
        return true;
    }
}