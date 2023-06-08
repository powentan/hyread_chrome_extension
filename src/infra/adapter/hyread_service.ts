import { HyReadServicePort } from '../../domain/repo/hyread_service';
import { Book, isHistoricalBook, AnnotationResultItem } from '../../domain/model/book';
import querystring from 'querystring';

export default class HyReadServiceAdapter implements HyReadServicePort {
    appId = '8a8a84c87216ed3301737517e6770000';
    apiKey = '8a8a84c87216ed3301737517e6770000';
    apiPath = 'https://service.ebook.hyread.com.tw/DataService/1/classes';
    idNo: string;

    constructor(idNo: string) {
        this.idNo = idNo;
    }

    async getAnnotation(book: Book): Promise<Array<AnnotationResultItem>> {
        let commonQuery = {
            domainId: {
                '$regex': `${this.idNo.toLowerCase()}$`
            },
            syncTime: {
                '$gt': 0
            },
        }
        let query = {};
        if(isHistoricalBook(book)) {
            query = {
                ...commonQuery,
                brn: book.brn,
            };
        } else {
            query = {
                ...commonQuery,
                assetUUID: book.assetUUID,
            };
        }

        const queryString = querystring.stringify({
            where: JSON.stringify(query),
        });
        const res = await fetch(`${this.apiPath}/epubAnnotation?${queryString}`, {
            method: 'GET',
            headers: {
                'HyDS-Application-Id': this.appId,
                'HyDS-REST-API-Key': this.apiKey,
                'accept': 'json',
            },
        })


        if(res.status === 200) {
            const body = await res.json();
            return body.results;
        } else {
            return [];
        }
    }
}