import { ExtensionSettings } from "./settings";

enum BackgroundCommand {
    exporting = 'exporting',
    reloadPages = 'reload_pages'
};

type BackgroundMessage = {
    command: BackgroundCommand,
    payload: any,
    settings: ExtensionSettings,
};

export {
    BackgroundCommand,
    BackgroundMessage,
};