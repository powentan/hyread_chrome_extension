import { Book, Annotation } from '../../domain/model/book';
import { AnnotationFormatPort } from 'domain/repo/annotation_format';

type AnnotationDetail = {
    text: string;
    notes?: string | null;
}


export default class AnnotationFormatAdapter implements AnnotationFormatPort
{
    book: Book;
    annotations: Array<Annotation>;

    constructor(book: Book, annotations: Array<Annotation>) {
        this.book = book;
        this.annotations = annotations;
    }

    _mergeAnnotationByChapter(annotations: Array<Annotation>): Record<string, Array<AnnotationDetail>> {
        let mergedNotes: Record<string, Array<AnnotationDetail>> = {};
        // for(let annotation of this.annotations) {
        for(let annotation of annotations) {
            let title = annotation.chapterTitle;
            let noteInfo = {
                text: annotation.text,
                notes: annotation.notes,
            };
            if(title in mergedNotes) {
                mergedNotes[title].push(noteInfo);
            } else {
                mergedNotes[title] = [noteInfo];
            }
        }

        return mergedNotes;
    }

    // toMarkdown(annotations: Array<Annotation>): string {
    toMarkdown(): string {
        // let mergedNotes = this._mergeAnnotationByChapter(annotations);
        let mergedNotes = this._mergeAnnotationByChapter(this.annotations);

        let markdown = `# ${this.book.title}\n![${this.book.title}](${this.book.cover})\n`;
        for(let chapter in mergedNotes) {
            let noteInfos = mergedNotes[chapter];
            
            markdown += `## ${chapter}\n`;
            for(let noteInfo of noteInfos) {
                markdown += `> ${noteInfo.text}\n`
                if(noteInfo.notes != null) {
                    markdown += `> 心得筆記: ${noteInfo.notes}\n`
                }
                markdown += '\n';
            }
            markdown += '\n';
        }

        return markdown;
    }
}