import React from 'react';
import {Animated} from 'react-native';
import {connect} from 'react-redux';
import {
  SIcon,
  SImage,
  SNavigation,
  SScrollView2,
  SText,
  STheme,
  SView
} from 'servisofts-component';
import SSocket from 'servisofts-socket';

class NavBar extends React.Component {
  static INSTACE = null;
  static open() {
    NavBar.INSTACE.fadeIn();
  }
  static close() {
    NavBar.INSTACE.fadeOut();
  }

  constructor(props) {
    super(props);
    this.state = {
      timeAnim: 350,
      isOpen: false
    };
    NavBar.INSTACE = this;
    this.animSize = new Animated.Value(0);
    //  this.key = SNavigation.getParam("key_restaurante");
  }

  fadeIn() {
    this.setState({isOpen: true});
    Animated.timing(this.animSize, {
      toValue: 1,
      duration: this.state.timeAnim
      // useNativeDriver: true
    }).start();
  }

  fadeOut() {
    Animated.timing(this.animSize, {
      toValue: 0,
      duration: this.state.timeAnim
      // useNativeDriver: true
    }).start(() => {
      this.setState({isOpen: false});
    });
  }

  getNav() {
    var usuario = this.props.state.usuarioReducer.usuarioLog;
    if (!usuario) {
      SNavigation.navigate('login');
      return <SView />;
    }
    return (
      <SView
        col={'xs-9 md-6 xl-4'}
        height
        backgroundColor={STheme.color.background}
        style={{
          position: 'absolute',
          left: this.animSize.interpolate({
            inputRange: [0, 1],
            outputRange: ['-70%', '0%']
          })
        }}>
        <SView
          col={'xs-12'}
          backgroundColor={STheme.color.primary}
          width='100%'
          height={105}
          center
          style={{borderBottomRightRadius: 20, borderBottomLeftRadius: 20}}
          row>
          <SView col={'xs-3'} center style={{textAlign: 'right'}} height>
            <SView
              style={{
                width: 50,
                height: 50,
                borderRadius: 30,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: '#fff'
              }}>
              <SImage
                src={
                  SSocket.api.root +
                  'usuario/' +
                  usuario.key +
                  '?date=' +
                  new Date().getTime()
                }
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode: 'cover'
                }}
              />
            </SView>
          </SView>
          <SView
            col={'xs-9'}
            onPress={() => {
              SNavigation.navigate('perfil');
              this.fadeOut();
            }}>
            <SText
              font={'Roboto-Bold'}
              style={{
                color: '#fff',
                fontSize: 20
              }}>
              {usuario.Nombres}
            </SText>
            <SView
              height={22}
              onPress={() => {
                SNavigation.navigate('perfil');
                this.fadeOut();
              }}
              style={{
                paddingLeft: 6,
                alignItems: 'center'
              }}
              row>
              <SText
                fontSize={12}
                color={'#eee'}
                font='LondonTwo'
                style={
                  {
                    // textDecorationLine: 'underline',
                  }
                }>
                Ver perfil{' '}
              </SText>
              <SIcon name='Ver' width={9} color='#fff' />
            </SView>
          </SView>
        </SView>
        <SView height={20} border={'transparent'} />

        <SScrollView2 disableHorizontal>
          <SView col={'xs-12'} center>
            <SView
              col={'xs-11'}
              height={60}
              border={'transparent'}
              row
              onPress={() => {
                SNavigation.navigate('/');
                this.fadeOut();
              }}>
              <SView
                col={'xs-10'}
                height
                style={{justifyContent: 'flex-start'}}
                row
                center>
                <SIcon
                  fill='#666666'
                  name={'AppAlert'}
                  width={32}
                  height={31}
                />
                <SText
                  font={'Roboto'}
                  style={{paddingLeft: 5, color: '#666666', fontSize: 16}}>
                  Inicio{' '}
                </SText>
              </SView>
              <SView
                col={'xs-2'}
                height
                style={{justifyContent: 'flex-end'}}
                row
                center>
                <SIcon
                  fill={STheme.color.primary}
                  name={'Icon1'}
                  width={20}
                  height={20}
                />
              </SView>
            </SView>

            <SView
              col={'xs-11'}
              height={60}
              border={'transparent'}
              row
              onPress={() => {
                SNavigation.navigate('/');
                this.fadeOut();
              }}>
              <SView
                col={'xs-10'}
                height
                style={{justifyContent: 'flex-start'}}
                row
                center>
                <SIcon
                  fill='#666666'
                  name={'AppAlert'}
                  width={28}
                  height={27}
                />
                <SText
                  font={'Roboto'}
                  style={{paddingLeft: 5, color: '#666666', fontSize: 18}}>
                  Mis Restaurantes
                </SText>
              </SView>
              <SView
                col={'xs-2'}
                height
                style={{justifyContent: 'flex-end'}}
                row
                center>
                <SIcon
                  fill={STheme.color.primary}
                  name={'Icon1'}
                  width={20}
                  height={20}
                />
              </SView>
            </SView>

            <SView
              col={'xs-11'}
              height={60}
              border={'transparent'}
              row
              onPress={() => {
                SNavigation.navigate('consulta/ayuda');
                this.fadeOut();
              }}>
              <SView
                col={'xs-10'}
                height
                style={{justifyContent: 'flex-start'}}
                row
                center>
                <SIcon
                  fill='#666666'
                  name={'AppAlert'}
                  width={28}
                  height={27}
                />
                <SText
                  font={'Roboto'}
                  style={{paddingLeft: 5, color: '#666666', fontSize: 18}}>
                  Ayuda
                </SText>
              </SView>
              <SView
                col={'xs-2'}
                height
                style={{justifyContent: 'flex-end'}}
                row
                center>
                <SIcon
                  stroke={'#405394'}
                  name={'Icon1'}
                  width={20}
                  height={20}
                />
              </SView>
            </SView>

            <SView
              col={'xs-11'}
              height={60}
              border={'transparent'}
              row
              onPress={() => {
                this.props.dispatch({type: 'USUARIO_LOGOUT'});
                SNavigation.replace('login');
                this.fadeOut();
              }}>
              <SView
                col={'xs-10'}
                height
                style={{justifyContent: 'flex-start'}}
                row
                center>
                <SIcon fill='#666666' name={'Exit'} width={28} height={27} />
                <SText
                  font={'Roboto'}
                  style={{paddingLeft: 5, color: '#666666', fontSize: 18}}>
                  Salir
                </SText>
              </SView>
              <SView
                col={'xs-2'}
                height
                style={{justifyContent: 'flex-end'}}
                row
                center>
                <SIcon
                  stroke={'#405394'}
                  name={'Icon1'}
                  width={20}
                  height={20}
                />
              </SView>
            </SView>

            {/* <SView height={10} border={'transparent'} /> */}

            <SView col={'xs-9.5 md-5.8 xl-3.8'} center style={{bottom: 0}}>
              <SIcon name={'Logo'} height={70} />
            </SView>

            <SView row>
              <SText
                style={{
                  paddingLeft: 5,
                  paddingTop: 2,
                  color: '#666666',
                  fontSize: 18
                }}
                font={'LondonMM'}>
                Version 1.0.6
              </SText>
            </SView>

            <SView height={20} border={'transparent'} />
          </SView>
        </SScrollView2>
      </SView>
    );
  }

  render() {
    NavBar.INSTACE = this;
    if (!this.state.isOpen) return null;
    return (
      <SView
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: STheme.color.card
        }}
        activeOpacity={1}
        onPress={() => {
          if (this.state.isOpen) {
            this.fadeOut();
          } else {
            this.fadeIn();
          }
        }}>
        {this.getNav()}
      </SView>
    );
  }
}

const initStates = (state) => {
  return {state};
};
export default connect(initStates)(NavBar);
