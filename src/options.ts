import $ from "cash-dom";
import { ExtensionSettings } from "domain/model/settings";
import ExtensionSettingsManager from "infra/adapter/extension_settings";
import { ExportingType, FormatType } from "domain/repo/exporting";
import '../css/options.scss';

const settingsManager = new ExtensionSettingsManager();
const saveOptions = async () => {
    const settings: ExtensionSettings = await settingsManager.get();
    const titlePrefix = $('#titlePrefix').val();
    const readwiseAccessToken = $('#readwiseAccessToken').val(); 
    const exportDefault = $('#exportDefault').val();
    const fileExportFolder = $('#fileExportFolder').val();
    const fileExportFormat = $('#fileExportFormat').val();
    const settings = {
        ...settings,
        exportDefault: exportDefault,
        fileExport: {
            folder: fileExportFolder,
            format: fileExportFormat,
        },
        readwise: {
            accessToken: readwiseAccessToken,
        },
        annotation: {
            titlePrefix,
        }
    };
    settingsManager.set(settings, () => {
        // Update status to let user know options were saved.
        const $status = $('#status');
        $status.text('Options saved.');
        setTimeout(() => {
            $status.text('');
        }, 3000);
    });
};

const restoreOptions = async () => {
    const settings: ExtensionSettings = await settingsManager.get();
    console.log(settings);
    $('#readwiseAccessToken').val(settings.readwise?.accessToken || '');
    $('#exportDefault').val(settings.exportDefault || ExportingType.File);
    $('#titlePrefix').val(settings.annotation?.titlePrefix || '');
    $('#fileExportFolder').val(settings.fileExport?.folder || '');
    $('#fileExportFormat').val(settings.fileExport?.format || FormatType.default);
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save')?.addEventListener('click', saveOptions);
