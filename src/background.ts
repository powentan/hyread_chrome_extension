import ExtensionMessagePassing from "infra/adapter/chrome/extension_message";
import { exportToService } from "app/page";
import { ExportingType } from "domain/repo/exporting";

const messagePassing = new ExtensionMessagePassing();

messagePassing.onMessage(async (request: any, sender: chrome.runtime.MessageSender, sendResponse) => {
    const { idNo, book, accessToken, exportingType } = request;

    switch(exportingType) {
        case ExportingType.File:
            await exportToService(idNo, book);
            break;
        case ExportingType.Readwise:
            await exportToService(idNo, book, accessToken, exportingType)
            break;
    }

    // sendResponse({});
    messagePassing.sendMessage({});
});
