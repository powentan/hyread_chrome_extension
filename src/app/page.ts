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


async function exportToService(idNo: string, book: Book, accessToken: string = '', exportingType: ExportingType = ExportingType.File) {
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
        new MarkdownFormatAdapter(book, annotations),
    );
    
    let exportAdapter: ExportingPort = new ExportToFileAdapter('text/markdown');
    switch(exportingType) {
        case ExportingType.File:
            break;
        case ExportingType.Readwise:
            exportAdapter = new ExportToReadwiseReader(new ReadwiseReader(accessToken));
            break;
    }

    const exportingService = new ExportingService(
        book,
        exportAdapter,
    );
    const annotationString = annotationService.toString();
    console.log('Ready to export to the service...');
    await exportingService.export(annotationString);
}

export { exportToService };