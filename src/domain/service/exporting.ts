import { Book } from "domain/model/book";
import { ExportingPort } from "domain/repo/exporting";

export class ExportingService {
    book: Book;
    exportingPort: ExportingPort;

    constructor(
        book: Book,
        exportingPort: ExportingPort,
    ) {
        this.book = book;
        this.exportingPort = exportingPort;
    }

    export(data: string, payload: any) {
        const { fileName } = payload;
        this.exportingPort.exportDataTo(data, fileName);
    }
}