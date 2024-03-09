package ukf.priscillaclient.filters

open class DomainWebFilter(val whitelist: Array<Regex>) : StandardWebFilter() {
    override fun isDomainAllowed(domain: String): Boolean {
        if (super.isDomainAllowed(domain)) {
            return true;
        }

        for (allowedDomain in whitelist) {
            if (domain.matches(allowedDomain)) {
                return true;
            }
        }

        return false;
    }

    class PriscillaWebFilter : DomainWebFilter(arrayOf(
        Regex(".*\\.fitped\\.eu"),
    )) {}
}