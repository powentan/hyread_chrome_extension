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

    toString(): string {
        const result = this.annotationFormatPort.toString()
        console.log(`toFormat result: ${result}`)

        return result;
    }
}