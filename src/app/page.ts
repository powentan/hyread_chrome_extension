import HyReadServiceAdapter from "infra/adapter/hyread_service";
import ExportToFileAdapter from "infra/adapter/exporting/export_to_file";
import ExportToReadwiseReader from "infra/adapter/exporting/export_to_readwise_reader";
import MarkdownFormatAdapter from "infra/adapter/markdown_format/markdown_format";
import { BookService } from "domain/service/book";
import { Book } from "domain/model/book";
import { AnnotationService } from "domain/service/annotation";
import { ExportingService } from "domain/service/exporting";
import { ExportingPort, ExportingType } from "domain/repo/exporting";
import { ReadwiseReader } from "infra/adapter/readwise_reader";
import { ExtensionSettings } from "domain/model/settings";


async function exportToService(idNo: string, book: Book, settings: ExtensionSettings): Promise<boolean> {
    //  accessToken: string = '', exportingType: ExportingType = ExportingType.File): Promise<boolean> {
    const bookService = new BookService(
        book,
        new HyReadServiceAdapter(idNo),
    );
    console.log('Ready to get annotations...');
    const annotations = await bookService.getAnnotations();
    console.log(annotations);
    const annotationService = new AnnotationService(
        book,
        annotations,
        new MarkdownFormatAdapter(book, annotations, settings),
    );
    
    let exportAdapter: ExportingPort = new ExportToFileAdapter('text/markdown', settings);
    switch(settings.exportDefault) {
        case ExportingType.File:
            break;
        case ExportingType.Readwise:
            exportAdapter = new ExportToReadwiseReader(new ReadwiseReader(settings.readwise?.accessToken || ''), settings);
            break;
    }

    const exportingService = new ExportingService(
        book,
        exportAdapter,
    );
    const annotationString = annotationService.toString();
    console.log('Ready to export to the service...');
    return await exportingService.export(annotationString);
}

export { exportToService };