import { ReadwiseReaderPort } from "domain/repo/readwise_reader";

export type ReadwiseReaderCreateSchema = {
    url: string;
    html: string | null;
    should_clean_html?: boolean;
    title?: string | null;
    author?: string | null;
    summary?: string | null;
    published_date?: Date | null;
    image_url?: string | null;
    location?: string | null;
    saved_using?: string | null;
    tags?: Array<string>;
};

export class ReadwiseReader implements ReadwiseReaderPort {
    accessToken: string;
    apiPath = 'https://readwise.io/api/v3'; 

    constructor(accessToken: string) {
        this.accessToken = accessToken;
    }

    async create(obj: ReadwiseReaderCreateSchema): Promise<boolean> {
        const res = await fetch(`${this.apiPath}/save/`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${this.accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj),
        });

        if(res.status === 200 || res.status === 201) {
            return true;
        } else {
            console.log('Readwise Reader create failure:');
            console.log(`status code = ${res.status}`);
            console.log(res.body);
            return false;
        }
    }
}