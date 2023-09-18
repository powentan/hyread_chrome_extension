import { ExtensionSettings } from '@/domain/model/settings';
import { ExportingType } from '@/domain/repo/exporting';
import { FormatType } from '@/domain/repo/exporting';
import { Book } from '@/domain/model/book';

export const settings: ExtensionSettings = {
    exportDefault: ExportingType.File,
    annotation: {
        titlePrefix: '',
    },
    readwise: {
        accessToken: '',
    },
    fileExport: {
        folder: '',
        format: FormatType.default,
        colorMap: {
            color1: '',
            color2: '',
            color3: '',
        }
    },
    version: '',
};

export const book: Book = {
    assetUUID: 'asset_uuid',
    eid: 'eid',
    ownerCode: 'owner_code',
    title: 'book title',
    cover: 'https://book-cover',
};


export const annotations = [
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

