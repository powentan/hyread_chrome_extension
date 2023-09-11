import ExtensionMessagePassing from "@/infra/adapter/chrome/extension_message";
import { exportToService } from "@/app/page";

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

// open options page during updating and installation
chrome.runtime.onInstalled.addListener((details) => {
    if(details.reason === chrome.runtime.OnInstalledReason.UPDATE ||
       details.reason === chrome.runtime.OnInstalledReason.INSTALL
    ) {
        chrome.runtime.openOptionsPage();
    }
});

chrome.tabs.query({url: 'https://*.hyread.com.tw/*'}, (res) => {
    for(const tab of res) {
        if(tab.id != null) {
            chrome.tabs.reload(tab.id);
        }
    }
})