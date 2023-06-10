import { MessagePassingPort } from "domain/repo/chrome/message_passing";

export default class ExtensionMessagePassing implements MessagePassingPort {
    async sendMessage(message: object) {
        const [tab] = await chrome.tabs.query(
            {
                active: true,
                lastFocusedWindow: true,
            }
        );
        if(tab != null && tab.id != null) {
            const response = await chrome.tabs.sendMessage(tab.id, message);
            console.log(response);
        } else {
            console.error('tab is not found');
            console.log(tab);
        }
    }

    onMessage(callback: (request: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => any) {
        chrome.runtime.onMessage.addListener(callback);
    }
}
