import * as _ from "lodash";

export interface State {
  currentLocation: string;
  benchQuestStarted?: boolean;
  benchQuestCompleted?: boolean;
}

type ActionEffect = [string, State];

type UpdateState = (s: State) => State;

type NewState = State | UpdateState;

export interface ActionHook {
  id: string;
  requirements: Array<State>;
  newState: NewState;
  canSee?: (s: State) => boolean;
  description: (s: State) => string;
  actionDescription: (s: State) => string;
}

export function meetsRequirements(s: State, reqs: Array<State>): boolean {
  return _.every(reqs, r => _.isMatch(s, r));
}

export function canSee(s: State, a: ActionHook): boolean {
  return !a.canSee || a.canSee(s)
}

export function runActionHooks(s: State, actionid: string, ahs: Array<ActionHook>): Array<ActionEffect> {
  const ahsForId: Array<ActionHook> = ahs.filter(a => a.id === actionid).filter(a => canSee(s, a));
  var nextState: State = s;
  var effects = new Array<ActionEffect>();

  for (let ah of ahsForId) {
    let newState: State;
    if (typeof ah.newState === "function") {
      newState = ah.newState(nextState);
    } else {
      newState = ah.newState;
    }

    if (meetsRequirements(nextState, ah.requirements)) {
      nextState = { ...nextState, ...newState }
      effects.push([ah.actionDescription(nextState), nextState]);
    }
  }

  return effects;
}

export function describeActions(s: State, ahs: Array<ActionHook>): string {
  return ahs.filter(a => canSee(s, a)).map(a => `${a.id} : ${a.description(s)}`).join("\n");
}

export function possiblePlayerActions(s: State, ahs: Array<ActionHook>): Array<PlayerAction> {
  return ahs.filter(a => canSee(s, a)).map(a => {
    return {
      id: a.id,
      description: a.description(s),
      enabled: meetsRequirements(s, a.requirements)
    }
  });
}

export interface Area {
  id: string;
  description: (s: State) => string;
  actionHooks: Array<ActionHook>;
}

export interface PlayerAction {
  id: string;
  description: string;
  enabled: boolean;
}


export function currentArea(s: State, areas: Array<Area>): Area {
  let allPlaces: _.Dictionary<Area> = _.mapValues(_.groupBy(areas, 'id'), v => v[0]);
  return allPlaces[s.currentLocation];
}

export function describeArea(s: State, a: Area): string {
  return `You're in ${a.id} \n ${a.description(s)} \n ${describeActions(s, a.actionHooks)}`
}
