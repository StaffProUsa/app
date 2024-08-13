import React from 'react';
import { connect } from 'react-redux';
import { SHr, SIcon, SNavigation, SPage, SText, STheme, SView } from 'servisofts-component';
import PButtomFooter from '../../Components/PButtomFooter';

class ErrorQr extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }



  render() {
    return (
      <>
        <SPage center disableScroll>
          <SView flex center col={'xs-11 sm-10 md-8 lg-6 xl-4'}>
            <SView col={'xs-12'} center row flex border={'transparent'}>
              <SHr height={20} />
              <SView col={'xs-12'} border={'transparent'}>
                <SText fontSize={24} bold center>
                  Error
                </SText>
                <SHr height={20} />
                <SText fontSize={14} center>
                  Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown ...
                </SText>
              </SView>
              <SHr height={40} />
              <SView col={'xs-12'} height={220} border={'transparent'} center>
                <SIcon
                  name={'Delete'}
                  width={200}
                  fill={STheme.color.text}
                />
              </SView>
              <SHr height={40} />
            </SView>
          </SView>
          <SHr height={40} />


          {/* <SView col={'xs-11'} height={100} row center>
             <SView flex center height={60}>
              <SView
                height={50}
                width={100}
                center
                style={{
                  backgroundColor: 'white',
                  borderRadius: 8,
                  borderColor: STheme.color.lightGray,
                  borderWidth: 2,
                  padding: 8
                }}>
               volver
              </SView>
            </SView>
            <SView flex center height={60}>
              <SView
                height={50}
                width={100}
                center
                style={{
                  backgroundColor: 'white',
                  borderRadius: 8,
                  borderColor: STheme.color.lightGray,
                  borderWidth: 2,
                  padding: 8
                }}>
                Reintentar
              </SView>
            </SView>
           </SView> */}


        </SPage>
        <PButtomFooter
          primary
          fontSize={24}
          onPress={() => {
            SNavigation.navigate('/');
          }}>
          Reintentar
        </PButtomFooter>
      </>
    );
  }
}
const initStates = (state) => {
  return { state };
};
export default connect(initStates)(ErrorQr);
