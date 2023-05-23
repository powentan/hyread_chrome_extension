import { AnnotationResultItem } from '../model/book';
import { Book } from '../model/book';

export interface HyReadServicePort {
    getAnnotation(book: Book): Promise<Array<AnnotationResultItem>>;
}
