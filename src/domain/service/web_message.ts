import { MessagePassingPort } from "../repo/chrome/message_passing";
import ExtensionSettingsManager from "@/infra/adapter/extension_settings";
import { BackgroundCommand, BackgroundMessage } from "../model/command";

export default class WebMessagingService {
    channel: MessagePassingPort;

    constructor(channel: MessagePassingPort) {
        this.channel = channel;
    }

    async sendToBackground(command: BackgroundCommand, payload: any = {}) {
        const settingsManager = new ExtensionSettingsManager();
        const settings = await settingsManager.get();
        const message: BackgroundMessage = {
            command,
            payload,
            settings,
        };
        await this.channel.sendMessage(message);
    }

    onMessageFromBackground(callback: (
        request: any,
        sender: chrome.runtime.MessageSender,
        sendResponse: (response?: any) => void
    ) => any) {
        this.channel.onMessage(callback);
    }
}