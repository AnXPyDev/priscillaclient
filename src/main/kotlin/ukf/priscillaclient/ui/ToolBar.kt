package ukf.priscillaclient.ui

import ukf.priscillaclient.Resources
import ukf.priscillaclient.components.Button
import ukf.priscillaclient.components.Padding
import java.awt.Dimension
import javax.swing.BoxLayout
import javax.swing.ImageIcon
import javax.swing.JButton
import javax.swing.JPanel

class ToolBar : JPanel() {
    val priscillaButton: JButton
    val translatorButton: JButton
    val darkThemeButton: JButton
    val lightThemeButton: JButton

    var priscillaButtonCallback: () -> Unit = {}
    var translatorButtonCallback: () -> Unit = {}
    var lightThemeCallback: () -> Unit = {}
    var darkThemeCallback: () -> Unit = {}

    init {
        layout = BoxLayout(this, BoxLayout.Y_AXIS)
        priscillaButton = JButton(Util.icon("priscilla.png"))
        priscillaButton.toolTipText = "Priscilla home page"
        priscillaButton.addActionListener { priscillaButtonCallback() }

        translatorButton = JButton(Util.icon("translate.png"))
        translatorButton.addActionListener { translatorButtonCallback() }

        lightThemeButton = JButton("L")
        lightThemeButton.addActionListener { lightThemeCallback() }

        darkThemeButton = JButton("D")
        darkThemeButton.addActionListener { darkThemeCallback() }

        add(Padding(priscillaButton))
        add(Padding(translatorButton))
        add(Padding(lightThemeButton))
        add(Padding(darkThemeButton))
    }

}