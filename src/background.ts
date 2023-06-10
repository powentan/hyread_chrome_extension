import ExtensionMessagePassing from "infra/adapter/chrome/extension_message";
import { exportToService } from "app/page";

const messagePassing = new ExtensionMessagePassing();

messagePassing.onMessage(async (request: any, sender: chrome.runtime.MessageSender, sendResponse) => {
    console.log(request);
    const { payload, settings } = request;
    const result = await exportToService(payload.idNo, payload.book, settings);

    messagePassing.sendMessage({
        isOk: result,
    });
    // sendResponse({
    //     isOK: result,
    // });
});
