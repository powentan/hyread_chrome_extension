// overwrite the original alert method
// let script = window.document.createElement('script');
// script.textContent = `
// window.alert = function(msg) {
    // console.log(msg);
// }
// `;
// window.document.head.appendChild(script);

window.alert = function(msg) {
    console.log(msg);
};
