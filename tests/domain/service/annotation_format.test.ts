import { describe, test, expect } from '@jest/globals';
import { Book } from 'domain/model/book';
import AnnotationFormatAdapter from 'infra/adapter/annotation_format';
import { AnnotationService } from 'domain/service/annotation';


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
                spineIndex: 2,
            },
            {
                chapterTitle: 'chapter title 1',
                text: 'annotation text 2',
                notes: 'notes text 2',
                spineIndex: 2,
            },
            {
                chapterTitle: 'chapter title 2',
                text: 'annotation text',
                notes: 'notes text',
                spineIndex: 1,
            },
            {
                chapterTitle: 'chapter title 2',
                text: 'annotation text 2',
                notes: 'notes text',
                spineIndex: 1,
            },
        ];
        const annotationService = new AnnotationService(
            book,
            annotations,
            new AnnotationFormatAdapter(book, annotations),
        )
        const markdown = annotationService.toFormat('markdown');

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