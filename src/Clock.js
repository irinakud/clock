import React from 'react'

const BREAK_LENGTH = 5;
const SESSION_LENGTH = 25;
const TIMER_SPEED = 1;
const START_LABEL = "Start";
const STOP_LABEL = "Pause";
const SESSION_LABEL = "Session";
const BREAK_LABEL = "Break";
const RESET_LABEL = "Reset";

class Clock extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      break_length: BREAK_LENGTH,
      session_length: SESSION_LENGTH,
      time_left: SESSION_LENGTH*60,
      start_stop: START_LABEL,
      is_session: true,
      intervalId: 0
    };
  }
  
  handleReset() {
    this.stopBeep();
    clearInterval(this.state.intervalId);
    this.setState(
      {
        break_length: BREAK_LENGTH,
        session_length: SESSION_LENGTH,
        time_left: SESSION_LENGTH*60,
        start_stop: START_LABEL,
        is_session: true,
        intervalId: 0
      }
    );
  }
  
  handleBreakDecrement(){
    let length = this.state.break_length - 1;
    if (length > 0) {
        this.setState({break_length: length});
        if (!this.state.is_session && this.state.intervalId === 0)
          this.setState({time_left: length*60});
      
    }
  }
  handleBreakIncrement(){
    let length = this.state.break_length + 1;
    if (length <= 60) {
        this.setState({break_length: length});
        if (!this.state.is_session && this.state.intervalId === 0)
          this.setState({time_left: length*60});
    }
  }
  
  handleSessionDecrement(){
    let length = this.state.session_length - 1;
    if (length > 0) {
        this.setState({session_length: length});
      if (this.state.is_session && this.state.intervalId === 0)
          this.setState({time_left: length*60});
    }
  }
  handleSessionIncrement(){
    let length = this.state.session_length + 1;
    if (length <= 60) {
        this.setState({session_length: length});
        if (this.state.is_session && this.state.intervalId === 0)
          this.setState({time_left: length*60});
    }
  }
  
  setTimer(){
    const timer = this.state.time_left - 1;

    if (timer > 0) {
      this.setState({time_left: timer});
      return;
    }
    
    if (timer === 0) {
      this.playBeep();    
      this.setState({time_left: timer});
      return;
    }
    
    const timeLeft = this.state.is_session ? this.state.break_length*60 : this.state.session_length*60;
    this.setState({
        is_session: !this.state.is_session, 
        time_left: timeLeft
      });    
  }
  
  formatTimer(time) {
    var minutes = Math.floor(time/60);
    var seconds = Math.floor(time%60);
    return (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
  }
    
  handleStartStop(){
    const isStart = this.state.start_stop === START_LABEL;
    this.setState({start_stop: isStart ? STOP_LABEL : START_LABEL});
    
    if (isStart) {
      var intervalId = setInterval(this.setTimer.bind(this), 1000/TIMER_SPEED);
      this.setState({intervalId: intervalId});
    }
    else {
      clearInterval(this.state.intervalId);
    }
    
  }
  
  playBeep() {
    const beep = document.getElementById("beep");
    beep.currentTime = 0;
    beep.play();
  }
  
  stopBeep() {
    const beep = document.getElementById("beep");
    beep.pause();
    beep.currentTime = 0;
  }
  
  render() { 
    return (
      <div id="clock">
        <div id="settings">
          <div id="break-setting">
            <div className="label">Break (mins)</div>
            <button className="btn btn-sm btn-outline-secondary" onClick={this.handleBreakDecrement.bind(this)}> <i className="fas fa-minus"></i> </button>
            <span className="length">{this.state.break_length}</span>
            <button className="btn btn-sm btn-outline-secondary" onClick={this.handleBreakIncrement.bind(this)}><i className="fas fa-plus"></i></button>
          </div>
          <div id="session-setting">
            <div className="label">Session (mins)</div>
            <div className="btn btn-sm btn-outline-secondary" onClick={this.handleSessionDecrement.bind(this)}> <i className="fas fa-minus"></i> </div>
            <span className="length">{this.state.session_length}</span>          
            <div className="btn btn-sm btn-outline-secondary" onClick={this.handleSessionIncrement.bind(this)}> <i className="fas fa-plus"></i> </div>
          </div>
        </div> 
        <div id="circle">
          <div id="timer-label" >{this.state.is_session ? SESSION_LABEL : BREAK_LABEL}</div>
          <div id="time-left" >{this.formatTimer(this.state.time_left)}</div>
    <div id="buttons">
          <button id="start_stop" onClick={this.handleStartStop.bind(this)} className="btn btn-outline-primary">{this.state.start_stop}</button>
          <button id="reset" onClick={this.handleReset.bind(this)} className="btn btn-outline-secondary">{RESET_LABEL}</button>
    </div>
          <audio src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" id="beep"></audio>
</div>
      </div>
    );
  }
}

export default Clock;