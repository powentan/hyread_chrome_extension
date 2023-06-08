import { ExportingPort } from '../../../domain/repo/exporting';
import { Book } from 'domain/model/book';

function createDataUrl(content: string, mimeType: string): string {
    const base64Content = btoa(unescape(encodeURIComponent(content)));
    return `data:${mimeType};base64,${base64Content}`;
}

function sanitizeFilename(filename: string): string {
    const invalidCharactersRegex = /[/\\?%*:|"<>]/g;
    return filename.replace(invalidCharactersRegex, '_');
}

export default class ExportToFileAdapter implements ExportingPort {
    fileType: string;

    constructor(fileType: string = 'text/markdown') {
        this.fileType = fileType;
    }

    async exportDataTo(data: string, book: Book): Promise<boolean> {
        const fileName = `${book.title}`;

        const dataUrl = createDataUrl(data, this.fileType);
        chrome.downloads.download({
            url: dataUrl,
            filename: sanitizeFilename(fileName) + '.md',
            saveAs: true
        });

        return true;
    }
}