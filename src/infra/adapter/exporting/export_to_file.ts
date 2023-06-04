import { ExportingPort } from '../../../domain/repo/exporting';

export default class ExportToFileAdapter implements ExportingPort {
    fileType: string;

    constructor(fileType: string = 'text/plain') {
        this.fileType = fileType;
    }

    exportDataTo(data: string, fileName: string): void {
        const blob = new Blob([data], { type: this.fileType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
    }
}