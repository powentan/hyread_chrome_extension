import { Book, Annotation } from '../model/book';

type AnnotationDetail = {
    text: string;
    notes?: string | null;
}


class AnnotationFormatter
{
    book: Book;
    annotations: Array<Annotation>;

    constructor(book: Book, annotations: Array<Annotation>) {
        this.book = book;
        this.annotations = annotations;
    }

    _mergeAnnotationByChapter() {
        let mergedNotes: Record<string, Array<AnnotationDetail>> = {};
        for(let annotation of this.annotations) {
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

    toMarkdown() {
        let mergedNotes = this._mergeAnnotationByChapter();

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

export { AnnotationFormatter };