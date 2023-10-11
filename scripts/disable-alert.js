// overwrite the original alert method
window.alert = function(msg) {
    document.body = document.createElement('body');
    let dialog = document.createElement('pure-dialog');

    // set its properties
    dialog.id = 'pure-dialog';
    dialog.title = msg;
    dialog.content = msg;
    dialog.buttons = '確定';
    dialog.buttonValueSeparator = ',';
    dialog.closeButton = true;
    
    // append to DOM
    dialog.appendToDOM();
    
    // show as a modal
    dialog.showModal();
    console.log(msg);
};
