package ukf.priscillaclient.components

import com.formdev.flatlaf.ui.FlatEmptyBorder
import com.formdev.flatlaf.ui.FlatRoundBorder
import ukf.priscillaclient.Resources
import ukf.priscillaclient.ui.Util
import javax.swing.Icon
import javax.swing.JButton
import javax.swing.border.EmptyBorder

class Button : JButton {
    constructor(icon: Icon) : super(icon) {
        setBorders()
    }
    constructor(text: String) : super(text) {
        setBorders()
    }

    private fun setBorders() {
        border = FlatEmptyBorder(Util.insets(Resources.ui.button_padding))
    }
}