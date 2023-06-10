import $ from "cash-dom";
import { ExtensionSettings } from "domain/model/settings";
import ExtensionSettingsManager from "infra/adapter/extension_settings";
import { ExportingType } from "domain/repo/exporting";
import '../css/options.scss';

const settingsManager = new ExtensionSettingsManager();
const saveOptions = () => {
    const titlePrefix = $('#titlePrefix').val();
    const readwiseAccessToken = $('#readwiseAccessToken').val(); 
    const exportDefault = $('#exportDefault').val();
    const settings = {
        exportDefault: exportDefault,
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
  };

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save')?.addEventListener('click', saveOptions);