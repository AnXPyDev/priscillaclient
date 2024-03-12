package ukf.priscillaclient

import kotlinx.serialization.DeserializationStrategy
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import java.io.InputStream
import java.net.URL
import java.nio.charset.Charset

object Resources {

    fun getResourceAsURL(path: String): URL? {
        return Resources::class.java.classLoader.getResource(path)
    }

    fun getResourceAsStream(path: String): InputStream? {
        return Resources::class.java.classLoader.getResourceAsStream(path)
    }

    fun getResourceAsString(path: String): String? {
        return (getResourceAsStream(path) ?: return null).readAllBytes().toString(Charset.defaultCharset())
    }

    fun <T> deserializeResourceFromJson(path: String, deserializationStrategy: DeserializationStrategy<T>): T {
        return Json.decodeFromString(deserializationStrategy, getResourceAsString(path) ?: "{}")
    }

    @Serializable
    data class UI(
        val padding: Int = 8,
        val button_padding: Int = 4,
        val icon_size: Int = 32
    )

    val ui: UI

    init {
        ui = deserializeResourceFromJson("ui.json", UI.serializer())
    }
}