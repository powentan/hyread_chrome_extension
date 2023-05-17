import { Book, Annotation } from '../model/book';

type NoteInfo = {
    text: string;
    notes?: string | null;
}


class AnnotationFormatter
{
    book: Book;
    notes: Array<Annotation>;

    constructor(book: Book, notes: Array<Annotation>) {
        this.book = book;
        this.notes = notes;
    }

    _mergeAnnotationByChapter() {
        let mergedNotes: {[key: string]: Array<NoteInfo>} | {} = {};
        for(let note of this.notes) {
            let title = note.chapterTitle;
            let noteInfo = {
                text: note.text,
                notes: note.notes,
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