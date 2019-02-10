interface State {
  currentLocation: string;
}

interface Action {
  name: string;
}

type describePlace = (s: State) => string;
type possibleActions = (s: State) => Array<Action>;
type actionEffect = [string, State];
type performAction = (s: State, a: Action) => actionEffect;

interface Place {
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
function compose2<T1 extends any[], T1R, T2>(f1: (...args1: T1) => T1R, f2: (arg: T1R) => T2) {
  return (...a: T1) => f2(f1(...a));
}

let addNavigation: enhanceNavigation = (p, nas: Array<NavigationAction>) => {
  const navMessage: string = nas.map(n => `${n.description} "${n.name}"`).join("\n");
  p.describePlace = compose2(p.describePlace, (ss) => ss.concat("\n", navMessage));
  p.possibleActions = compose2(p.possibleActions, (ss) => ss.concat(nas));
  // p.performAction = compose2(performNavActions, p.performAction);
  let pa = p.performAction;

  p.performAction = (s: State, a: Action) => {
    let navAction = nas.filter(n => n.name === a.name).pop();
    if (navAction) {
      return [navAction!.moveDescription, { ...s, currentLocation: navAction!.nextLocation }];
    } else {
      return pa(s, a);
    }
  }

  return p;
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

export function foo() {
  let s = { currentLocation: "intro" };
  console.log(intro.describePlace(s))
  console.log(intro.possibleActions(s))
  let [ad, st] = intro.performAction(s, { name: "south" });
  console.log(southOfIntro.describePlace(st));
  let [add, _] = southOfIntro.performAction(s, { name: "sit on bench" });
  console.log("bench");
  console.log(add);
}
