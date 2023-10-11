import { describe, test, expect } from '@jest/globals';
import { Book } from '@/domain/model/book';
import MarkdownFormatAdapter from '@/infra/adapter/markdown_format/markdown_format';
import { settings, annotations } from './common';


describe('test formatter service', () => {
    const book: Book = {
        assetUUID: 'asset_uuid',
        brn: 'brn',
        ownerCode: 'owner_code',
        title: 'book title',
        cover: 'https://book-cover',
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
            expect(markdown).toContain(`${annotation.notes}`)
        }
    });
});