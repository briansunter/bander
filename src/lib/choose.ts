import * as _ from "lodash";

interface BenchQuestState {
  benchQuestStarted?: boolean;
  benchQuestCompleted?: boolean;
}

interface QuestState extends BenchQuestState {

}

interface NavState {
  currentLocation: string;
}

export type SubState = NavState | QuestState;

export interface State extends NavState, QuestState {

}

type ActionEffect = [string, State];

interface ActionHook<T> {
  id: string;
  requirements: Array<T>;
  newState: T;
  canSee?: (t: T) => boolean;
  description: (t: T) => string;
  actionDescription: (t: T) => string;
}



export let meetsRequirements = (s: State, reqs: Array<SubState>): boolean => _.every(reqs, r => _.isMatch(s, r));

export let canSee = (s: SubState, a: ActionHook<SubState>): boolean => !a.canSee || a.canSee(s)

export function runActionHooks(s: State, actionid: string, ahs: Array<ActionHook<SubState>>): Array<ActionEffect> {
  const ahsForId: Array<ActionHook<SubState>> = ahs.filter(a => a.id === actionid).filter(a => canSee(s, a));
  var nextState: State = s;
  var effects = new Array<ActionEffect>();

  for (let ah of ahsForId) {
    if (meetsRequirements(nextState, ah.requirements)) {
      nextState = { ...nextState, ...ah.newState }
      effects.push([ah.actionDescription(nextState), nextState]);
    }
  }
  return effects;
}

export function describeActions(s: SubState, ahs: Array<ActionHook<SubState>>): string {
  return ahs.filter(a => canSee(s, a)).map(a => `${a.id} : ${a.description(s)}`).join("\n");
}

export function possiblePlayerActions(s: State, ahs: Array<ActionHook<SubState>>): Array<PlayerAction> {
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
  description: (s: SubState) => string;
  actionHooks: Array<ActionHook<SubState>>;
}

export let nh: ActionHook<SubState> = {
  id: "south",
  requirements: [{ currentLocation: "introArea" }],
  newState: { currentLocation: "southOfIntro" },
  description: _ => "There's a stone path going south",
  actionDescription: _ => "You walk south down the stone path"
}

export let nhs: ActionHook<SubState> = {
  id: "north",
  requirements: [{ currentLocation: "southOfIntro" }],
  newState: { currentLocation: "introArea" },
  description: _ => "There's a stone path going north",
  actionDescription: _ => "You walk north up the stone path"
}

export let sitOnBench: ActionHook<SubState> = {
  id: "sit on bench",
  requirements: [{ currentLocation: "southOfIntro" }],
  newState: { currentLocation: "southOfIntro" },
  description: _ => "Theres a nice bench",
  actionDescription: _ => "You sit on the bench"
}

export let west: ActionHook<SubState> = {
  id: "west",
  requirements: [{ currentLocation: "southOfIntro" }],
  newState: { currentLocation: "introMarket" },
  description: _ => "There's a dirt path west to the market",
  actionDescription: _ => "You walk along the dirt path to the market"
}

export let talkToIntroGuy: ActionHook<SubState> = {
  id: "talk intro guy",
  requirements: [{ currentLocation: "southOfIntro" }, { benchQuestStarted: false }],
  newState: { benchQuestStarted: true },
  description: _ => "There's a dirt path west to the market",
  actionDescription: _ => "You walk along the dirt path to the market"
}

let ts: State = {
  currentLocation: "intro",
  benchQuestCompleted: false,
  benchQuestStarted: false
};

let introArea: Area = {
  id: "introArea",
  description: _ => "You're in the intro!",
  actionHooks: [nh]

};

let southOfIntroArea: Area = {
  id: "southOfIntro",
  description: _ => "You're in a nice park to the south",
  actionHooks: [nhs, sitOnBench]

};

let introMarketArea: Area = {
  id: "introMarket",
  description: _ => "You're in a bustling market",
  actionHooks: [nhs, sitOnBench]

};

export interface PlayerAction {
  id: string;
  description: string;
  enabled: boolean;
}

export let allPlaces: _.Dictionary<Area> = _.mapValues(_.groupBy([introArea, southOfIntroArea], 'id'), v => v[0]);

export function currentArea(s: NavState): Area {
  return allPlaces[s.currentLocation];
}

export function describeArea(s: SubState, a: Area): string {
  return `You're in ${a.id} \n ${a.description(s)} \n ${describeActions(s, a.actionHooks)}`
}
