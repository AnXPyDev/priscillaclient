export interface Rect {
    x: number, y: number, w: number, h: number
};

export interface DesktopConfiguration {
    apps: {
        name: string,
        start_open: boolean
    }[];
};

export interface RegisterParams {
    joinCode: string,
    name: string,
    url: string
};