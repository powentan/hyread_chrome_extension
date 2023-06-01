import { Book, Annotation } from '../../domain/model/book';
import { AnnotationFormatPort } from 'domain/repo/annotation_format';


export default class AnnotationFormatAdapter implements AnnotationFormatPort
{
    book: Book;
    annotations: Array<Annotation>;

    constructor(book: Book, annotations: Array<Annotation>) {
        this.book = book;
        this.annotations = annotations;
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

    toMarkdown(): string {
        let mergedAnnotations = this._mergeAnnotationByChapter(this.annotations);
        console.log(mergedAnnotations);

        let markdown = `# ${this.book.title}\n![${this.book.title}](${this.book.cover})\n`;
        for(const annotations of mergedAnnotations) {
            const chapterTitle = annotations[0].chapterTitle;
            markdown += `## ${chapterTitle}\n`;
            for(let annotation of annotations) {
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
