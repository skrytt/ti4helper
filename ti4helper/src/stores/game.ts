import { ref, reactive, computed, type Reactive } from 'vue'
import { defineStore } from 'pinia'

export enum GamePhase {
  Undefined = "",
  Setup = "Setup",
  Strategy = "Strategy",
  Action = "Action",
  Status = "Status",
  Agenda = "Agenda",
  Victory = "Victory",
}

// This app assumes TI4 + PoK because that's what my group uses :)
export enum Faction {
  "The Arborec" = 1,
  "The Barony of Letnev",
  "The Clan of Saar",
  "The Embers of Muaat",
  "The Emirates of Hacan",
  "The Federation of Sol",
  "The Ghosts of Creuss",
  "The L1Z1X Mindnet",
  "The Mentak Coalition",
  "The Naalu Collective",
  "The Nekro Virus",
  "Sardakk N'orr",
  "The Universities of Jol-Nar",
  "The Winnu",
  "The Xxcha Kingdom",
  "The Yssaril Tribes",
  "The Argent Flight",
  "The Empyrean",
  "The Mahact Gene-Sorcerers",
  "The Naaz-Rohk Alliance",
  "The Nomad",
  "The Titans of Ul",
  "The Vuil'Raith Cabal",
}

interface IPlayerData {
  name: string;
  factionName: string;
}

export enum StrategyCard {
  Leadership = "Leadership",
  Diplomacy = "Diplomacy",
  Politics = "Politics",
  Construction = "Construction",
  Trade = "Trade",
  Warfare = "Warfare",
  Technology = "Technology",
  Imperial = "Imperial",
}

enum StrategyPopState {
  Unspent = 1,
  Active,
  Spent,
}

interface IRoundData {
  speakerPlayer: number | null;
  strategyAssignment: Map<StrategyCard, number>;
  strategyPopState: Map<StrategyCard, StrategyPopState>;
  turnOrder: Array<number> | null;
}

export const useGameStore = defineStore('game', () => {
  const phase = ref(GamePhase.Setup);
  const prevPhase = ref(GamePhase.Undefined);

  const playerData: Reactive<IPlayerData[]> = reactive([]);
  const roundData: Reactive<IRoundData[]> = reactive([]);

  // TODO set on transition Strategy -> Action Phase based on computed turn order
  const currentTurnPlayer = ref(-1);

  const players = computed(() => playerData.length);
  const round = computed(() => roundData.length);


  function addRound() {
    roundData.push({
      speakerPlayer: roundData.length > 0 ? roundData[roundData.length-1].speakerPlayer : null,
      strategyAssignment: new Map(),
      strategyPopState: new Map(),
      turnOrder: null,
    })
  }

  function removeRound() {
    roundData.pop();
  }

  function assignStrategyCardToPlayer() {
    console.log("In assignStrategyCardToPlayer");
    const assignStrategyCardForm = document.getElementById("assignStrategyCardForm");
    if (assignStrategyCardForm === null) { return; }

    // Get strategy card from radio button inputs
    const strategyCardInput = assignStrategyCardForm.querySelector('input[name="strategyCard"]:checked') as HTMLInputElement | null;;
    if (strategyCardInput === null) { return; }
    const strategyCardName = strategyCardInput.value;

    // Get player from radio button inputs
    const playerNameInput = assignStrategyCardForm.querySelector('input[name="playerName"]:checked') as HTMLInputElement | null;;
    if (playerNameInput === null) { return; }
    const playerName = playerNameInput.value;
    const playerIndex = playerData.findIndex((p) => p.name == playerName);
    if (playerIndex == -1) throw new Error(`assignStrategyCardToPlayer: Couldn't find player '${playerName}' in playerData`);

    var strategyCard: StrategyCard;
    switch(strategyCardName) {
      case StrategyCard.Leadership: strategyCard = StrategyCard.Leadership; break;
      case StrategyCard.Diplomacy: strategyCard = StrategyCard.Diplomacy; break;
      case StrategyCard.Politics: strategyCard = StrategyCard.Politics; break;
      case StrategyCard.Construction: strategyCard = StrategyCard.Construction; break;
      case StrategyCard.Trade: strategyCard = StrategyCard.Trade; break;
      case StrategyCard.Warfare: strategyCard = StrategyCard.Warfare; break;
      case StrategyCard.Technology: strategyCard = StrategyCard.Technology; break;
      case StrategyCard.Imperial: strategyCard = StrategyCard.Imperial; break;
      default: throw new Error(`game.assignStrategyCardToPlayer: Invalid strategy card name '${strategyCardName}'`);
    };
    
    const round = roundData.length;
    if (round <= 0) {
      throw new Error(`assignStrategyCardToPlayer: Round is 0 - can't assign strategy cards in Setup phase`);
    }
    roundData[round-1].strategyAssignment.set(strategyCard, playerIndex);
    roundData[round-1].strategyPopState.set(strategyCard, StrategyPopState.Unspent);
  }

  function assignNewSpeaker(playerIndex: number) {
    roundData[roundData.length-1].speakerPlayer = playerIndex;
  }

  function advancePhase(newPhaseName: string) {
    var newPhase: GamePhase;
    switch(newPhaseName) {
      case GamePhase.Strategy: newPhase = GamePhase.Strategy; break;
      case GamePhase.Action: newPhase = GamePhase.Action; break;
      case GamePhase.Status: newPhase = GamePhase.Status; break;
      case GamePhase.Agenda: newPhase = GamePhase.Agenda; break;
      case GamePhase.Victory: newPhase = GamePhase.Victory; break;
      default: throw new Error(`game.advancePhase: Invalid phase name '${newPhaseName}'`);
    }

    prevPhase.value = phase.value;
    phase.value = newPhase;

    if (newPhase == GamePhase.Strategy) {
      if (prevPhase.value == GamePhase.Setup || prevPhase.value == GamePhase.Status || prevPhase.value == GamePhase.Agenda) {
        addRound();
      }
    }
  }

  function undoAdvancePhase() {
    if (prevPhase.value == GamePhase.Undefined) {
      return;
    }

    const undoFromPhase = phase.value;

    phase.value = prevPhase.value;
    prevPhase.value = GamePhase.Undefined;

    if (undoFromPhase == GamePhase.Strategy) {
      removeRound();
    }
  }

  function addPlayer() {
    console.log("In addPlayer");
    const addPlayerForm = document.getElementById("addPlayerForm");
    if (addPlayerForm === null) { return; }

    // Get player name from text input
    const playerNameInput = addPlayerForm.querySelector('input[name="playerName"]') as HTMLInputElement | null;
    if (playerNameInput === null) { return; }
    const playerName = playerNameInput.value;
    if (playerName.length == 0) { return; }

    // Get faction name from radio button inputs
    const factionNameInput = addPlayerForm.querySelector('input[name="factionName"]:checked') as HTMLInputElement | null;;
    if (factionNameInput === null) { return; }
    const factionName = factionNameInput.value;

    playerData.push({
      name: playerName,
      factionName,
    })
  }

  function removePlayer(playerIndex: number) {
    playerData.splice(playerIndex, 1);
  }

  return { round, phase, players, playerData, roundData, 
    advancePhase, undoAdvancePhase, addPlayer, removePlayer, assignStrategyCardToPlayer, assignNewSpeaker};
})
