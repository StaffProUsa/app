import React, { Component } from 'react'
import { SIcon, SNavigation, SText, STheme, SView, SLanguage } from 'servisofts-component'
import RContent from './RContent';
import { SPopup } from 'servisofts-component';
import BoxLanguages from '../Popups/BoxLanguages';

export default class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
 

  btnBack() {
    if (this.props.preventBack) return;
    if (!SNavigation.isBack()) return;
    return <SView col={"xs-12"} height style={{
      justifyContent: 'center',
    }}>
      <SView onPress={() => {
        SNavigation.goBack();
      }} style={{
        maxWidth: 35,
      }} center height>
        <SIcon width={25} height={25} name={"Arrow"} fill={STheme.color.text} />
      </SView>
    </SView>
  }
  render() {
    return (
      <SView col={"xs-12"} height={40} backgroundColor={STheme.color.barColor} style={{
        overflow:"hidden"
      }}>
        <SView col={"xs-12"} height row>
          <SView width={90}>
            {this.btnBack()}
          </SView>
          <SView flex center>
            <SText language={this.props?.titleLanguage}>{this.props?.title}</SText>
          </SView>
          <SView width={90} heiht center
            onPress={() => {
              // SNavigation.reset("/");
              SPopup.open({ key: "menuLat", content: <BoxLanguages datas={this.props?.data} /> });
            }} 
            >
            <RContent />
          </SView>
        </SView>
      </SView >
    )
  }
}