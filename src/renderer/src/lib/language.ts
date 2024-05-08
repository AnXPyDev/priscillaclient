export enum Language {
    ENGLISH, SLOVAK, UKRAINIAN
};

export const Languages = [
    Language.ENGLISH,
    Language.SLOVAK,
    Language.UKRAINIAN
];


const translations = {
    [Language.SLOVAK]: await import('@/assets/translations/slovak.json'),
    [Language.UKRAINIAN]: await import('@/assets/translations/ukrainian.json'),
    [Language.ENGLISH]: await import('@/assets/translations/english.json')
};

export function getString(name: string, language: Language) {
    let value = (translations[language] as any)[name] as string | undefined;
    return value ?? `?${name}?`;
}