import { MessagePassingPort } from "@/domain/repo/chrome/message_passing";

export default class WebMessagePassing implements MessagePassingPort {
    async sendMessage(message: object) {
        const response = await chrome.runtime.sendMessage(message);
        console.log(response);
    }

    onMessage(callback: (request: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => any) {
        chrome.runtime.onMessage.addListener(callback);
    }
}