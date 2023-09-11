import { exportAnnotationButton, fileExportIcon } from '@/app/ui';
import $ from "cash-dom";
import { Book } from '@/domain/model/book';
import ExtensionSettingsManager from '@/infra/adapter/extension_settings';
import { ExtensionSettings } from '@/domain/model/settings';
import WebMessagePassing from '@/infra/adapter/chrome/web_message';
import { HyReadPageService } from '@/domain/service/hyread_page';


async function sendExportMesssage(settings: ExtensionSettings, payload: any, webMessagePassing: WebMessagePassing) {
    const message = {
        payload,
        settings,
    };
    await webMessagePassing.sendMessage({
        payload,
        settings,
    });
}

const webMessagePassing = new WebMessagePassing();

async function init() {
    console.log('init content script')
    const idNo = $('[name="readerCode"]').val() as string;

    const hyreadPageService = new HyReadPageService(idNo);

    const books = hyreadPageService.getBooks();

    for(const book of books) {
        console.log(book);
    }
    // append dialog UI
    //  $('.main_content').append($(exportDialog));
    // inject for bookcase and historical
    $.each($('.infor-list .toolbarblock .toolbar:last-child'), (index, elem) => {
        const firstItemText = $($('.infor-list .toolbarblock .toolbar:first-child')[index]).text().trim();
        if(firstItemText === '線上閱讀') {
            const $exportButton = $(exportAnnotationButton).clone();
            $(elem).after($exportButton);
            $(elem).next().on('click', async e => {
                const settings = await settingsManager.get();
                $(e.target).addClass('disabled');
                console.log(idNo);
                console.log(e.currentTarget);
                // toolbarblock
                let $toolbarblock = $(e.currentTarget).parent();
                let $inforList = $toolbarblock.parent();
                const book = hyreadPageService.getBookInfo($inforList);

                // wait for complete
                webMessagePassing.onMessage((request) => {
                    const { isOk } = request;
                    $(e.target).removeClass('disabled');
                });
                await sendExportMesssage(settings, {
                    idNo,
                    book,
                }, webMessagePassing);
            });
        }
    });

    // inject for online reader
    if(window.location.pathname.indexOf('/openbook2.jsp') !== -1) {
        let timeout = 0;
        const intervalId = setInterval(() => {
            // clone an existing element for exporting
            const $export = $('[aria-label="搜尋"]')
                .clone().addClass('export').attr('aria-label', '匯出')
                .html(fileExportIcon)
                .on('click', async e => {
                    const settings = await settingsManager.get();
                    $(e.currentTarget).css('display', 'none');

                    let $menu = $('[aria-label="目次"]');
                    let search = new URL(window.location.href).searchParams;
                    const assetUUID = search.get('asset_id');
                    const idNo = search.get('userId') || '';
                    // show menu
                    $menu.trigger('click');
                    const $infoTab = $('[class^="TabBar__TabBarItem"]:last-child');
                    $infoTab.trigger('click');
                    const cover = $("[class^='InformationPanel__InformationCover']").attr('src');
                    const title = $("[class^='InformationPanel__InformationTitle']").text();
                    // hide menu
                    $menu.trigger('click');

                    const book: Book = {
                        assetUUID,
                        cover,
                        title,
                    };

                    webMessagePassing.onMessage((request) => {
                        const { isOk } = request;
                        $(e.currentTarget).css('display', 'inherit');
                    });
                    await sendExportMesssage(settings, {
                        idNo,
                        book,
                    }, webMessagePassing);
                });
            if($export.length !== 0) {
                clearInterval(intervalId);
                $('[aria-label="搜尋"]').after($export);
            } else if(timeout === 10) {
                clearInterval(intervalId);
            }
            timeout += 1;
        }, 1000);
    }
}

const settingsManager = new ExtensionSettingsManager();
$(document).ready(async function() {
    init();
});
