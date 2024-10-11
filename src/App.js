import React, { useEffect } from 'react';
import { Platform } from 'react-native'
import { SComponentContainer, SLanguage, SNavigation, SMapView, SPage } from 'servisofts-component';
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

SLanguage.language = "en";
const versionToNumber = (v) => {
  const array = v.split("\.");
  const vl = 100;
  let vn = 0;
  for (let i = 0; i < array.length; i++) {
    const element = array[array.length - i - 1];
    const vp = Math.pow(vl, i);
    vn += (vp * element)
  }
  console.log(vn)
  return vn;
}


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

SMapView.bootstrapURLKeys = { key: "AIzaSyBO0I3cb4siQ7OiKH-nTDl5n3HSUd4FTQo" }
 
const App = (props) => {
  useEffect(() => {
    SSocket.sendPromise({
      component: "enviroment",
      type: "getByKey",
      key: "version_" + Platform.OS
    }).then(e => {
      if (!e.data) return;
      const versionRequired = e.data?.data
      if (versionToNumber(versionRequired) > versionToNumber(packageInfo.version)) {
        SNavigation.replace("/version_required")
        return;
      }
      // DataBaseContainer.sync();

    }).catch(e => {
      console.error(e)
    })
  }, [])
  return <Redux>
    <ErrorBoundary>
      <SComponentContainer
        // debug //para cambio de tema
        socket={SSocket}
        assets={Assets}
        // inputs={Config.inputs}
        inputs={Config.inputs}
        // background={<BackgroundImage />}
        theme={{ initialTheme: 'dark', themes: Config.theme, }}

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
      </SComponentContainer>
    </ErrorBoundary>
  </Redux>
};
export default App;
