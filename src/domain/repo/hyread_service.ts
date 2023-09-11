import { AnnotationResultItem } from '@/domain/model/book';
import { Book, BookStatus } from '@/domain/model/book';

export interface HyReadServicePort {
    getAnnotation(book: Book): Promise<Array<AnnotationResultItem>>;
    getReadingProgress(book: Book): Promise<BookStatus | null>;
}
