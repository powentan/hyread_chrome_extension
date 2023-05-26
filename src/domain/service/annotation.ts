import { Book, Annotation } from "domain/model/book";
import { AnnotationFormatPort } from "domain/repo/annotation_format";

export class AnnotationService {
    book: Book;
    annotations: Array<Annotation>;
    annotationFormatPort: AnnotationFormatPort;

    constructor(
        book: Book,
        annotations: Array<Annotation>,
        annotationFormatPort: AnnotationFormatPort,
    ) {
        this.book = book;
        this.annotations = annotations;
        this.annotationFormatPort = annotationFormatPort;
    }

    toFormat(type: string): string {
        let result = '';
        if(type === 'markdown') {
            result = this.annotationFormatPort.toMarkdown()
        }

        return result;
    }
}