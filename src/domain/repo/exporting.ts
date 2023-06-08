import { Book } from "domain/model/book";

export enum ExportingType {
    File = 'file',
    Readwise = 'readwise',
};

export interface ExportingPort {
    exportDataTo(data: string, book: Book): Promise<boolean>;
}