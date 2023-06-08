import { exportAnnotationButton, fileExportIcon } from './app/ui';
import $ from "cash-dom";
import { Cash } from "cash-dom";
import { Book } from './domain/model/book';
import { exportToService } from './app/page';
import ExtensionSettingsManager from 'infra/adapter/extension_settings';
import { ExtensionSettings } from 'domain/model/settings';
import { ExportingType } from 'domain/repo/exporting';
import WebMessagePassing from 'infra/adapter/chrome/web_message';


function parseOnlineReadingUrl(url: string): Book {
    let search = new URL(url, window.location.origin).searchParams;
    const brn = search.get('brn');

    if(brn) {
        return {
            brn: brn,
        }
    } else {
        return {
            assetUUID: search.get('asstuuid'),
            eid: search.get('eid'),
            ownerCode: search.get('owner_code'),
        }
    }
}

function parseBookInfo($toolbarblock: Cash, $inforList: Cash): Book {
    let title = $inforList.find('h3.title').text();
    let coverElem = $inforList.find('.cover img')[0];
    let cover = '';
    if(coverElem) {
        cover = $(coverElem).attr('src')?? '';
    }

    console.log($toolbarblock);
    let href = $toolbarblock.find('.toolbar:first-child a').attr('href');
    console.log(`href=${href}`);
    let book = parseOnlineReadingUrl(href?? '');
    // add more info for the book
    book.title = title;
    book.cover = cover;
    console.log(book);

    return book;
}

async function sendExportMesssage(settings: ExtensionSettings, payload: any, webMessagePassing: WebMessagePassing) {
    const exportDefault = settings.export_default;

    switch(exportDefault) {
        case ExportingType.Readwise:
            await webMessagePassing.sendMessage({
                ...payload,
                exportingType: exportDefault,
            });
            break;
        case ExportingType.File:
            await webMessagePassing.sendMessage({
                ...payload,
                exportingType: exportDefault,
            });
            break;
    }
}

const webMessagePassing = new WebMessagePassing();

async function init() {
    console.log('init content script')
    const idNo = $('[name="readerCode"]').val() as string;

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
                const book = parseBookInfo($toolbarblock, $inforList)

                // wait for complete
                webMessagePassing.onMessage(() => {
                    $(e.target).removeClass('disabled');
                });
                await sendExportMesssage(settings, {
                    idNo,
                    book,
                    accessToken: settings.readwise?.accessToken,
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

                    webMessagePassing.onMessage(() => {
                        $(e.currentTarget).css('display', 'inherit');
                    });
                    await sendExportMesssage(settings, {
                        idNo,
                        book,
                        accessToken: settings.readwise?.accessToken,
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
