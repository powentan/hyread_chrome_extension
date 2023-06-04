import HyReadServiceAdapter from "infra/adapter/hyread_service";
import ExportToFileAdapter from "infra/adapter/exporting/export_to_file";
import MarkdownFormatAdapter from "infra/adapter/markdown_format/markdown_format";
import superagent from "superagent";
import { BookService } from "domain/service/book";
import { Book } from "domain/model/book";
import { AnnotationService } from "domain/service/annotation";
import { ExportingService } from "domain/service/exporting";


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
        new MarkdownFormatAdapter(book, annotations),
    );
    const annotationString = annotationService.toString();
    const exportService = new ExportingService(
        book,
        new ExportToFileAdapter('text/plain'),
    );
    exportService.export(annotationString, {
        fileName: `${book.title}.md`,
    });
}

export { downloadFile };