class ImgSaveGallery {
  static async guardar(qr) {
    //tengo que splitear para quitar el data:image/png;base64,
    let spliteoBase64 = qr.split(',')[1];

    const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, {type: contentType});
      return blob;
    };

    //utilizo la funcion b64toBlob para crear imagen
    const blob = b64toBlob(spliteoBase64, 'image/png');

    //creo un componente a para descargar
    let link = document.createElement('a');
    link.download = 'image.png';
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  }
}
export default ImgSaveGallery;
