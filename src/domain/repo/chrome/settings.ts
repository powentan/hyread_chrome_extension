import { ExtensionSettings } from "@/domain/model/settings";

export interface SettingsPort {
    get(): Promise<ExtensionSettings>;
    set(settings: object, callback: () => void): void;
}