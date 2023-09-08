import showdown from 'showdown';
import { ExportingPort } from '@/domain/repo/exporting';
import { Book } from '@/domain/model/book';
import { ReadwiseReader, ReadwiseReaderCreateSchema } from '../readwise_reader';
import { ExtensionSettings } from '@/domain/model/settings';

export default class ExportToReadwiseReader implements ExportingPort {
    readwiseReader: ReadwiseReader;
    settings: ExtensionSettings;

    constructor(readwiseReader: ReadwiseReader, settings: ExtensionSettings) {
        this.readwiseReader = readwiseReader;
        this.settings = settings;
    }

    async exportDataTo(data: string, book: Book): Promise<boolean> {
        const converter = new showdown.Converter();
        const bookTitle = `${this.settings.annotation?.titlePrefix}${book.title}`;
        const obj: ReadwiseReaderCreateSchema = {
            url: `https://hyread.chrome.ext/notes/${Date.now()}`,
            html: converter.makeHtml(data),
            title: bookTitle,
            image_url: book.cover,
        }
        return await this.readwiseReader.create(obj);
    }
} 