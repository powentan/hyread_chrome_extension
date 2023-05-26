import { Book, Annotation } from '../model/book';

export interface AnnotationFormatPort {
    book: Book;
    annotations: Array<Annotation>;

    // toMarkdown(annotations: Array<Annotation>): string;
    toMarkdown(): string;
}