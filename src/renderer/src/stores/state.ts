import { defineStore } from "pinia";

interface State {
    loading: number
    desktop_obstructed: number
    lockdown_mode: boolean
    current_route: string
    connected: boolean
}

export const useState = defineStore('status', {
    state: (): State => ({
        loading: 0,
        desktop_obstructed: 0,
        lockdown_mode: false,
        current_route: "entry",
        connected: false
    })
});