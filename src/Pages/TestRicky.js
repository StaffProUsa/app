import React from 'react';
import { connect } from 'react-redux';

import SCanvas from 'servisofts-canvas';
import { SHr, SIcon, SPage, SScrollView2, SText, STheme, SView } from 'servisofts-component';
import Loading from '../Components/Loading';
import PinchZoom from '../Components/PinchZoom';
import SwitchRastreo from '../Components/SwitchTheme';
import SConfig from '../SConfig';

class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scale: 1,
    }
    this.color = {
      basic: "#222222"
    }
  }

  async getMatrix() {

    if (!this.matrix) {

      this.matrix = await this.ref.getColorMatrix();
    }
    return this.matrix;
  }
  async analizar(e) {
    this._loading.setLoading(true);
    var { ctx, canvas } = this.ref;
    var matrix = await this.getMatrix();
    if (!matrix) return;
    for (let y = 0; y < matrix.length; y++) {
      const obj_y = matrix[y];
      for (let x = 0; x < obj_y.length; x++) {
        const obj_x = obj_y[x];
        if (obj_x.r > 100 && obj_x.g < 100 && obj_x.b < 100) {
          ctx.fillStyle = "#00f";
          // ctx.lineWidth = 1;
          ctx.fillRect(x, y, 1, 1)
        }

      }
    }
    this._loading.setLoading(false);

  }

  crearCuadrados() {
    var { ctx, canvas } = this.ref;
    ctx.strokeStyle = "#f00";
    var s = 32;
    var l = 4;
    for (let i = 0; i < l; i++) {
      for (let j = 0; j < l; j++) {
        ctx.strokeRect(s * (i * 2) + s, (s * j * 2) + s, s, s)
      }
    }
  }
  render() {
    var w = 512;
    var h = 512;
    return (
      <SPage disableScroll>
        <SView col={'xs-12'} height center>
          <PinchZoom zoom={2}>
            <SCanvas
              width={w}
              height={h}
              onClick={async (e) => {
                this.analizar();
              }}
              paint={(ref) => {
                this.ref = ref;
                ref.grid({ size: 32, color: this.color.basic });
                this.crearCuadrados();

              }}
            />
          </PinchZoom>
        </SView>
        <Loading ref={ref => this._loading = ref} />
      </SPage >
    );
  }
}

const initStates = (state) => {
  return { state };
};
export default connect(initStates)(Test);
