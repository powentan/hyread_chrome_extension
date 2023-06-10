import ExtensionMessagePassing from "infra/adapter/chrome/extension_message";
import { exportToService } from "app/page";
import { ExportingType } from "domain/repo/exporting";
import { ExtensionSettings } from "domain/model/settings";

const messagePassing = new ExtensionMessagePassing();

messagePassing.onMessage(async (request: any, sender: chrome.runtime.MessageSender) => {
    console.log(request);
    const { payload, settings } = request;
    const result = await exportToService(payload.idNo, payload.book, settings);

    messagePassing.sendMessage({
        isOk: result,
    });
});
