import { describe, test, expect } from '@jest/globals';
import { Book } from 'domain/model/book';
import { AnnotationFormatter } from 'domain/service/formatter';


describe('test formatter service', () => {
    test('formatter toMarkdown', () => {
        const book: Book = {
            assetUUID: 'asset_uuid',
            eid: 'eid',
            ownerCode: 'owner_code',
            title: 'book title',
            cover: 'https://book-cover',
        };
        const annotations = [
            {
                chapterTitle: 'chapter title 1',
                text: 'annotation text',
                notes: 'notes text',
            },
            {
                chapterTitle: 'chapter title 1',
                text: 'annotation text 2',
                notes: 'notes text 2',
            },
            {
                chapterTitle: 'chapter title 2',
                text: 'annotation text',
                notes: 'notes text',
            },
            {
                chapterTitle: 'chapter title 2',
                text: 'annotation text 2',
                notes: 'notes text',
            },
        ];
        const formatter = new AnnotationFormatter(book, annotations);
        const markdown = formatter.toMarkdown();

        expect(markdown).toContain(`# ${book.title}`)
        expect(markdown).toContain(`[${book.title}](${book.cover})`)
        expect(markdown).toContain('## chapter title 1');
        expect(markdown).toContain('## chapter title 2');

        for(const annotation of annotations) {
            expect(markdown).toContain(`> ${annotation.text}`)
            expect(markdown).toContain(`> 心得筆記: ${annotation.notes}`)
        }
    });
});