import { ExportingType } from "@/domain/repo/exporting";
import { FormatType } from "@/domain/repo/exporting";

type ReadWiseSettings = {
    accessToken: string;
};

type AnnotationSettings = {
    titlePrefix: string;
};

type AnnotationColor = {
    color1: string;
    color2: string;
    color3: string;
};

type AnnotationStyleMap = {
    normal: string;
    dashline: string;
    underline: string;
};

type FileExportSettings = {
    folder: string;
    format: FormatType;
    colorMap: AnnotationColor;
    styleMap: AnnotationStyleMap;
};

type ExtensionSettings = {
    exportDefault: ExportingType;
    readwise: ReadWiseSettings;
    fileExport: FileExportSettings;
    annotation: AnnotationSettings;
    version: string;
};

const defaultExtensionSettings = {
    exportDefault: ExportingType.File,
    readwise: {
        accessToken: '',
    },
    fileExport: {
        folder: '',
        format: FormatType.default,
        colorMap: {
            color1: '名言金句',
            color2: '問題',
            color3: '引用',
        },
        styleMap: {
            normal: '重點',
            dashline: '最重要',
            underline: '關鍵字句',
        },
    },
    annotation: {
        titlePrefix: ''
    },
    version: '',
};

export { ReadWiseSettings, AnnotationSettings, ExtensionSettings, defaultExtensionSettings, AnnotationColor, AnnotationStyleMap };
