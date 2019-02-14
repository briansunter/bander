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

export let sitOnBenchNotStarted: ActionHook = {
  id: "sit on bench",
  requirements: [{ currentLocation: "southOfIntro", benchQuestStarted: false }],
  canSee: s => s.benchQuestStarted === false,
  newState: { currentLocation: "southOfIntro" },
  description: _ => "Theres a nice bench",
  actionDescription: _ => "You sit on the bench"
}

export let sitOnBenchStarted: ActionHook = {
  id: "sit on bench",
  requirements: [{ currentLocation: "southOfIntro", benchQuestStarted: true }],
  canSee: s => s.benchQuestStarted === true,
  newState: { currentLocation: "southOfIntro", benchQuestCompleted: true },
  description: _ => "The bench has a strange glow...",
  actionDescription: _ => "You sit on the bench and feel a surge of energy."
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

export let swordShop: ActionHook = {
  id: "enter sword shop",
  requirements: [{ currentLocation: "introMarket" }],
  newState: { currentLocation: "swordShop" },
  description: _ => "A shop where you can buy swords",
  actionDescription: _ => "You enter the sword shop"
}

export let backToMarket: ActionHook = {
  id: "back to market",
  requirements: [{ currentLocation: "swordShop" }],
  newState: { currentLocation: "introMarket" },
  description: _ => "Leave the sword shop",
  actionDescription: _ => "you leave the sword shop"
}

let swordShopArea: Area = {
  id: "swordShop",
  description: _ => "Inside a shop filled with pointy things",
  actionHooks: [backToMarket]
};

let introArea: Area = {
  id: "introArea",
  description: _ => "You're in the intro!",
  actionHooks: [nh]
};

let southOfIntroArea: Area = {
  id: "southOfIntro",
  description: _ => "You're in a nice park to the south",
  actionHooks: [nhs, sitOnBenchStarted, sitOnBenchNotStarted, west]
};

let introMarketArea: Area = {
  id: "introMarket",
  description: _ => "You're in a bustling market",
  actionHooks: [talkToIntroGuy, east, swordShop]
};

export let introAreas = [introArea, southOfIntroArea, introMarketArea, swordShopArea]
