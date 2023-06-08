import { ExportingPort } from '../../../domain/repo/exporting';
import { Book } from 'domain/model/book';
import { ReadwiseReader, ReadwiseReaderCreateSchema } from '../readwise_reader';
import showdown from 'showdown';

export default class ExportToReadwiseReader implements ExportingPort {
    readwiseReader: ReadwiseReader;

    constructor(readwiseReader: ReadwiseReader) {
        this.readwiseReader = readwiseReader;
    }

    async exportDataTo(data: string, book: Book): Promise<boolean> {
        const converter = new showdown.Converter();
        const obj: ReadwiseReaderCreateSchema = {
            url: `https://hyread.chrome.ext/notes/${Date.now()}`,
            html: converter.makeHtml(data),
            title: book.title,
            image_url: book.cover,
        }
        return await this.readwiseReader.create(obj);
    }
} 