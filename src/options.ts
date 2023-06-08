import $ from "cash-dom";
import { ExtensionSettings } from "domain/model/settings";
import ExtensionSettingsManager from "infra/adapter/extension_settings";
import ExtensionMessagePassing from "infra/adapter/chrome/extension_message";
import { ExportingType } from "domain/repo/exporting";

const settingsManager = new ExtensionSettingsManager();
const messagePassing = new ExtensionMessagePassing();

const saveOptions = () => {
    const readwiseAccessToken = $('#readwiseAccessToken').val(); 
    const exportDefault = $('#export_default').val();
    const settings = {
        export_default: exportDefault,
        readwise: {
            accessToken: readwiseAccessToken,
        }
    };
    settingsManager.set(settings, () => {
        // Update status to let user know options were saved.
        const $status = $('#status');
        $status.text('Options saved.');
        setTimeout(() => {
            $status.text('');
        }, 3000);
        messagePassing.sendMessage({command: 'refresh'});
    });
};

const restoreOptions = async () => {
    const settings: ExtensionSettings = await settingsManager.get();
    console.log(settings);
    $('#readwiseAccessToken').val(settings.readwise?.accessToken || '');
    $('#export_default').val(settings.export_default || ExportingType.File);
  };

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save')?.addEventListener('click', saveOptions);