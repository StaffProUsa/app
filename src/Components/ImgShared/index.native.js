import Share from 'react-native-share';
class ImgShared {
  static compartir(qr, mesaje) {
    // let spliteoBase64 = qr.split(',')[1];
    // var imageUrl = 'data:image/png;base64,' + spliteoBase64;
    let imageUrl = qr;

    let shareImage001 = {
      title: 'Casa Grande',
      message: mesaje ?? "",
      url: imageUrl,
      saveToFiles: true
    };
    Share.open(shareImage001)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });

    //   var imageUrl = 'data:image/png;base64,' + param;
    //   let shareImage002 = {
    //     title: "titulo",
    //     message: 'mensaje',
    //     saveToFiles: true,
    //     urls: [imageUrl, imageUrl],
    //     filename: 'test',
    //     social: Share.Social.WHATSAPP,
    //     whatsAppNumber: "69050028"
    //   };

    //   Share.shareSingle(shareImage002)
    //     .then((res) => { console.log(res); })
    //     .catch((err) => { err && console.log(err); });
    // }
  }
}

export default ImgShared;
