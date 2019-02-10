import * as _ from "lodash";

interface BenchQuestState {
  benchQuestStarted: boolean;
  benchQuestCompleted: boolean;
}

interface QuestState extends BenchQuestState {

}

export interface State extends QuestState {
  currentLocation: string;
}

export interface Action {
  name: string;
  description: string;
  perform: (s: State) => actionEffect;
}

type describePlace = (s: State) => string;
type possibleActions = (s: State) => Array<Action>;
type actionEffect = [string, State];
type performAction = (s: State, a: Action) => actionEffect;

export interface Place {
  id: string;
  describePlace: describePlace,
  possibleActions: possibleActions,
  performAction: performAction,
}

interface NavigationAction extends Action {
  nextLocation: string;
}

type enhanceNavigation = (p: Place, nas: Array<NavigationAction>) => Place;

let addNavigation: enhanceNavigation = (p: Place, nas: Array<NavigationAction>): Place => {
  // const navMessage: string = nas.map(n => `${n.description} "${n.name}"`).join("\n");
  return {
    id: p.id,
    describePlace: p.describePlace,
    possibleActions: s => p.possibleActions(s).concat(nas),
    performAction: (s, a) => {
      let navAction = nas.filter(n => n.name === a.name).pop();
      if (navAction) {
        return [navAction!.perform(s)[0], { ...s, currentLocation: navAction!.nextLocation }];
      } else {
        return p.performAction(s, a);
      }
    }
  }
};

function navPerformer(s: State, n: NavigationAction): actionEffect {
  return [n.perform(s)[0], { ...s, currentLocation: n.nextLocation }]
}

function makeNavAction(name: string, description: string, nextLocation: string): NavigationAction {
  const moveDescription = `You moved ${name}, your new location is ${nextLocation} \n`;
  return {
    name,
    description,
    nextLocation,
    perform: s => { return [moveDescription, { ...s, currentLocation: nextLocation }] }
  }
}

interface QuestAction<T> extends Action {
  requirements: Array<T>;
  appendState: T;
}

function makeQuestAction<T extends QuestState>(name: string, description: string, requirements: Array<T>, appendState: T, completeDescription: string, defaultEffect: string): QuestAction<T> {
  let meetsRequirements = (s: State): boolean => _.every(requirements, r => _.isMatch(s, r));
  return {
    name,
    requirements,
    appendState,
    description,
    perform: (s: State) => {
      if (meetsRequirements(s)) {
        return [completeDescription, { ...s, ...appendState }];
      } else {
        return [defaultEffect, s];
      }

    }
  }
}

let intro: Place = addNavigation({
  id: "intro",
  describePlace: s => "You started the game. There's a sign on the wall.",
  possibleActions: s => [{
    name: "read sign",
    description: "There is a weathered sign to the side",
    perform: s => ["You read the sign. it says to go south", s]
  }],
  performAction: (s, a) => a.perform(s)
},
  [makeNavAction("south", "There's a stone path leading south.", "southOfIntro")])


let benchQuest =
  makeQuestAction<BenchQuestState>("sit on bench",
    "A cool looking bench",
    [{ benchQuestStarted: true, benchQuestCompleted: false }],
    { benchQuestStarted: true, benchQuestCompleted: true },
    "You feel a glow of energy. return to intro guy",
    "The bench is comfy, but nothing interesting happens yet...");

let southOfIntro: Place = addNavigation({
  id: "southOfIntro",
  describePlace: _ => "You're in a nice park. There's a bench",
  possibleActions: _ => [benchQuest],
  performAction: (s, a) => a.perform(s),
},
  [makeNavAction("north", "There's a stone path going north to the intro", "intro"),
  makeNavAction("west", "A dirt path going to the market to the west", "introMarket")]);

let introMarket: Place = addNavigation({
  id: "introMarket",
  describePlace: s => "You're in a busting market",
  possibleActions: s => [{
    name: "talk to intro person", description: "This person will give you your first quest", perform: s => {
      if (s.benchQuestCompleted) {
        return ["Congratulations on completing your first quest!", s]
      } else {
        return ["Your first quest is to sit on the bench and see what happens!", { ...s, benchQuestStarted: true }]
      }
    }
  }],
  performAction: (s, a) => a.perform(s),
},
  [makeNavAction("east", "You walk on the dirt path back to the park", "southOfIntro")]);

let places: Array<Place> = [intro, southOfIntro, introMarket]

export function placeById(id: string): Place {
  return places.filter(n => n.id === id).pop()!;
}

export function currentPlace(state: State): Place {
  return placeById(state.currentLocation);
}
