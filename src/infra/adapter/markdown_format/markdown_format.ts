import { Book, Annotation } from '../../../domain/model/book';
import { AnnotationFormatPort } from 'domain/repo/annotation_format';
import { ExtensionSettings } from 'domain/model/settings';


export default class MarkdownFormatAdapter implements AnnotationFormatPort
{
    book: Book;
    annotations: Array<Annotation>;
    settings: ExtensionSettings;

    constructor(book: Book, annotations: Array<Annotation>, settings: ExtensionSettings) {
        this.book = book;
        this.annotations = annotations;
        this.settings = settings;
    }

    _mergeAnnotationByChapter(annotations: Array<Annotation>): Array<Array<Annotation>> {
        let mergedNotes: Record<string, Array<Annotation>> = {};

        for(let annotation of annotations) {
            let title = annotation.chapterTitle;
            let noteInfo = {
                chapterTitle: title,
                text: annotation.text,
                notes: annotation.notes,
                spineIndex: annotation.spineIndex
            };
            if(title in mergedNotes) {
                mergedNotes[title].push(noteInfo);
            } else {
                mergedNotes[title] = [noteInfo];
            }
        }
        return Object.values(mergedNotes).sort(
            (a: Array<Annotation>, b: Array<Annotation>) => {
               return a[0].spineIndex - b[0].spineIndex;
            }
        );
    }

    toString(): string {
        let mergedAnnotations = this._mergeAnnotationByChapter(this.annotations);
        console.log(mergedAnnotations);

        const bookTitle = `${this.settings.annotation?.titlePrefix}${this.book.title}`
        let markdown = `# ${bookTitle}\n![${this.book.title}](${this.book.cover})\n`;
        for(const annotations of mergedAnnotations) {
            const chapterTitle = annotations[0].chapterTitle;
            markdown += `## ${chapterTitle}\n`;
            for(let annotation of annotations.reverse()) {
                markdown += `> ${annotation.text}\n`
                if(annotation.notes != null) {
                    markdown += `> 心得筆記: ${annotation.notes}\n`
                }
                markdown += '\n';
            }
            markdown += '\n';
        }

        return markdown;
    }
}
