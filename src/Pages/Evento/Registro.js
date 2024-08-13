import React from 'react';
import {connect} from 'react-redux';
import {
  SForm,
  SHr,
  SIcon,
  SNavigation,
  SPage,
  SText,
  STheme,
  SView
} from 'servisofts-component';

//YA NO SE USA

class Registro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.arr = Array.from(Array(10).keys());
    this.arrFoto = Array.from(Array(5).keys());
    this.bgSpace = 'transparent';
    this.bgborder = 'transparent';
  }

  getHeader() {
    return (
      <>
        <SView col={'xs-12'} center border={this.bgborder}>
          <SIcon
            name={'Logo'}
            fill={STheme.color.primary}
            height={60}
            width={150}
          />
        </SView>

        <SHr height={16} color={this.bgSpace} />

        <SView col={'xs-12'} row center border={this.bgborder}>
          <SText color={STheme.color.text} font={'Roboto'} fontSize={24}>
            REGISTRO
          </SText>
        </SView>

        <SHr height={46} color={this.bgSpace} />

        <SView col={'xs-11'} center border={this.bgborder}>
          <SText
            col={'xs-12'}
            color={STheme.color.text}
            font={'Roboto'}
            center
            fontSize={12}>
            Ingrese sus datos personales para proseguir con su compra.
          </SText>
        </SView>
      </>
    );
  }

  getForm() {
    return (
      <>
        <SView col={'xs-11'} border={this.bgborder} center row>
          <SForm
            ref={(form) => {
              this.form = form;
            }}
            // col={"xs-11 sm-9 md-7 lg-5 xl-4"}
            inputProps={{
              separation: 16,
              color: STheme.color.text,
              height: 64,
              fontSize: 16,
              font: 'Roboto'
            }}
            inputs={{
              Nombres: {
                placeholder: 'Nombres',
                isRequired: true,
                defaultValue: 'alvaro',
                icon: (
                  <SIcon
                    name={'InputUser'}
                    fill={STheme.color.primary}
                    width={17}
                    height={20}
                  />
                )
              },
              Apellidos: {
                placeholder: 'Apellidos',
                isRequired: true,
                defaultValue: 'siles',
                icon: (
                  <SIcon
                    name={'InputUser'}
                    fill={STheme.color.primary}
                    width={17}
                    height={20}
                  />
                )
              },
              CI: {
                placeholder: 'Documento de identidad',
                defaultValue: '8946898',
                icon: (
                  <SIcon
                    name={'InputDocument'}
                    fill={STheme.color.primary}
                    width={24}
                    height={16}
                  />
                )
              },
              Correo: {
                placeholder: 'Correo electronico',
                type: 'email',
                isRequired: !this.type,
                defaultValue: 'alvarom',
                icon: (
                  <SIcon
                    name={'InputEmail'}
                    fill={STheme.color.primary}
                    width={17}
                    height={20}
                  />
                )
              },
              Telefono: {
                placeholder: 'Telefono',
                type: 'phone',
                isRequired: !this.type,
                defaultValue: '76654217',
                icon: (
                  <SIcon
                    name={'InputPhone'}
                    fill={STheme.color.primary}
                    width={20}
                    height={20}
                  />
                )
              }
            }}
            onSubmit={(values) => {
              // if (this.key) {
              //   Parent.Actions.editar({
              //     ...this.usr,
              //     ...values
              //   }, this.props);
              // } else {
              //   if (this.type) {
              //     console.log(this.usr);
              //     switch (this.type) {
              //       case "gmail":
              //         values["Password"] = "";
              //         values["gmail_key"] = this.usr.gmail_key;
              //         if (!values["gmail_key"]) return null;
              //         break;
              //       case "facebook":
              //         values["facebook_key"] = this.usr.facebook_key;
              //         values["Password"] = "";
              //         if (!values["facebook_key"]) return null;
              //         break;
              //     }
              //   }
              //   Parent.Actions.registro(values, this.props);
              // }
            }}
          />
        </SView>
      </>
    );
  }
  getBtnFooter() {
    return (
      <>
        <SView
          col={'xs-12'}
          center
          height={60}
          style={{bottom: 0}}
          backgroundColor={STheme.color.primary}
          onPress={() => {
            SNavigation.navigate('evento/qr');
          }}>
          <SText fontSize={24} color={STheme.color.secondary} font={'Roboto'}>
            RESERVAR
          </SText>
        </SView>
      </>
    );
  }

  render() {
    return (
      <>
        <SPage title={''}>
          <SView col={'xs-12'} center>
            <SView
              col={'xs-12 sm-12 md-12 lg-8 xl-6'}
              row
              center
              backgroundColor={'transparent'}>
              <SHr height={15} color={this.bgSpace} />
              {this.getHeader()}
              {this.getForm()}
              <SHr height={25} color={this.bgSpace} />
            </SView>
          </SView>
        </SPage>
        {this.getBtnFooter()}
      </>
    );
  }
}
const initStates = (state) => {
  return {state};
};
export default connect(initStates)(Registro);
