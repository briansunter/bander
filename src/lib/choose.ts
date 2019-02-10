export interface State {
  currentLocation: string;
}

export interface Action {
  name: string;
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
  description: string;
  moveDescription: string;
}

type enhanceNavigation = (p: Place, nas: Array<NavigationAction>) => Place;

let addNavigation: enhanceNavigation = (p: Place, nas: Array<NavigationAction>): Place => {
  const navMessage: string = nas.map(n => `${n.description} "${n.name}"`).join("\n");
  return {
    id: p.id,
    describePlace: s => p.describePlace(s).concat("\n", navMessage),
    possibleActions: s => p.possibleActions(s).concat(nas),
    performAction: (s, a) => {
      let navAction = nas.filter(n => n.name === a.name).pop();
      if (navAction) {
        return [navAction!.moveDescription, { ...s, currentLocation: navAction!.nextLocation }];
      } else {
        return p.performAction(s, a);
      }
    }
  }
};


let intro: Place = addNavigation({
  id: "intro",
  describePlace: s => "You started the game. There's a sign on the wall.",
  possibleActions: s => [{ name: "read sign" }],
  performAction: (s, a) => {
    switch (a.name) {
      case "read sign": {
        return ["You read the sign. it says to go south", s]
      }
      default: {
        return ["", s];
      }
    }
  },
}, [{ name: "south", nextLocation: "southOfIntro", description: "There's a stone path leading south.", moveDescription: "You walk out of the intro down the stone path" }]);

let southOfIntro: Place = addNavigation({
  id: "southOfIntro",
  describePlace: s => "You're in a nice park. There's a bench",
  possibleActions: s => [{ name: "sit on bench" }],
  performAction: (s, a) => {
    switch (a.name) {
      case "sit on bench": {
        return ["you sit on the bench and hear a tutorial", s]
      }
      default: {
        return ["Not Found", s];
      }
    }
  },
}, [{ name: "north", description: "There's a stone path going north to the intro", moveDescription: "You walk back north to the intro", nextLocation: "intro" }, { name: "west", description: "A dirt path going to the market to the west", moveDescription: "You walk to the market on the dirt path", nextLocation: "introMarket" }]);

let introMarket: Place = addNavigation({
  id: "introMarket",
  describePlace: s => "Youre in a busting market",
  possibleActions: s => [{ name: "sword vendor" }],
  performAction: (s, a) => {
    switch (a.name) {
      case "sword vendor": {
        return ["you visit the sword vendor", s]
      }
      default: {
        return ["Not Found", s];
      }
    }
  },
}, [{ name: "east", description: "You walk on the dirt path back to the park", moveDescription: "You walk back north to the intro", nextLocation: "intro" }]);

let places: Array<Place> = [intro, southOfIntro]

export function placeById(id: string): Place {
  return places.filter(n => n.id === id).pop()!;
}

export function currentPlace(state: State): Place {
  return placeById(state.currentLocation);
}

interface Foo {
  name: string;
  say(): string;
}
