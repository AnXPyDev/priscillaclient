export const Themes = ["light", "dark"] as const;

type Theme = typeof Themes[number];

let current_theme: Theme = Themes[0];

export function currentTheme() {
    return current_theme;
}

export function setTheme(theme: Theme = current_theme) {
    const root = document.documentElement;
    const toRemove: string[] = [];
    root.classList.forEach((value) => {
        if (value.startsWith("theme-")) {
            toRemove.push(value);
        }
    });

    root.classList.remove(...toRemove);
    root.classList.add("theme-" + theme);
}

export function rotateTheme() {
    current_theme = Themes[((Themes.indexOf(current_theme) ?? -1) + 1) % Themes.length];
    console.log(current_theme);
    setTheme();
}