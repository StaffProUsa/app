import React, {Component} from 'react';

import {
  SDate,
  SIcon,
  SLoad,
  SText,
  STheme,
  SThread,
  SView
} from 'servisofts-component';

export default class Contador extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curTime: new SDate()
    };
  }

  render() {
    if (!this.props.date) return <SLoad />;
    var time = new SDate(this.props.date);
    var diff = this.state.curTime.diffTime(time);
    new SThread(1000 / 10, 'hiloRelojTimeOut', true).start(() => {
      this.setState({curTime: new SDate()});
    });
    var minutes = diff / (1000 * 60);
    var seconds = (diff % (1000 * 60)) / 1000;
    minutes = Math.floor(minutes);
    seconds = Math.floor(seconds);
    if (diff <= 0) {
      return null;
    }
    return (
      <SView col={'xs-12'} height={50} border={'transparent'}>
        <SView col={'xs-12'} row height center>
          <SIcon name={'Timer'} width={34} fill={STheme.color.primary} />
          <SView width={20} />
          <SText
            font={'Arial'}
            fontSize={40}
            center
            color={STheme.color.primary}>
            {minutes} : {seconds < 10 ? '0' + seconds : seconds}{' '}
          </SText>
        </SView>
      </SView>
    );
  }
}
