import { Book, Annotation } from '../../../domain/model/book';
import { AnnotationFormatPort } from 'domain/repo/annotation_format';
import { ExtensionSettings } from 'domain/model/settings';
import { FormatType } from 'domain/repo/exporting';


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

    _default_format(bookTitle: string, mergedAnnotations: Array<Array<Annotation>>): string {
        let markdown = `# ${bookTitle}\n![${this.book.title}](${this.book.cover})\n`;
        for(const annotations of mergedAnnotations) {
            const chaptertitle = annotations[0].chapterTitle;
            markdown += `## ${chaptertitle}\n`;
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

    _haq_format(bookTitle: string, mergedAnnotations: Array<Array<Annotation>>): string {
        let markdown = `# ${bookTitle}\n![${this.book.title}](${this.book.cover})\n`;

        let i = 1;
        for(const annotations of mergedAnnotations) {
            const chaptertitle = annotations[0].chapterTitle;
            markdown += `## ${chaptertitle}\n`;
            for(let annotation of annotations.reverse()) {
                // question
                markdown += `### Q${i}\n\n`;
                markdown += `- A${i}:\n`;
                // highlight
                markdown += `> ${annotation.text}\n`
                if(annotation.notes != null) {
                    markdown += `> 心得筆記: ${annotation.notes}\n`
                }
                markdown += '\n---\n';
                i++;
            }
            markdown += '\n';
        }

        return markdown;
    }

    _hyread_format(bookTitle: string, mergedAnnotations: Array<Array<Annotation>>): string {
        let markdown = `# ${bookTitle}\n![${this.book.title}](${this.book.cover})\n`;

        for(const annotations of mergedAnnotations) {
            const chapterTitle = annotations[0].chapterTitle;
            markdown += `## ${chapterTitle}\n`;
            for(let annotation of annotations.reverse()) {
                markdown += `${annotation.text}\n`
                if(annotation.notes != null) {
                    markdown += `心得筆記: ${annotation.notes}\n`
                }
                markdown += '\n---\n';
            }
            markdown += '\n';
        }

        return markdown;
    }

    toString(): string {
        let mergedAnnotations = this._mergeAnnotationByChapter(this.annotations);
        console.log(mergedAnnotations);
        const bookTitle = `${this.settings.annotation?.titlePrefix}${this.book.title}`

        let formatter = (a: any, b: any) => '';
        switch(this.settings.fileExport?.format) {
            case FormatType.default:
                formatter = this._default_format.bind(this);
                break;
            case FormatType.hqa:
                formatter = this._haq_format.bind(this);
                break;
            case FormatType.hyRead:
                formatter = this._hyread_format.bind(this);
                break;
        }
        const markdown = formatter(bookTitle, mergedAnnotations);
        console.log(markdown);

        return markdown;
    }
}
