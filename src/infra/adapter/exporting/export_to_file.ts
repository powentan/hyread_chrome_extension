import { ExportingPort } from '../../../domain/repo/exporting';
import { Book } from 'domain/model/book';
import { ExtensionSettings } from 'domain/model/settings';

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
    settings: ExtensionSettings;

    constructor(fileType: string = 'text/markdown', settings: ExtensionSettings) {
        this.fileType = fileType;
        this.settings = settings;
    }

    async exportDataTo(data: string, book: Book): Promise<boolean> {
        const fileName = `${this.settings.annotation?.titlePrefix}${book.title}`;

        const dataUrl = createDataUrl(data, this.fileType);
        chrome.downloads.download({
            url: dataUrl,
            filename: sanitizeFilename(fileName) + '.md',
            saveAs: true
        });

        return true;
    }
}