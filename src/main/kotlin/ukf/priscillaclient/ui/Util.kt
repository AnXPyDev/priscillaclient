package ukf.priscillaclient.ui

import ukf.priscillaclient.Resources
import java.awt.Image
import java.awt.Insets
import javax.swing.ImageIcon

object Util {
    fun insets(p: Int): Insets {
        return Insets(p, p, p, p)
    }

    fun icon(path: String, w: Int, h: Int): ImageIcon {
        return ImageIcon(
            ImageIcon(Resources.getResourceAsURL(path))
                .image.getScaledInstance(w, h, Image.SCALE_SMOOTH)
        )
    }

    fun icon(path: String): ImageIcon {
        return icon(path, Resources.ui.icon_size, Resources.ui.icon_size)
    }


}