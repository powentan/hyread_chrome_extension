import { SettingsPort } from "@/domain/repo/chrome/settings";
import { ExtensionSettings, defaultExtensionSettings } from "@/domain/model/settings";

export default class ExtensionSettingsManager implements SettingsPort {
    async get(): Promise<ExtensionSettings> {
        const settings = await chrome.storage.sync.get(); 
        console.log(settings);
        return {
            fileExport: {
                ...defaultExtensionSettings.fileExport,
                ...settings.fileExport,
            },
            readwise: {
                ...defaultExtensionSettings.readwise,
                ...settings.readwise,
            },
            annotation: {
                ...defaultExtensionSettings.annotation,
                ...settings.annotation,
            },
            exportDefault: settings.exportDefault || defaultExtensionSettings.exportDefault,
            version: settings.version || defaultExtensionSettings.version,
        };
    }

    set(settings: object, callback: () => void): void {
        chrome.storage.sync.set(settings, callback);
    }
}