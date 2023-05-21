import { exportAnnotationButton } from './app/ui';
import $ from "cash-dom";
import { Cash } from "cash-dom";
import superagent from 'superagent';
import { Book } from './domain/model/book';
import HyReadServiceAdapter from './infra/adapter/hyread_service';
import { ExportFormatAdapter } from './infra/adapter/export_format';
import { BookService } from './domain/service/book';
import { AnnotationFormatter } from './domain/service/formatter';

function parseOnlineReadingUrl(url: string): Book {
    let search = new URL(url, window.location.origin).searchParams;
    return {
        assetUUID: search.get('asstuuid'),
        eid: search.get('eid'),
        ownerCode: search.get('owner_code')
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

        const hyreadServiceAdapter = new HyReadServiceAdapter(_idNo ?? '', superagent);
        const bookService = new BookService(book, hyreadServiceAdapter);
        const annotations = await bookService.getAnnotations();

        // output to the format
        let formatter = new AnnotationFormatter(book, annotations);
        let markdown = formatter.toMarkdown();
        console.log('== mardown ==');
        console.log(markdown);
        const exportFormatAdapter = new ExportFormatAdapter('text/plain');
        exportFormatAdapter.downloadToFile(markdown, `${book.title}.md`);

        $(e.target).removeClass('disabled');
    });
}

$(document).ready(function() {
    init();
});
