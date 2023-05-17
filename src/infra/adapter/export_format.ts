function downloadStringAsFile(str: string, fileType: string, fileName: string) {
    const blob = new Blob([str], { type: fileType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
}

export { downloadStringAsFile };