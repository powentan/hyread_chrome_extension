import { describe, test, expect } from '@jest/globals';
import { Book } from 'domain/model/book';
import { ExportingService } from "domain/service/exporting";
import ExportToFileAdapter from "infra/adapter/exporting/export_to_file";
import ExportToReadwiseReader from 'infra/adapter/exporting/export_to_readwise_reader';
import { ReadwiseReader } from 'infra/adapter/readwise_reader';

describe('test export format service', () => {
    test('test export service: file type', () => {
        const book: Book = {
            assetUUID: 'asset_uuid',
            eid: 'eid',
            ownerCode: 'owner_code',
            title: 'book title',
            cover: 'https://book-cover',
        };
        const exportToFileAdapter = new ExportToFileAdapter('text/markdown');
        const mockExportToFile = jest
            .spyOn(exportToFileAdapter, 'exportDataTo')
            .mockImplementation(async () => { return true;});
        const exportingService = new ExportingService(book, exportToFileAdapter);
        exportingService.export('data');
        expect(mockExportToFile).toHaveBeenCalledTimes(1);
    });

    test('test export service: readwise', () => {
        const book: Book = {
            assetUUID: 'asset_uuid',
            eid: 'eid',
            ownerCode: 'owner_code',
            title: 'book title',
            cover: 'https://book-cover',
        };
        const exportToReadwiseReader = new ExportToReadwiseReader(new ReadwiseReader('dummy_access_token'));
        const mockExportToReadwiseReader = jest
            .spyOn(exportToReadwiseReader, 'exportDataTo')
            .mockImplementation(async () => { return true;});
        const exportingService = new ExportingService(book, exportToReadwiseReader);
        exportingService.export('data');
        expect(mockExportToReadwiseReader).toHaveBeenCalledTimes(1);
    });
});