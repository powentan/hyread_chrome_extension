import { describe, test, expect } from '@jest/globals';
import { Book } from 'domain/model/book';
import { ExportingService } from "domain/service/exporting";
import ExportToFileAdapter from "infra/adapter/exporting/export_to_file";

describe('test export format service', () => {
    test('test export service: file type', () => {
        const book: Book = {
            assetUUID: 'asset_uuid',
            eid: 'eid',
            ownerCode: 'owner_code',
            title: 'book title',
            cover: 'https://book-cover',
        };
        const exportFormatAdapter = new ExportToFileAdapter('text/plain');
        const mockDownloadToFile = jest
            .spyOn(exportFormatAdapter, 'exportDataTo')
            .mockImplementation(() => {});
        const exportingService = new ExportingService(book, exportFormatAdapter);
        exportingService.export('file', {
            data: '',
            fileName: '',
        });
        expect(mockDownloadToFile).toHaveBeenCalledTimes(1);
    });
});