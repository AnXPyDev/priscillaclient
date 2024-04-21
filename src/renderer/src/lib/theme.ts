export const Themes = ["light", "dark"] as const;

export type Theme = typeof Themes[number];

export function setTheme(theme: Theme) {
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