import { VanguardFeatureFactory } from "./VanguardFeature";
import { WatchForegroundWindowFactory } from "./features/WatchForegroundWindow";

const availableFeatures: {
    [name: string]: VanguardFeatureFactory
} = {
    "watch_foreground_window": new WatchForegroundWindowFactory()
}

export default availableFeatures;