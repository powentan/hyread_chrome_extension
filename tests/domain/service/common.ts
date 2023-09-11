import { ExtensionSettings } from '@/domain/model/settings';
import { ExportingType } from '@/domain/repo/exporting';

export const settings: ExtensionSettings = {
    exportDefault: ExportingType.File,
    annotation: {
        titlePrefix: '',
    },
    readwise: {
        accessToken: '',
    },
    fileExport: {
        folder: '',
        format: 'default',
        colorMap: {
            color1: '',
            color2: '',
            color3: '',
        }
    },
    version: '',
};