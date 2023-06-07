import $ from "cash-dom";
import { ExtensionSettings } from "domain/model/settings";
import ExtensionSettingsManager from "infra/adapter/extension_settings";

const settingsManager = new ExtensionSettingsManager();

const saveOptions = () => {
    const readwiseAccessToken = $('#readwiseAccessToken').val(); 
    const settings = {
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
    });
};

const restoreOptions = async () => {
    const settings: ExtensionSettings = await settingsManager.get();
    console.log(settings);
    $('#readwiseAccessToken').val(settings.readwise?.accessToken || '');
  };

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save')?.addEventListener('click', saveOptions);