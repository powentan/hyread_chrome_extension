import { SettingsPort } from "domain/repo/chrome/settings";
import { ExtensionSettings } from "domain/model/settings";

export default class ExtensionSettingsManager implements SettingsPort {
    async get(): Promise<ExtensionSettings> {
        const settings = await chrome.storage.sync.get(); 
        console.log(settings);
        return settings;
    }

    set(settings: object, callback: () => void): void {
        chrome.storage.sync.set(settings, callback);
    }
}