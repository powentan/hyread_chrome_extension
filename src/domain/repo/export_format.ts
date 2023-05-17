export interface ExportFormatPort {
    fileType: string;
    downloadToFile(data: string, fileName: string): void;
}