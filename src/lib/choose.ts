import * as _ from "lodash";

export interface State {
  currentLocation: string;
  benchQuestStarted?: boolean;
  benchQuestCompleted?: boolean;
}

type ActionEffect = [string, State];

type UpdateState = (s: State) => State;

type NewState = State | UpdateState;

interface ActionHook<T> {
  id: string;
  requirements: Array<T>;
  newState: NewState;
  canSee?: (t: T) => boolean;
  description: (t: T) => string;
  actionDescription: (t: T) => string;
}

export let meetsRequirements = (s: State, reqs: Array<State>): boolean => _.every(reqs, r => _.isMatch(s, r));

export let canSee = (s: State, a: ActionHook<State>): boolean => !a.canSee || a.canSee(s)

export function runActionHooks(s: State, actionid: string, ahs: Array<ActionHook<State>>): Array<ActionEffect> {
  const ahsForId: Array<ActionHook<State>> = ahs.filter(a => a.id === actionid).filter(a => canSee(s, a));
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

export function describeActions(s: State, ahs: Array<ActionHook<State>>): string {
  return ahs.filter(a => canSee(s, a)).map(a => `${a.id} : ${a.description(s)}`).join("\n");
}

export function possiblePlayerActions(s: State, ahs: Array<ActionHook<State>>): Array<PlayerAction> {
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
  actionHooks: Array<ActionHook<State>>;
}

export let nh: ActionHook<State> = {
  id: "south",
  requirements: [{ currentLocation: "introArea" }],
  newState: { currentLocation: "southOfIntro" },
  description: _ => "There's a stone path going south",
  actionDescription: _ => "You walk south down the stone path"
}

export let nhs: ActionHook<State> = {
  id: "north",
  requirements: [{ currentLocation: "southOfIntro" }],
  newState: { currentLocation: "introArea" },
  description: _ => "There's a stone path going north",
  actionDescription: _ => "You walk north up the stone path"
}

export let sitOnBench: ActionHook<State> = {
  id: "sit on bench",
  requirements: [{ currentLocation: "southOfIntro" }],
  newState: s => {
    if (s.benchQuestStarted) {
      return { currentLocation: "southOfIntro", benchQuestCompleted: true }
    }
    else { return { currentLocation: "southOfIntro" } }
  },
  description: s => (!s.benchQuestStarted || s.benchQuestCompleted) ? "Theres a nice bench" : "The bench has a strange glow...",
  actionDescription: s => !s.benchQuestStarted ? "You sit on the bench" : "You sit on the bench and feel a surge of energy.",
}

export let west: ActionHook<State> = {
  id: "west",
  requirements: [{ currentLocation: "southOfIntro" }],
  newState: { currentLocation: "introMarket" },
  description: _ => "There's a dirt path west to the market",
  actionDescription: _ => "You walk along the dirt path to the market"
}

export let east: ActionHook<State> = {
  id: "east",
  requirements: [{ currentLocation: "introMarket" }],
  newState: { currentLocation: "southOfIntro" },
  description: _ => "There's a dirt path east leading back to the park",
  actionDescription: _ => "You walk east along the path back to the park."
}

export let talkToIntroGuy: ActionHook<State> = {
  id: "talk intro guy",
  requirements: [{ currentLocation: "introMarket" }],
  newState: (s: State) => { if (!s.benchQuestStarted) { s.benchQuestStarted = true } return s; },
  description: s => !s.benchQuestStarted ? "This guy looks like he has a quest" : "Talk to him after sitting on bench",
  actionDescription: s => !s.benchQuestCompleted ? "You talk to the intro guy. he says sit on the bench" : "Congrats on finishing your first quest!"
}

let introArea: Area = {
  id: "introArea",
  description: _ => "You're in the intro!",
  actionHooks: [nh]

};

let southOfIntroArea: Area = {
  id: "southOfIntro",
  description: _ => "You're in a nice park to the south",
  actionHooks: [nhs, sitOnBench, west]

};

let introMarketArea: Area = {
  id: "introMarket",
  description: _ => "You're in a bustling market",
  actionHooks: [talkToIntroGuy, east]

};

export interface PlayerAction {
  id: string;
  description: string;
  enabled: boolean;
}

export let allPlaces: _.Dictionary<Area> = _.mapValues(_.groupBy([introArea, southOfIntroArea, introMarketArea], 'id'), v => v[0]);

export function currentArea(s: State): Area {
  return allPlaces[s.currentLocation];
}

export function describeArea(s: State, a: Area): string {
  return `You're in ${a.id} \n ${a.description(s)} \n ${describeActions(s, a.actionHooks)}`
}
