import { describe, test, expect } from '@jest/globals';
import { Book } from 'domain/model/book';
import MarkdownFormatAdapter from 'infra/adapter/markdown_format/markdown_format';
import { AnnotationService } from 'domain/service/annotation';
import { ExtensionSettings } from 'domain/model/settings';
import { ExportingType } from 'domain/repo/exporting';


describe('test formatter service', () => {
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
    const settings: ExtensionSettings = {
        exportDefault: ExportingType.File,
        annotation: {
            titlePrefix: '',
        },
        readwise: {
            accessToken: '',
        },
    };

    test('test markdown format', () => {
        const annotationService = new AnnotationService(
            book,
            annotations,
            new MarkdownFormatAdapter(book, annotations, settings),
        )
        const markdown = annotationService.toString();

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