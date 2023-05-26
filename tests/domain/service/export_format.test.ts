import { describe, test, expect } from '@jest/globals';
import { Book } from 'domain/model/book';
import { ExportService } from "domain/service/export";
import ExportFormatAdapter from "infra/adapter/export_format";

describe('test export format service', () => {
    test('test export service: file type', () => {
        const book: Book = {
            assetUUID: 'asset_uuid',
            eid: 'eid',
            ownerCode: 'owner_code',
            title: 'book title',
            cover: 'https://book-cover',
        };
        const exportFormatAdapter = new ExportFormatAdapter('text/plain');
        const mockDownloadToFile = jest
            .spyOn(exportFormatAdapter, 'downloadToFile')
            .mockImplementation(() => {});
        const exportService = new ExportService(book, exportFormatAdapter);
        exportService.to('file', {
            data: '',
            fileName: '',
        });
        expect(mockDownloadToFile).toHaveBeenCalledTimes(1);
    });
});