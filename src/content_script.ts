import { exportAnnotationButton } from './app/ui';
import $ from "cash-dom";
import { Cash } from "cash-dom";
import { Book } from './domain/model/book';
import { downloadFile } from './app/page';

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

function init() {
    console.log('init content script')
    const idNo = $('[name="readerCode"]').val();

    // inject for bookcase and historical
    const $exportButton = $(exportAnnotationButton);
    $('.infor-list .toolbarblock .toolbar:last-child').after($exportButton);
    $('.infor-list .toolbarblock .toolbar:last-child').on('click', async e => {
        $(e.target).addClass('disabled');
        console.log(idNo);
        console.log(e.currentTarget);
        // toolbarblock
        let $toolbarblock = $(e.currentTarget).parent();
        let $inforList = $toolbarblock.parent();
        const book = parseBookInfo($toolbarblock, $inforList)

        // XXX: fix typing issue
        let _idNo = '';
        if(typeof idNo === 'string') {
            _idNo = idNo;
        } else {
            _idNo = idNo[0];
        }

        await downloadFile(_idNo, book);

        $(e.target).removeClass('disabled');
    });
    // inject for online reader
    if(window.location.pathname.indexOf('/openbook2.jsp') !== -1) {
        const intervalId = setInterval(() => {
            // clone an existing element for exporting
            const $export = $('[aria-label="搜尋"]').clone().addClass('export').on('click', async e => {
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

                await downloadFile(idNo, book);
            });
            if($export.length !== 0) {
                clearInterval(intervalId);
                $('[aria-label="搜尋"]').after($export);
            }
        }, 1000);
    }
}

$(document).ready(function() {
    init();
});
