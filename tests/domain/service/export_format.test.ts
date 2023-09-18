import { describe, test, expect } from '@jest/globals';
import { Book } from '@/domain/model/book';
import { ExportingService } from "@/domain/service/exporting";
import ExportToFileAdapter from "@/infra/adapter/exporting/export_to_file";
import ExportToReadwiseReader from '@/infra/adapter/exporting/export_to_readwise_reader';
import { ReadwiseReader } from '@/infra/adapter/readwise_reader';
import { ExportingType } from '@/domain/repo/exporting';
import { ExtensionSettings } from '@/domain/model/settings';
import { settings, book } from './common';

describe('test export format service', () => {
    test('test export service: file type', () => {
        const exportToFileAdapter = new ExportToFileAdapter('text/markdown', settings);
        const mockExportToFile = jest
            .spyOn(exportToFileAdapter, 'exportDataTo')
            .mockImplementation(async () => { return true;});
        const exportingService = new ExportingService(book, exportToFileAdapter);
        exportingService.export('data');
        expect(mockExportToFile).toHaveBeenCalledTimes(1);
    });

    test('test export service: readwise', () => {
        const exportToReadwiseReader = new ExportToReadwiseReader(
            new ReadwiseReader('dummy_access_token'),
            settings,
        );
        const mockExportToReadwiseReader = jest
            .spyOn(exportToReadwiseReader, 'exportDataTo')
            .mockImplementation(async () => { return true;});
        const exportingService = new ExportingService(book, exportToReadwiseReader);
        exportingService.export('data');
        expect(mockExportToReadwiseReader).toHaveBeenCalledTimes(1);
    });
});