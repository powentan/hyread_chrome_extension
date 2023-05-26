import { Book } from "domain/model/book";
import { ExportFormatPort } from "domain/repo/export_format";

export class ExportService {
    book: Book;
    exportFormatPort: ExportFormatPort;

    constructor(
        book: Book,
        exportFormatPort: ExportFormatPort,
    ) {
        this.book = book;
        this.exportFormatPort = exportFormatPort;
    }

    to(type: string, payload: any) {
        if(type === 'file') {
            const { data, fileName } = payload;
            this.exportFormatPort.downloadToFile(data, fileName);
        }
    }
}