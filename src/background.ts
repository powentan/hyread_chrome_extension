import ExtensionMessagePassing from "@/infra/adapter/chrome/extension_message";
import { exportToService } from "@/app/page";
import { BackgroundCommand } from "./domain/model/command";

const messagePassing = new ExtensionMessagePassing();

function reloadHyreadPages() {
    chrome.tabs.query({url: 'https://*.hyread.com.tw/*'}, (res) => {
        for(const tab of res) {
            if(tab.id != null) {
                chrome.tabs.reload(tab.id);
            }
        }
    });
}

messagePassing.onMessage(async (request: any, sender: chrome.runtime.MessageSender, sendResponse) => {
    console.log(request);
    const { command, payload, settings } = request;
    switch(command) {
        case BackgroundCommand.exporting:
            const result = await exportToService(payload.idNo, payload.book, settings);

            messagePassing.sendMessage({
                isOk: result,
            });
            break;
        case BackgroundCommand.reloadPages:
            reloadHyreadPages();
            break;
    }
    // sendResponse({
    //     isOK: result,
    // });
});

// open options page during updating and installation
chrome.runtime.onInstalled.addListener((details) => {
    if(details.reason === chrome.runtime.OnInstalledReason.UPDATE ||
       details.reason === chrome.runtime.OnInstalledReason.INSTALL
    ) {
        chrome.runtime.openOptionsPage();
        reloadHyreadPages();
    }
});
