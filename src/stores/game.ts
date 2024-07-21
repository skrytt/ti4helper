import { ref, reactive, computed, type Reactive } from 'vue'
import { defineStore } from 'pinia'

export enum GamePhase {
  Undefined = '',
  Setup = 'Setup',
  Strategy = 'Strategy',
  Action = 'Action',
  Status = 'Status',
  Agenda = 'Agenda',
  Victory = 'Victory'
}

// This app assumes TI4 + PoK because that's what my group uses :)
export enum Faction {
  'The Arborec' = 0,
  'The Argent Flight',
  'The Barony of Letnev',
  'The Clan of Saar',
  'The Council Keleres',
  'The Embers of Muaat',
  'The Emirates of Hacan',
  'The Empyrean',
  'The Federation of Sol',
  'The Ghosts of Creuss',
  'The L1Z1X Mindnet',
  'The Mahact Gene-Sorcerers',
  'The Mentak Coalition',
  'The Naalu Collective',
  'The Naaz-Rohka Alliance',
  'The Nekro Virus',
  'The Nomad',
  "Sardakk N'orr",
  'The Titans of Ul',
  'The Universities of Jol-Nar',
  "The Vuil'Raith Cabal",
  'The Winnu',
  'The Xxcha Kingdom',
  'The Yin Brotherhood',
  'The Yssaril Tribes'
}

interface IPlayerData {
  name: string
  factionName: string
}

export enum StrategyCard {
  Leadership = 0,
  Diplomacy,
  Politics,
  Construction,
  Trade,
  Warfare,
  Technology,
  Imperial
}

interface IRoundData {
  speakerPlayer: number | null
  strategyAssignment: Map<number, number>
  strategyAssignmentReverse: Map<number, number>
  playerStrategyPopState: Map<number, boolean>
  turnOrder: Array<number>
  playerPassState: Map<number, boolean>
}

export const useGameStore = defineStore('game', () => {
  const phase = ref(GamePhase.Setup)
  const prevPhase = ref(GamePhase.Undefined)

  const playerData: Reactive<IPlayerData[]> = reactive([])
  const roundData: Reactive<IRoundData[]> = reactive([])

  const players = computed(() => playerData.length)
  const round = computed(() => roundData.length)

  // TODO set to 0 on transition Strategy -> Action Phase
  // TODO implement function to advance to next turn
  // TODO implement function to return to previous turn
  const turnOrderIndex = ref(0)

  function addRound() {
    roundData.push({
      speakerPlayer: roundData.length > 0 ? roundData[roundData.length - 1].speakerPlayer : null,
      strategyAssignment: new Map(),
      strategyAssignmentReverse: new Map(),
      playerStrategyPopState: new Map(),
      turnOrder: new Array(),
      playerPassState: new Map()
    })
  }

  function removeRound() {
    roundData.pop()
  }

  function assignStrategyCardPick() {
    console.log('In assignStrategyCardToPlayer')
    const assignStrategyCardForm = document.getElementById('assignStrategyCardForm')
    if (assignStrategyCardForm === null) {
      return
    }

    // Get strategy card from radio button inputs
    const strategyCardInput = assignStrategyCardForm.querySelector(
      'input[name="strategyCard"]:checked'
    ) as HTMLInputElement | null
    if (strategyCardInput === null) {
      return
    }
    const strategyCardName = strategyCardInput.value

    // Get player from radio button inputs
    const playerNameInput = assignStrategyCardForm.querySelector(
      'input[name="playerName"]:checked'
    ) as HTMLInputElement | null
    if (playerNameInput === null) {
      return
    }
    const playerName = playerNameInput.value
    const playerIndex = playerData.findIndex((p) => p.name == playerName)
    if (playerIndex == -1)
      throw new Error(
        `assignStrategyCardToPlayer: Couldn't find player '${playerName}' in playerData`
      )

    var strategyCard = -1
    const strategyCardEnumNames = Object.keys(StrategyCard).filter((v) => isNaN(Number(v)))
    strategyCardEnumNames.forEach((key, index) => {
      if (key == strategyCardName) {
        strategyCard = index
      }
    })
    if (strategyCard == -1) {
      throw new Error('assignStrategyCardToPlayer - unknown strategy card name')
    }

    const roundIndex = roundData.length - 1

    // Fail if player or strategy card already chosen (note: this doesnt work properly for games with multiple card picks per person right now)
    if (roundData[roundIndex].strategyAssignment.get(strategyCard) !== undefined) {
      console.log('assignStrategyCardToPlayer: Strategy card already chosen')
      return
    }
    if (roundData[roundIndex].strategyAssignmentReverse.get(playerIndex) !== undefined) {
      console.log('assignStrategyCardToPlayer: Player has already chosen a strategy card')
      return
    }

    roundData[roundIndex].strategyAssignment.set(strategyCard, playerIndex)
    roundData[roundIndex].strategyAssignmentReverse.set(playerIndex, strategyCard)
    roundData[roundIndex].playerStrategyPopState.set(playerIndex, false)
    roundData[roundIndex].playerPassState.set(playerIndex, false)
  }

  function removeStrategyCardPick(strategyCard: number) {
    console.log('In removeStrategyCardPick')

    const roundIndex = roundData.length - 1
    const playerIndex = roundData[roundIndex].strategyAssignment.get(strategyCard) as number
    roundData[roundIndex].strategyAssignment.delete(strategyCard)
    roundData[roundIndex].strategyAssignmentReverse.delete(playerIndex)
  }

  function assignNewSpeaker(playerIndex: number) {
    const roundIndex = roundData.length - 1
    roundData[roundIndex].speakerPlayer = playerIndex
  }

  function setTurnOrder() {
    const roundIndex = roundData.length - 1
    const turnOrder: number[] = []

    const strategyCardEnumNames = Object.keys(StrategyCard).filter((v) => isNaN(Number(v)))
    strategyCardEnumNames.forEach((key, index) => {
      const playerIndex: number | undefined = roundData[roundIndex].strategyAssignment.get(index)
      if (playerIndex != undefined) {
        turnOrder.push(playerIndex)
      }
    })

    roundData[roundIndex].turnOrder = turnOrder
  }

  function advancePhase(newPhaseName: string) {
    var newPhase: GamePhase
    switch (newPhaseName) {
      case GamePhase.Strategy:
        newPhase = GamePhase.Strategy
        break
      case GamePhase.Action:
        newPhase = GamePhase.Action
        setTurnOrder()
        // Ensure we start with first player in turn order
        turnOrderIndex.value = 0
        break
      case GamePhase.Status:
        newPhase = GamePhase.Status
        break
      case GamePhase.Agenda:
        newPhase = GamePhase.Agenda
        break
      case GamePhase.Victory:
        newPhase = GamePhase.Victory
        break
      default:
        throw new Error(`game.advancePhase: Invalid phase name '${newPhaseName}'`)
    }

    prevPhase.value = phase.value
    phase.value = newPhase

    if (newPhase == GamePhase.Strategy) {
      if (
        prevPhase.value == GamePhase.Setup ||
        prevPhase.value == GamePhase.Status ||
        prevPhase.value == GamePhase.Agenda
      ) {
        addRound()
      }
    }
  }

  function undoAdvancePhase() {
    if (prevPhase.value == GamePhase.Undefined) {
      return
    }

    const undoFromPhase = phase.value

    phase.value = prevPhase.value
    prevPhase.value = GamePhase.Undefined

    if (undoFromPhase == GamePhase.Strategy) {
      removeRound()
    }
  }

  function addPlayer() {
    console.log('In addPlayer')
    const addPlayerForm = document.getElementById('addPlayerForm')
    if (addPlayerForm === null) {
      return
    }

    // Get player name from text input
    const playerNameInput = addPlayerForm.querySelector(
      'input[name="playerName"]'
    ) as HTMLInputElement | null
    if (playerNameInput === null) {
      return
    }
    const playerName = playerNameInput.value
    if (playerName.length == 0) {
      return
    }

    // Get faction name from radio button inputs
    const factionNameInput = addPlayerForm.querySelector(
      'input[name="factionName"]:checked'
    ) as HTMLInputElement | null
    if (factionNameInput === null) {
      return
    }
    const factionName = factionNameInput.value

    // Fail if the player name or faction name is already in the list
    if (playerData.find((p) => p.name == playerName) !== undefined) {
      console.log('addPlayer: Player already in list')
      return
    }
    // Fail if the player name or faction name is already in the list
    if (playerData.find((p) => p.factionName == factionName) !== undefined) {
      console.log('addPlayer: Faction already selected by another player')
      return
    }

    playerData.push({
      name: playerName,
      factionName
    })
  }

  function removePlayer(playerIndex: number) {
    playerData.splice(playerIndex, 1)
  }

  function advanceTurn() {
    turnOrderIndex.value = (turnOrderIndex.value + 1) % players.value
  }

  function previousTurn() {
    turnOrderIndex.value =
      (((turnOrderIndex.value - 1) % players.value) + players.value) % players.value
  }

  function toggleStrategyPopped() {
    const roundIndex = roundData.length - 1

    // Don't allow a strategy toggle if the player has passed
    const currentPassState: boolean = roundData[roundIndex].playerPassState.get(
      roundData[roundIndex].turnOrder[turnOrderIndex.value]
    ) as boolean
    if (currentPassState) return

    const currentStrategyPoppedState: boolean = roundData[roundIndex].playerStrategyPopState.get(
      roundData[roundIndex].turnOrder[turnOrderIndex.value]
    ) as boolean
    roundData[roundIndex].playerStrategyPopState.set(
      roundData[roundIndex].turnOrder[turnOrderIndex.value],
      !currentStrategyPoppedState
    )
  }

  function togglePass() {
    const roundIndex = roundData.length - 1

    // Don't allow a pass if the strategy card held by the player hasn't been spent
    const currentStrategyPoppedState: boolean = roundData[roundIndex].playerStrategyPopState.get(
      roundData[roundIndex].turnOrder[turnOrderIndex.value]
    ) as boolean
    if (!currentStrategyPoppedState) return

    const currentPassState: boolean = roundData[roundIndex].playerPassState.get(
      roundData[roundIndex].turnOrder[turnOrderIndex.value]
    ) as boolean
    roundData[roundIndex].playerPassState.set(
      roundData[roundIndex].turnOrder[turnOrderIndex.value],
      !currentPassState
    )
  }

  return {
    round,
    phase,
    players,
    playerData,
    roundData,
    turnOrderIndex,
    advancePhase,
    undoAdvancePhase,
    addPlayer,
    removePlayer,
    assignStrategyCardPick,
    removeStrategyCardPick,
    assignNewSpeaker,
    advanceTurn,
    previousTurn,
    toggleStrategyPopped,
    togglePass
  }
})
