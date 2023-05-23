import { HyReadServicePort } from '../repo/hyread_service';
import { Book, Annotation, AnnotationResultItem } from '../model/book';

export class BookService {
    book: Book;
    hyreadService: HyReadServicePort;

    constructor(book: Book, hyreadService: HyReadServicePort) {
        this.book = book;
        this.hyreadService = hyreadService;
    }

    _parseAnnotationResult(results: Array<AnnotationResultItem>): Array<Annotation> {
        let annotations = [];
        for(const item of results) {
            let data = JSON.parse(item.data);
            console.log(data);
            let _notes = data.map((x: Annotation) => {
                return {
                    chapterTitle: x.chapterTitle,
                    text: x.text,
                    notes: x.notes,
                };
            });
            console.log(_notes);
            annotations.push(..._notes);
        }

        return annotations;
    }

    async getAnnotations(): Promise<Array<Annotation>> {
        let results = [];
        results = await this.hyreadService.getAnnotation(this.book);
        console.log(results);
        let annotations = this._parseAnnotationResult(results);
        console.log(annotations);
        return annotations;
    }
}