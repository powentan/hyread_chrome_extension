import { exportAnnotationButton, fileExportIcon } from '@/app/ui';
import $ from "cash-dom";
import { Book, BookSummary } from '@/domain/model/book';
import WebMessagePassing from '@/infra/adapter/chrome/web_message';
import { HyReadPageService } from '@/domain/service/hyread_page';
import HyReadServiceAdapter from './infra/adapter/hyread_service';
import WebMessagingService from './domain/service/web_message';
import { BackgroundCommand } from './domain/model/command';
import { HyReadLibraryCaptcha } from './utils/ocr';
import { AlertDialog } from '@/app/ui';


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
            const bookSummary: BookSummary = {
                brn: book.brn,
                title: book.title,
                cover: book.cover,
                progress: bookStatus?.progress,
                platform: bookStatus?.platform,
            };
            console.log(bookSummary);
            console.log(JSON.stringify(bookSummary).length);
            // append reading progress info
            let progress = '-';
            if(bookStatus != null) {
                progress = Math.floor((bookStatus?.progress || 0) * 100) + '%';
            }
            $(`.infor-list img[src*="${book.cover}"]`).parents('.cover').parent().next().append(
                `<div class="reading-progress" style="font-weight: bold; color: navy">閱讀進度(和掏金客活動進度無關)：${progress}</div>`
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
                await $menu.trigger('click');
                const $infoTab = $('[class^="TabBar__TabBarItem"]:last-child');
                await $infoTab.trigger('click');
                const $infoTab2 = $('.sc-1yt5cz8-0:last-child')
                await $infoTab2.trigger('click');
                const cover = $("[class^='InformationPanel__InformationCover']").attr('src') || $(".sc-1nomm8r-1 div").attr('src');
                const title = $("[class^='InformationPanel__InformationTitle']").text() || $(".sc-1nomm8r-4").text();
                // hide menu
                await $menu.trigger('click');

                const book: Book = {
                    assetUUID,
                    brn: eid,
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

let alertDialog = null;
async function init() {
    console.log('init content script')

    // append dialog UI
    // alertDialog = new AlertDialog();
    // alertDialog.showModal('密碼錯誤');
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
