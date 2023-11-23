import { Book, Annotation, AnnotationColor, getAnnotationFontColor, AnnotationStyle } from '@/domain/model/book';
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
            let title = annotation.chapterTitle.replace(/\n/g, '');
            let noteInfo = {
                ...annotation,
                chapterTitle: title,
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

    _mergeAnnotationByStyle(annotations: Array<Annotation>): Array<Array<Annotation>> {
        let mergedNotes: Record<string, Array<Annotation>> = {};

        for(let annotation of annotations) {
            let style = annotation.style;
            let noteInfo = {
                ...annotation,
            };
            if(style in mergedNotes) {
                mergedNotes[style].push(noteInfo);
            } else {
                mergedNotes[style] = [noteInfo];
            }
        }
        let res = [];
        for(const style of [AnnotationStyle.normal, AnnotationStyle.dashline, AnnotationStyle.underline]) {
            const annotations = mergedNotes[style];
            if(annotations != null) {
                res.push(annotations);
            }
        }
        return res;
    }

    _prefix_format(bookTitle: string): string {
        let prefixFormat = `# ${bookTitle}\n![${this.book.title}](${this.book.cover})\n`;
        prefixFormat += `## 圖書網頁\n- [${this.book.title}](${this.book.url})\n\n`;

        return prefixFormat;
    }

    _default_format(bookTitle: string, mergedAnnotations: Array<Array<Annotation>>): string {
        let markdown = this._prefix_format(bookTitle);

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

    _hqa_format(bookTitle: string, mergedAnnotations: Array<Array<Annotation>>): string {
        let markdown = this._prefix_format(bookTitle);

        let i = 1;
        let quotes: Array<Annotation> = [];
        for(const annotations of mergedAnnotations) {
            const chaptertitle = annotations[0].chapterTitle;
            markdown += `## ${chaptertitle}\n`;
            for(let annotation of annotations.reverse()) {
                if(annotation.style === AnnotationStyle.underline) {
                    quotes.push(annotation);
                    continue;
                }
                // question
                switch(annotation.style) {
                    case AnnotationStyle.dashline:
                        markdown += `### ${annotation.text}\n`;
                        markdown += `A:\n\n`;
                        if(annotation.notes != null) {
                            markdown += `${annotation.notes}\n`
                        }
                        break;
                    case AnnotationStyle.normal:
                        if(annotation.notes != null) {
                            const q = annotation.notes.replace('\n', '');
                            markdown += `### ${q}\n`
                        }
                        markdown += `A:\n\n`;
                        markdown += `> ${annotation.text}\n`
                        break;
                }
                // highlight
                markdown += '\n---\n';
                i++;
            }
            markdown += '\n';
        }
        if(quotes.length !== 0) {
            markdown += `## 引用\n`;
        }
        for(const quote of quotes) {
            markdown += `> ${quote.text}\n`;

            if(quote.notes != null) {
                markdown += `${quote.notes}\n`
            }
            markdown += '\n';
        }

        return markdown;
    }

    _hyread_format(bookTitle: string, mergedAnnotations: Array<Array<Annotation>>): string {
        let markdown = this._prefix_format(bookTitle);

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
        let markdown = this._prefix_format(bookTitle);

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

    _style_format(bookTitle: string, mergedAnnotations: Array<Array<Annotation>>): string {
        let markdown = this._prefix_format(bookTitle);

        for(const annotations of mergedAnnotations) {
            const style = annotations[0].style;
            let styleTitle = '';
            switch(style) {
                case AnnotationStyle.normal:
                    styleTitle = this.settings.fileExport?.styleMap?.normal || '';
                    break;
                case AnnotationStyle.dashline:
                    styleTitle = this.settings.fileExport?.styleMap?.dashline || '';
                    break;
                case AnnotationStyle.underline:
                    styleTitle = this.settings.fileExport?.styleMap?.underline || '';
                    break;
            }
            markdown += `## ${styleTitle}\n`;
            for(let annotation of annotations.reverse()) {
                if(annotation.notes != null) {
                    markdown += `### ${annotation.notes}\n`
                }
                markdown += `> ${annotation.text}\n`
                // markdown += '\n---\n';
                markdown += '\n';
            }
            markdown += '\n';
        }

        return markdown;
    }

    toString(): string {
        let mergedAnnotations: any[] = [];
        let format = this.settings.fileExport?.format;
        if(format === FormatType.color) {
            mergedAnnotations = this._mergeAnnotationByColor(this.annotations);
        } else if(format === FormatType.style) {
            mergedAnnotations = this._mergeAnnotationByStyle(this.annotations);
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
                formatter = this._hqa_format.bind(this);
                break;
            case FormatType.hyRead:
                formatter = this._hyread_format.bind(this);
                break;
            case FormatType.color:
                formatter = this._color_format.bind(this);
                break;
            case FormatType.style:
                formatter = this._style_format.bind(this);
                break;
        }
        const markdown = formatter(bookTitle, mergedAnnotations);
        console.log(markdown);

        return markdown;
    }
}
