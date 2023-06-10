import { ExportingType } from "domain/repo/exporting";

type ReadWiseSettings = {
    accessToken?: string | null;
};

type AnnotationSettings = {
    titlePrefix?: string | null;
};

type ExtensionSettings = {
    exportDefault?: ExportingType;
    readwise?: ReadWiseSettings;
    annotation?: AnnotationSettings;
};

export { ReadWiseSettings, AnnotationSettings, ExtensionSettings };