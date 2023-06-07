export interface MessagePassingPort {
    sendMessage(message: object): any;
    onMessage(
        callback: (
            request: any,
            sender: chrome.runtime.MessageSender,
            sendResponse: (response?: any) => void
        ) => any
    ): any;
}