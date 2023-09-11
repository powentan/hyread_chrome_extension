import { HyReadPage } from "@/domain/model/hyread_page";
import { Cash } from "cash-dom";
import { Book } from "@/domain/model/book";
import $ from "cash-dom";

export class HyReadPageService implements HyReadPage {
    idNo: string;

    constructor(idNo: string) {
        this.idNo = idNo;
    }

    _parseOnlineReadingUrl(url: string): Book {
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

    getBookInfo($inforList: Cash): Book {
        const $toolbarblock = $inforList.find('.toolbarblock');
        let title = $inforList.find('h3.title').text();
        let coverElem = $inforList.find('.cover img')[0];
        let cover = '';
        if(coverElem) {
            cover = $(coverElem).attr('src')?? '';
        }

        console.log($toolbarblock);
        let href = $toolbarblock.find('.toolbar:first-child a').attr('href');
        console.log(`href=${href}`);
        let book = this._parseOnlineReadingUrl(href?? '');
        // add more info for the book
        book.title = title;
        book.cover = cover;
        console.log(book);

        return book;
    }

    getBooks(): Array<Book> {
        const $inforLists = $('.infor-list')

        let res = [];
        for(const inforList of $inforLists) {
            const book = this.getBookInfo($(inforList));
            res.push(book);
        }

        return res;
    }
}