import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export enum GamePhase {
  Setup = "Setup",
  Strategy = "Strategy",
  Action = "Action",
  Status = "Status",
  Agenda = "Agenda",
  Victory = "Victory",
}

export const useGameStore = defineStore('game', () => {
  const round = ref(0);
  const phase = ref(GamePhase.Setup);
  const prevPhase = ref(GamePhase.Setup);

  function advancePhase(newPhaseName: string) {
    var newPhase: GamePhase;
    switch(newPhaseName) {
      case "Strategy": newPhase = GamePhase.Strategy; break;
      case "Action": newPhase = GamePhase.Action; break;
      case "Status": newPhase = GamePhase.Status; break;
      case "Agenda": newPhase = GamePhase.Agenda; break;
      case "Victory": newPhase = GamePhase.Victory; break;
      default: throw new Error(`game.advancePhase: Invalid phase name '${newPhaseName}'`);
    }
    
    prevPhase.value = phase.value;
    phase.value = newPhase;

    if (newPhase == GamePhase.Strategy) {
      if (prevPhase.value == GamePhase.Setup || prevPhase.value == GamePhase.Status || prevPhase.value == GamePhase.Agenda) {
        round.value += 1;
      }
    }
  }

  function undoAdvancePhase() {
    const undoFromPhase = phase.value;
    phase.value = prevPhase.value;
    
    if (undoFromPhase == GamePhase.Strategy) {
      round.value -= 1;
    }
  }

  return { round, phase, advancePhase, undoAdvancePhase };
})
