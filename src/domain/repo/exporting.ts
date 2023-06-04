export interface ExportingPort {
    exportDataTo(data: string, fileName: string): void;
}