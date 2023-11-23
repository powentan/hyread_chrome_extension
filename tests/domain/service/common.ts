import { Book } from '@/domain/model/book';
import { defaultExtensionSettings } from '@/domain/model/settings';

export const settings = defaultExtensionSettings;
export const book: Book = {
    assetUUID: 'asset_uuid',
    brn: 'brn',
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

