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
        let notes = [];
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
            notes.push(..._notes);
        }

        return notes;
    }

    async getAnnotations(): Promise<Array<Annotation>> {
        let results = await this.hyreadService.getAnnotation(this.book.assetUUID);
        console.log(results);
        let notes = this._parseAnnotationResult(results);
        console.log(notes);
        return notes;
    }
}