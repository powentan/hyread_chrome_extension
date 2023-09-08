import { Book } from "@/domain/model/book";

export enum ExportingType {
    File = 'file',
    Readwise = 'readwise',
};

export enum FormatType {
    default = 'default',
    hyRead = 'hyread',
    hqa = 'hq&a',
}

export interface ExportingPort {
    exportDataTo(data: string, book: Book): Promise<boolean>;
}