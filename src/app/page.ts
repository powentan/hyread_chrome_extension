import HyReadServiceAdapter from "infra/adapter/hyread_service";
import ExportFormatAdapter from "infra/adapter/export_format";
import AnnotationFormatAdapter from "infra/adapter/annotation_format";
import superagent from "superagent";
import { BookService } from "domain/service/book";
import { Book } from "domain/model/book";
import { AnnotationService } from "domain/service/annotation";
import { ExportService } from "domain/service/export";


async function downloadFile(idNo: string, book: Book) {
    const hyreadServiceAdapter = new HyReadServiceAdapter(idNo ?? '', superagent);
    const bookService = new BookService(
        book,
        hyreadServiceAdapter,
    );
    console.log('Ready to get annotations...');
    const annotations = await bookService.getAnnotations();
    console.log(annotations);
    const annotationService = new AnnotationService(
        book,
        annotations,
        new AnnotationFormatAdapter(book, annotations),
    );
    const markdown = annotationService.toFormat('markdown');
    const exportService = new ExportService(
        book,
        new ExportFormatAdapter('text/plain'),
    );
    exportService.to('file', {
        data: markdown,
        fileName: `${book.title}.md`,
    });
}

export { downloadFile };