import { Book } from "@/domain/model/book";

export enum ExportingType {
    File = 'file',
    Readwise = 'readwise',
};

export enum FormatType {
    default = 'default',
    hyRead = 'hyread',
    hqa = 'hq&a',
    color = 'annotation-color',
    style = 'annotation-style',
    summary = 'summary',
}

export interface ExportingPort {
    exportDataTo(data: string, book: Book): Promise<boolean>;
}