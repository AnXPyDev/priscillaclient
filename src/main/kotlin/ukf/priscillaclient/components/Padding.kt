package ukf.priscillaclient.components

import ukf.priscillaclient.Resources
import ukf.priscillaclient.ui.Util
import java.awt.Component
import java.awt.Insets
import javax.swing.BoxLayout
import javax.swing.JPanel
import javax.swing.border.EmptyBorder

class Padding : JPanel {
    val component: Component

    private fun setup(insets: Insets) {
        layout = BoxLayout(this, BoxLayout.X_AXIS)
        border = EmptyBorder(insets)
    }

    constructor(component_: Component) : super() {
        component = component_
        add(component)
        setup(Util.insets(Resources.ui.padding))
    }
    constructor(component_: Component, padding: Int) : super() {
        component = component_
        add(component)
        setup(Util.insets(padding))
    }

    constructor(component_: Component, insets: Insets) : super() {
        component = component_
        add(component)
        setup(insets)
    }
}