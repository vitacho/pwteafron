export function base64ToBlob(base64data, type) {
    
    const byteCharacters = atob(base64data.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteCharacters.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteCharacters.length; i++) {
        uint8Array[i] = byteCharacters.charCodeAt(i);
    }

    return new Blob([uint8Array], { type: `image/${type}` });
}
export function getBase64Type(base64data) {
    const matches = base64data.match(/^data:(image\/[A-Za-z0-9]+);base64,/);
    if (matches && matches.length > 1) {
        return matches[1].split('/')[1];
    }
    return 'png';
}

