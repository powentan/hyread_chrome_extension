import { Book } from "@/domain/model/book";
import { ExportingPort } from "@/domain/repo/exporting";

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

    async export(data: string): Promise<boolean> {
        return await this.exportingPort.exportDataTo(data, this.book);
    }
}