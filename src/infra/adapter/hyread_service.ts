import { HyReadServicePort } from '../../domain/repo/hyread_service';
import { AnnotationResultItem } from '../../domain/model/book';

export default class HyReadServiceAdapter implements HyReadServicePort {
    appId = '8a8a84c87216ed3301737517e6770000';
    apiKey = '8a8a84c87216ed3301737517e6770000';
    apiPath = 'https://service.ebook.hyread.com.tw/DataService/1/classes';
    idNo: string;
    superagent: any;

    constructor(idNo: string, superagent: any) {
        this.idNo = idNo;
        this.superagent = superagent;
    }

    async getAnnotation(assetUUID: string): Promise<Array<AnnotationResultItem>> {
        let _idNo = this.idNo.toLowerCase();
        const query = {
            domainId: {
                '$regex': `${_idNo.toLowerCase()}$`
            },
            syncTime: {
                '$gt': 0
            },
            assetUUID: assetUUID
        }

        let res = await this.superagent
            .get(`${this.apiPath}/epubAnnotation`)
            .query({where: JSON.stringify(query)})
            .set('HyDS-Application-Id', this.appId)
            .set('HyDS-REST-API-Key', this.apiKey)
            .set('accept', 'json')


        if(res.status === 200) {
            return res.body.results;
        } else {
            return [];
        }
    }
}