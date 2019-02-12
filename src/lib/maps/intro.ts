import { State, Area, ActionHook } from '../choose';

export let nh: ActionHook = {
  id: "south",
  requirements: [{ currentLocation: "introArea" }],
  newState: { currentLocation: "southOfIntro" },
  description: _ => "There's a stone path going south",
  actionDescription: _ => "You walk south down the stone path"
}

export let nhs: ActionHook = {
  id: "north",
  requirements: [{ currentLocation: "southOfIntro" }],
  newState: { currentLocation: "introArea" },
  description: _ => "There's a stone path going north",
  actionDescription: _ => "You walk north up the stone path"
}

export let sitOnBench: ActionHook = {
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

export let west: ActionHook = {
  id: "west",
  requirements: [{ currentLocation: "southOfIntro" }],
  newState: { currentLocation: "introMarket" },
  description: _ => "There's a dirt path west to the market",
  actionDescription: _ => "You walk along the dirt path to the market"
}

export let east: ActionHook = {
  id: "east",
  requirements: [{ currentLocation: "introMarket" }],
  newState: { currentLocation: "southOfIntro" },
  description: _ => "There's a dirt path east leading back to the park",
  actionDescription: _ => "You walk east along the path back to the park."
}

export let talkToIntroGuy: ActionHook = {
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

export let introAreas = [introArea, southOfIntroArea, introMarketArea]
