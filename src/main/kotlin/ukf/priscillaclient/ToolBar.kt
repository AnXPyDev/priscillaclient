package ukf.priscillaclient

import java.awt.FlowLayout
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
        layout = FlowLayout()

        priscillaButton = JButton("Priscilla")
        priscillaButton.addActionListener { priscillaButtonCallback() }

        translatorButton = JButton("Translator")
        translatorButton.addActionListener { translatorButtonCallback() }

        lightThemeButton = JButton("Light")
        lightThemeButton.addActionListener { lightThemeCallback() }

        darkThemeButton = JButton("Dark")
        darkThemeButton.addActionListener { darkThemeCallback() }

        add(priscillaButton)
        add(translatorButton)
        add(lightThemeButton)
        add(darkThemeButton)
    }

}