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
    messagesEnd: React.RefObject<HTMLDivElement> = React.createRef()

    state = {
        gameState: {currentLocation: "introArea",benchQuestStarted:false,benchQuestCompleted:false},
        messages:def
    }

    componentWillMount() {
        let areaDesc = choose.describeArea(this.state.gameState,choose.currentArea(this.state.gameState))
        this.state.messages.push(areaDesc);
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }


    actions():Array<choose.PlayerAction> {
        const p:choose.Area = choose.currentArea(this.state.gameState);
        const actions2:Array<choose.PlayerAction> = choose.possiblePlayerActions(this.state.gameState,p.actionHooks );
        return actions2;
    }

    handleGameAction = (a:choose.PlayerAction) => {
        const area = choose.currentArea(this.state.gameState);
        const effects  = choose.runActionHooks(this.state.gameState,a.id,area.actionHooks);
        var nextState: choose.State = this.state.gameState;
        for (var e of effects) {
            this.state.messages.push(e[0]);
            nextState = e[1];
        }
        let areaDesc = choose.describeArea(nextState,choose.currentArea(nextState));
        this.state.messages.push(areaDesc);

        this.setState({...this.state, gameState:{...this.state.gameState, ...nextState}});
    }

    scrollToBottom = () => {
        if (this.messagesEnd && this.messagesEnd.current && this.messagesEnd.current.scrollIntoView){
            this.messagesEnd.current.scrollIntoView({ behavior: 'smooth' })
        }
    }
  render() {
      return (
      <div className="App">
          <div className="Messages">
              <ul>
              {this.state.messages.map(m => <li> {m}</li>)}
                  <div ref={this.messagesEnd} />

              </ul>
          </div>
          <div className="Actions">
              {this.actions().map(a => <button onClick = {() => this.handleGameAction(a)} disabled = {! a.enabled}> {a.id + a.description} </button>)}
          </div>
      </div>
    );
  }
}

export default App;
