import { HyReadServicePort } from '@/domain/repo/hyread_service';
import { Book, Annotation, AnnotationResultItem } from '@/domain/model/book';

export class BookService {
    book: Book;
    hyreadService: HyReadServicePort;

    constructor(
        book: Book,
        hyreadService: HyReadServicePort,
    ) {
        this.book = book;
        this.hyreadService = hyreadService;
    }

    _parseAnnotationResult(results: Array<AnnotationResultItem>): Array<Annotation> {
        let annotations = [];
        for(const item of results) {
            let data = JSON.parse(item.data);
            console.log(data);
            //  let _notes = data.map((x: Annotation) => {
                //  return {
                    //  ...x,
                //  };
            //  });
            console.log(data);
            annotations.push(...data);
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
