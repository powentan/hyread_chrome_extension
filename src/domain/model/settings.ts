import { ExportingType } from "domain/repo/exporting";

type ReadWiseSettings = {
    accessToken?: string | null;
};

type AnnotationSettings = {
    filePrefix?: string | null;
};

type ExtensionSettings = {
    export_default?: ExportingType;
    readwise?: ReadWiseSettings;
    annotation?: AnnotationSettings;
};

export { ReadWiseSettings, AnnotationSettings, ExtensionSettings };