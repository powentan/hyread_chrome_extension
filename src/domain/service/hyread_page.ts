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
                brn: search.get('eid'),
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
        // let href = $toolbarblock.find('.toolbar:first-child a').attr('href');
        let coverUrl = $($inforList.find('.cover a')[0]).attr('href') ?? '';
        let bookUrl = '';
        if(coverUrl) {
            bookUrl = `${window.location.origin}${coverUrl}`;
        }
        // console.log(`href=${href}`);
        // let book = this._parseOnlineReadingUrl(href?? '');
        let searchParams = new URL(coverUrl, window.location.origin).searchParams;
        let book: Book = {
            brn: searchParams.get('id'),
            url: bookUrl,
            title: title,
            cover: cover,
        }
        console.log(book);

        return book;
    }

    getBooks($inforLists: Cash): Array<Book> {
        let res = [];
        let m = new Map();
        for(const inforList of $inforLists) {
            const book = this.getBookInfo($(inforList));
            const title = book.title || '';
            if(!m.get(title)) {
                m.set(title, true);
                res.push(book);
            }
        }

        return res;
    }
}