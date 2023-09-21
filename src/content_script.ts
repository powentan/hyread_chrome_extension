import { exportAnnotationButton, fileExportIcon } from '@/app/ui';
import $ from "cash-dom";
import { Book } from '@/domain/model/book';
import WebMessagePassing from '@/infra/adapter/chrome/web_message';
import { HyReadPageService } from '@/domain/service/hyread_page';
import HyReadServiceAdapter from './infra/adapter/hyread_service';
import WebMessagingService from './domain/service/web_message';
import { BackgroundCommand } from './domain/model/command';
import { HyReadLibraryCaptcha } from './utils/ocr';


const webMessagePassing = new WebMessagePassing();
const webMessaingService = new WebMessagingService(webMessagePassing);

async function fillAndSubmitLoginForm(idNo: string, password: string) {
    const captcha = new HyReadLibraryCaptcha();
    await captcha.tryToFillCaptcha();
    $('[name=account2').val(idNo);
    $('#psw').val(password);
    const form: HTMLFormElement | null = document.getElementById('loginForm') as HTMLFormElement;
    if(form != null) {
        form.submit();
    }
}

function injectBookcaseAndHistory(idNo: string) {
    console.log('inject bookcase and history');
    const hyreadPageService = new HyReadPageService(idNo);

    $.each($('.infor-list .toolbarblock .toolbar:last-child'), (index, elem) => {
        const firstItemText = $($('.infor-list .toolbarblock .toolbar:first-child')[index]).text().trim();
        if(firstItemText === '線上閱讀') {
            const $exportButton = $(exportAnnotationButton).clone();
            $(elem).after($exportButton);
            $(elem).next().on('click', async e => {
                $(e.target).addClass('disabled');
                // toolbarblock
                let $toolbarblock = $(e.currentTarget).parent();
                let $inforList = $toolbarblock.parent();
                const book = hyreadPageService.getBookInfo($inforList);

                webMessaingService.onMessageFromBackground((request) => {
                    const { isOk } = request;
                    $(e.target).removeClass('disabled');
                });
                await webMessaingService.sendToBackground(BackgroundCommand.exporting, {
                    idNo,
                    book,
                });
            });
        }
    });


    // get books info
    const books = hyreadPageService.getBooks($('.infor-list'));
    const hyreadService = new HyReadServiceAdapter(idNo);

    for(const book of books) {
        (async function() {
            const bookStatus = await hyreadService.getReadingProgress(book);
            console.log(`bookStatus=${JSON.stringify(bookStatus)}`);
            book.status = bookStatus;
            console.log(book);
            console.log(JSON.stringify(book).length);
            // append reading progress info
            let progress = '-';
            if(bookStatus != null) {
                progress = Math.floor((bookStatus?.progress || 0) * 100) + '%';
            }
            $(`.infor-list img[src*="${book.cover}"]`).parents('.cover').parent().next().append(
                `<div class="reading-progress" style="font-weight: bold; color: navy">閱讀進度：${progress}</div>`
            );
        })();
    }
}

function injectOnlineReading() {
    console.log('inject online reading');
    let timeout = 0;
    const intervalId = setInterval(() => {
        // clone an existing element for exporting
        const $export = $('[aria-label="搜尋"]')
            .clone().addClass('export').attr('aria-label', '匯出')
            .html(fileExportIcon)
            .on('click', async e => {
                $(e.currentTarget).css('display', 'none');

                let $menu = $('[aria-label="目次"]');
                let search = new URL(window.location.href).searchParams;
                const assetUUID = search.get('asset_id');
                const eid = search.get('eid');
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
                    eid,
                    cover,
                    title,
                };

                webMessaingService.onMessageFromBackground((request) => {
                    const { isOk } = request;
                    $(e.currentTarget).css('display', 'inherit');
                });
                await webMessaingService.sendToBackground(BackgroundCommand.exporting, {
                    idNo,
                    book,
                });
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

async function init() {
    console.log('init content script')

    // append dialog UI
    //  $('.main_content').append($(exportDialog));
    const pathname = window.location.pathname;
    // 我的書櫃和借閱歷史頁面
    if(
        pathname.includes('/member/Myebook.jsp')
        || pathname.includes('/member/Mylendhistory.jsp')
    ) {
        const idNo = $('[name="readerCode"]').val() as string;
        injectBookcaseAndHistory(idNo);
    }

    // 線上閱讀器頁面邏輯
    else if(pathname.includes('/openbook2.jsp')) {
        injectOnlineReading();
    }

    // 登入頁面邏輯
    else if(window.location.pathname.includes('/Template/RWD3.0/liblogin.jsp')) {
        // TODO:
        setTimeout(async function() {
            try {
                // await fillAndSubmitLoginForm('xxx', 'xxx');
            } catch {
                console.log('try fill and submit login form');
            }
        }, 500);
    }
}

$(document).ready(async function() {
    init();
});
