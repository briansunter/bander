import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as choose from './lib/choose';

interface IState {
    gameState: choose.State;
    messages: Array<string>;
}

interface IProps {}
let def  = new Array<string>();
class App extends Component<IProps,IState> {
    state = {
        gameState: {currentLocation: "intro",benchQuestStarted:false,benchQuestCompleted:false},
        messages:def
    }

    componentWillMount() {
        const place:choose.Place = choose.currentPlace(this.state.gameState);
        const msg  = place.describePlace(this.state.gameState);
        this.state.messages.push(msg);
    }

    handleGameAction = (a:choose.Action) => {
        const place:choose.Place = choose.currentPlace(this.state.gameState);
        const [desc, s] = place.performAction(this.state.gameState, a);
        this.state.messages.push(desc);
        this.setState({...this.state, gameState:s});
        const nextPlace:choose.Place = choose.currentPlace(s);
        this.state.messages.push(nextPlace.describePlace(s));
    }

  render() {
    const place:choose.Place = choose.currentPlace(this.state.gameState);
    const actions:Array<choose.Action> = place.possibleActions(this.state.gameState);
    return (
      <div className="App">
          <div className="Messages">
              <ul>
              {this.state.messages.map(m => <li> {m}</li>)}
              </ul>
          </div>
          <div className="Actions">
              {actions.map(a => <button onClick = {() => this.handleGameAction(a)} > {a.name} </button>)}
          </div>
      </div>
    );
  }
}

export default App;
