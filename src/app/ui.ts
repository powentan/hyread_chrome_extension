const exportAnnotationButton = `
    <div class="toolbar">
        <a class="btn btn-default btn-blue">
            <i class="icon icon-cloud-download"></i>
            匯出筆記
        </a>
    </div>
`;

const fileExportIcon = `
<svg class="fontawesomesvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="28" height="28">
    <!--! Font Awesome Free 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc. -->
    <path d="M32 64C32 28.7 60.7 0 96 0H256V128c0 17.7 14.3 32 32 32H416V288H248c-13.3 0-24 10.7-24 24s10.7 24 24 24H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V64zM416 336V288H526.1l-39-39c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l80 80c9.4 9.4 9.4 24.6 0 33.9l-80 80c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l39-39H416zm0-208H288V0L416 128z">
    </path>
</svg>
`;

class AlertDialog {
    dialog: any;
    id: string = 'alert-dialog';

    constructor() {
        this.dialog = document.createElement('pure-dialog');
        this.dialog.id = this.id;
        this.dialog.buttons = '確定';
        this.dialog.autoClose = true;
        this.dialog.appendToDOM();
    }

    showModal(title: string) {
        this.dialog.title = title;
        this.dialog.showModal();
    }

    close() {
        this.dialog.close();
    }
}

export { exportAnnotationButton, fileExportIcon, AlertDialog };