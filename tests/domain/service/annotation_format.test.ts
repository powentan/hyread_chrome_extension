import { describe, test, expect } from '@jest/globals';
import { Book } from '@/domain/model/book';
import MarkdownFormatAdapter from '@/infra/adapter/markdown_format/markdown_format';
import { ExtensionSettings } from '@/domain/model/settings';
import { ExportingType } from '@/domain/repo/exporting';


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
            cfi: '...',
            color: 'annotation-color-1',
            style: 'normal',
        },
        {
            chapterTitle: 'chapter title 1',
            text: 'annotation text 2',
            notes: 'notes text 2',
            spineIndex: 2,
            cfi: '...',
            color: 'annotation-color-1',
            style: 'normal',
        },
        {
            chapterTitle: 'chapter title 2',
            text: 'annotation text',
            notes: 'notes text',
            spineIndex: 1,
            cfi: '...',
            color: 'annotation-color-1',
            style: 'normal',
        },
        {
            chapterTitle: 'chapter title 2',
            text: 'annotation text 2',
            notes: 'notes text',
            spineIndex: 1,
            cfi: '...',
            color: 'annotation-color-1',
            style: 'normal',
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
        fileExport: {
            folder: '',
            format: 'default',
        },
    };

    test('test markdown format', () => {
        const formatAdapter = new MarkdownFormatAdapter(book, annotations, settings);
        const markdown = formatAdapter.toString();

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