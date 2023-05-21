import { describe, test, expect } from '@jest/globals';
import { BookService } from 'domain/service/book';
import { Book, Annotation } from 'domain/model/book';
import HyReadServiceAdapter from 'infra/adapter/hyread_service';

jest.mock('infra/adapter/hyread_service', () => {
    return jest.fn().mockImplementation(() => {
        return {
            getAnnotation: () => {
                return [
                    {
                        data: '[{"chapterTitle": "chapter 1", "text": "annotation text", "notes": "notes text"}, {"chapterTitle": "chapter 2", "text": "annotation text", "notes": "notes text"}]',
                    },
                    {
                        data: '[{"chapterTitle": "chapter 3", "text": "annotation text", "notes": "notes text"}, {"chapterTitle": "chapter 4", "text": "annotation text", "notes": "notes text"}]',
                    },
                ];
            },
        };
    });
});

describe('test hyread book service', () => {
    test('getAnnotation function', async () => {
        const book: Book = {
            assetUUID: 'asset_uuid',
            eid: 'eid',
            ownerCode: 'owner_code',
            title: 'book title',
            cover: 'https://book-cover',
        };
        const idNo = 'A123456789';
        const hyReadServiceAdapter = new HyReadServiceAdapter(idNo, jest.fn());
        const bookService = new BookService(book, hyReadServiceAdapter);

        const annotations: Array<Annotation> = await bookService.getAnnotations(); 

        expect(annotations).toHaveLength(4);

        for(const annotation of annotations) {
            expect(annotation.text).toContain('annotation');
            expect(annotation.chapterTitle).toContain('chapter');
            expect(annotation.notes).toContain('notes');
        }
    });
});