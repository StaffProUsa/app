import React from 'react';
import {connect} from 'react-redux';

import {SHr, SIcon, SPage, SText, STheme, SView} from 'servisofts-component';
import SwitchTheme from '../Components/SwitchTheme';

class Testcheak extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SPage hidden disableScroll>
        <SView col={'xs-12'} height center>
          <SView
            row
            col={'xs-5'}
            style={{
              borderBottomWidth: 1,
              borderBottomColor: STheme.color.darkGray
            }}
            onPress={() => {
              alert('onPress');
              // STheme.select('default');
              STheme.change();
            }}>
            <SView row col={'xs-1'}>
              <SIcon
                name={'Dark'}
                width={20}
                height={20}
                fill={STheme.color.primary}></SIcon>
            </SView>
            <SView row col={'xs-9'}>
              <SText>Modo {STheme.getTheme() == 'dark' ? "oscuro" : "claro"}</SText>
            </SView>
            <SView flex col={'xs-2'} style={{alignItems: 'flex-end'}}>
              <SIcon
                name={'Modo'}
                width={35}
                fill={STheme.color.primary}></SIcon>
            </SView>
            <SHr height={20} />
          </SView>

          <SwitchTheme
            width={130}
            height={40}
            callback={(resp) => {
              console.log('viendo que', resp);
            }}
          />

          <SText color='red'> aqui {STheme.getTheme()}</SText>
        </SView>
      </SPage>
    );
  }
}

const initStates = (state) => {
  return {state};
};
export default connect(initStates)(Testcheak);
