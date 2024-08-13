import React, { Component } from 'react';
import { SInput, SText, SView, Upload } from 'servisofts-component';
import SSocket from 'servisofts-socket'
class Paso1 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    var key_evento = this.props.parent?.key_evento;
    const imageUrl = SSocket.api.root + "evento/" + key_evento + "?date=" + new Date().getTime();
    if (this.props.parent?.state?.noLoad) {
      return;
    }
    // const imageUrl = SSocket.api.root + "actividad/ecbd73a0-c210-4757-b6f3-ccba0dbf1305"
    console.log(imageUrl);
    fetch(imageUrl)
      .then(response => response.blob())
      .then(imageBlob => {
        // const imageObjectURL = URL.createObjectURL(imageBlob);
        // var parent = this.props.parent;
        // parent.state.img = { uri: imageObjectURL };
        // parent.setState({ ...parent.state });
        // console.log(imageObjectURL);
        const fileReaderInstance = new FileReader();
        fileReaderInstance.readAsDataURL(imageBlob);
        fileReaderInstance.onload = () => {
          var base64data = fileReaderInstance.result;
          var parent = this.props.parent;
          console.log(base64data);
          if (!/(^data:image)|(^data:application)/.test(base64data)) {
            console.log("No es imagen")
            return;
          }

          parent.state.img = { uri: base64data };
          parent.setState({ ...parent.state });
        }

      }).catch(e => {
        console.error(e);
      })
  }

  render() {
    return (
      <SView col={'xs-12'} flex center>
        <SView col={'xs-12'} flex center>
          <SView
            col={'xs-12'}
            colSquare
            style={{
              maxHeight: '100%'
            }}>
            <SInput
              ref={(ref) => (this._image = ref)}
              type='image'
              style={{
                height: '100%'
              }}
            
              onChangeText={(e) => {
                console.log(e);
                var image = e
                var parent = this.props.parent;
                var key_evento = this.props.parent?.key_evento;
                const imageUrl = SSocket.api.root + "upload/evento/" + key_evento
                Upload.send(image[0], imageUrl);
                console.log(image[0])
                console.log("subio")
                // this.props.parent?.state?.img = null;
                // this.props.parent?.state?.noLoad = ""
                // this.props.parent?.setState({ ...this.props.parent?.state });
              }}
            />
          </SView>
        </SView>
        {/* <SView
          col={'xs-12'}
          height={40}
          center
          onPress={() => {
            var image = this._image.getValue();
            // console.log("entro");
            // console.log(image);
            // var fr = new FileReader;
            var parent = this.props.parent;
            // fr.onload = function (e) { // file is loaded
            // var img = new Image();

            // img.onload = function () {
            // alert(img.width); // image is loaded; sizes are available
            // parent.state.image = image;

            parent.state.img = image[0];
            parent.setState({ ...parent.state });
            // };

            // img.src = image[0].file?.uri
            // };

            // fr.readAsDataURL(image[0].file);
          }}>
          <SText>continuar</SText>
        </SView> */}
      </SView>
    );
  }
}

export default Paso1;
