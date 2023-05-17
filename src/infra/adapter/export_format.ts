import { ExportFormatPort } from '../../domain/repo/export_format';

export class ExportFormatAdapter implements ExportFormatPort {
    fileType: string;

    constructor(fileType: string = 'text/plain') {
        this.fileType = fileType;
    }

    downloadToFile(data: string, fileName: string): void {
        const blob = new Blob([data], { type: this.fileType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
    }
}