import { Cash } from "cash-dom";
import { Book } from "./book";

export interface HyReadPage {
    getBookInfo($inforList: Cash): Book;
}
