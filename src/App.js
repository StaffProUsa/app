import React, { useEffect } from 'react';
import { Platform } from 'react-native'
import { SComponentContainer, SLanguage, SNavigation, SMapView, SPage, SText, STheme } from 'servisofts-component';
import packageInfo from "../package.json";
import Assets from './Assets';
import Pages from './Pages';

import Config from "./Config"
import Redux, { store } from './Redux';

import SSocket, { setProps } from 'servisofts-socket';
import BarraSuperior from './Components/BarraSuperior';
import NavBar from './Components/NavBar';

import Firebase from './Firebase';
import DeviceKey from './Firebase/DeviceKey';
import Socket from './Socket';
import ErrorBoundary from './Components/ErrorBoundary';
import * as MDL from "./MDL"
SLanguage.language = "en";


setProps(Config.socket);


try {
  if (Platform.OS == "web") {
    if ((window.location.href + "").startsWith("https")) {
      Firebase.init();
    } else if ((window.location.href + "").startsWith("http://localhost")) {
      Firebase.init();
    } else {
      console.log("No se activara el Fireabase Por que no contamos con SSL")
    }
  } else {
    Firebase.init();
  }
} catch (e) {
  console.log(e);
}

SLanguage.loadStorage();

SMapView.bootstrapURLKeys = { key: "AIzaSyC4rcy6GRVM5_i9ZF0vGFmb1HRc0mXsAdk" }

const App = (props) => {
  useEffect(() => {
    MDL.componentDidMount();
   
  }, [])
  return <Redux>
    <ErrorBoundary>
      <SComponentContainer
        debug //para cambio de tema
        socket={SSocket}
        assets={Assets}
        // inputs={Config.inputs}
        inputs={Config.inputs}
        // background={<BackgroundImage />}
        theme={{ initialTheme: 'default', themes: Config.theme, }}
      >
        <SNavigation
          linking={{
            prefixes: ["https://staffprousa.servisofts.com/", "http://staffprousa.servisofts.com/", "https://staffprousa.servisofts.com/link/"],
            getInitialURL: () => {
              Firebase.getInitialURL();
            }
          }}
          props={{ title: 'Staff Pro USA', pages: Pages, navBar: NavBar }}
        />
        <Socket store={store} />
        {/* <NavBar /> */}
        <SText style={{ position: "absolute", bottom: 2, right: 2, zIndex: 0, pointerEvents: "none" }} disabled fontSize={8} color={STheme.color.lightGray}>v{packageInfo.version}</SText>
      </SComponentContainer>
    </ErrorBoundary>
  </Redux>
};
export default App;
