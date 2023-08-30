import { ExportingType } from "domain/repo/exporting";

type ReadWiseSettings = {
    accessToken?: string | null;
};

type AnnotationSettings = {
    titlePrefix?: string | null;
};

type FileExportSettings = {
    folder? : string | null;
    format?: string | null;
};

type ExtensionSettings = {
    exportDefault?: ExportingType;
    readwise?: ReadWiseSettings;
    fileExport?: FileExportSettings;
    annotation?: AnnotationSettings;
};

export { ReadWiseSettings, AnnotationSettings, ExtensionSettings };
