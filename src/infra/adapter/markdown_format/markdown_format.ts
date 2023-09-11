import { Book, Annotation, AnnotationColor, getAnnotationFontColor } from '@/domain/model/book';
import { AnnotationFormatPort } from '@/domain/repo/annotation_format';
import { ExtensionSettings } from '@/domain/model/settings';
import { FormatType } from '@/domain/repo/exporting';


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
                ...annotation,
                title,
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

    _mergeAnnotationByColor(annotations: Array<Annotation>): Array<Array<Annotation>> {
        let mergedNotes: Record<string, Array<Annotation>> = {};

        for(let annotation of annotations) {
            let color = annotation.color;
            let noteInfo = {
                ...annotation,
            };
            if(color in mergedNotes) {
                mergedNotes[color].push(noteInfo);
            } else {
                mergedNotes[color] = [noteInfo];
            }
        }
        let res = [];
        for(const color of [AnnotationColor.color1, AnnotationColor.color2, AnnotationColor.color3]) {
            const annotations = mergedNotes[color];
            if(annotations != null) {
                res.push(annotations);
            }
        }
        return res;
    }

    _default_format(bookTitle: string, mergedAnnotations: Array<Array<Annotation>>): string {
        let markdown = `# ${bookTitle}\n![${this.book.title}](${this.book.cover})\n`;
        for(const annotations of mergedAnnotations) {
            const chaptertitle = annotations[0].chapterTitle;
            markdown += `## ${chaptertitle}\n`;
            for(let annotation of annotations.reverse()) {
                markdown += `> ${annotation.text}\n`
                if(annotation.notes != null) {
                    markdown += `${annotation.notes}\n`
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
                markdown += `### Q${i}\n`;
                markdown += `- A${i}:\n`;
                // highlight
                markdown += `> ${annotation.text}\n`
                if(annotation.notes != null) {
                    markdown += `${annotation.notes}\n`
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

    _color_format(bookTitle: string, mergedAnnotations: Array<Array<Annotation>>): string {
        let markdown = `# ${bookTitle}\n![${this.book.title}](${this.book.cover})\n`;

        for(const annotations of mergedAnnotations) {
            const color = annotations[0].color;
            let colorTitle = '';
            switch(color) {
                case AnnotationColor.color1:
                    colorTitle = this.settings.fileExport?.colorMap?.color1 || '';
                    break;
                case AnnotationColor.color2:
                    colorTitle = this.settings.fileExport?.colorMap?.color2 || '';
                    break;
                case AnnotationColor.color3:
                    colorTitle = this.settings.fileExport?.colorMap?.color3 || '';
                    break;
            }
            const fontColor = getAnnotationFontColor(color as AnnotationColor);
            // markdown += `## <font color="${fontColor}">${colorTitle}</font>\n`;
            markdown += `## ${colorTitle}\n`;
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
        let mergedAnnotations = [];
        if(this.settings.fileExport?.format === FormatType.color) {
            mergedAnnotations = this._mergeAnnotationByColor(this.annotations);
        } else {
            mergedAnnotations = this._mergeAnnotationByChapter(this.annotations);
        }
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
            case FormatType.color:
                formatter = this._color_format.bind(this);
                break;
        }
        const markdown = formatter(bookTitle, mergedAnnotations);
        console.log(markdown);

        return markdown;
    }
}
