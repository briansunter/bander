import React, { Component } from 'react';
import './App.css';
import * as choose from './lib/choose';
import { introAreas } from './lib/maps/intro';

interface IState {
    gameState: choose.State;
    messages: Array<string>;
}

interface ABProps {
    handleGameAction:(a:string)=>void,
    disabled: boolean,
    id: string,
    description: string
}

const ActionButton = (p:ABProps) =>
    <button onClick = {() => p.handleGameAction(p.id)}
            disabled = {p.disabled }>
        <h2> {p.id} </h2>
        <p> {p.description} </p>
    </button>;

class App extends Component<{},IState> {
    messagesEnd: React.RefObject<HTMLDivElement> = React.createRef()

    state:IState = {
        gameState: {
            currentLocation: "introArea",
            benchQuestStarted:false,
            benchQuestCompleted:false},
        messages:[]
    }

    scrollToBottom = () => {
        if (this.messagesEnd && this.messagesEnd.current && this.messagesEnd.current.scrollIntoView){
            this.messagesEnd.current.scrollIntoView({ behavior: 'smooth' })
        }
    }

    componentWillMount() {
        let areaDesc = choose.describeArea(this.state.gameState,choose.currentArea(this.state.gameState, introAreas))
        this.state.messages.push(areaDesc);
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    actions():Array<choose.PlayerAction> {
        const p:choose.Area = choose.currentArea(this.state.gameState,introAreas);
        const actions2:Array<choose.PlayerAction> = choose.possiblePlayerActions(this.state.gameState,p.actionHooks);
        return actions2;
    }

    handleGameAction = (a:string) => {
        const area = choose.currentArea(this.state.gameState,introAreas);
        const effects  = choose.runActionHooks(this.state.gameState,a ,area.actionHooks);
        var nextState: choose.State = this.state.gameState;
        for (var e of effects) {
            this.state.messages.push(e[0]);
            nextState = e[1];
        }
        let areaDesc = choose.describeArea(nextState,choose.currentArea(nextState,introAreas));
        this.state.messages.push(areaDesc);

        this.setState({...this.state, gameState:{...this.state.gameState, ...nextState}});
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
          {this.actions().map(a =>
              <ActionButton handleGameAction = {this.handleGameAction }
              disabled = {!a.enabled}
              id = {a.id}
              description = {a.description}
              />)}
          </div>
      </div>
      );
  }
}


export default App;
