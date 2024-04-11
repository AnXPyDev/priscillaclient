export enum Languages {
    SLOVAK, UKRAINIAN, ENGLISH
};

const translations = {
    [Languages.SLOVAK]: await import('@/assets/translations/slovak.json'),
    [Languages.UKRAINIAN]: await import('@/assets/translations/ukrainian.json'),
    [Languages.ENGLISH]: await import('@/assets/translations/english.json')
};

export function getString(name: string, language: Languages) {
    let value = (translations[language] as any)[name] as string | undefined;
    return value ?? `?${name}?`;
}