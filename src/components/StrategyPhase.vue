<script setup lang="ts">
import { useGameStore, Faction, StrategyCard } from '@/stores/game';
import { computed } from 'vue';

const game = useGameStore();

const allSelectionsMade = computed(() => game.roundData[game.roundData.length-1].strategyAssignment.size == game.players);

defineProps<{
}>()
</script>

<template>
  <h2>Assign Strategy Cards</h2>
  <div class="containerRow">
    <form id="assignStrategyCardForm" @submit.prevent="onSubmit" @submit="game.assignStrategyCardPick()">
      <div class="containerRow">
        <div>
          <p>Player:</p>
            <div v-for="playerName in game.playerData.map((p) => p.name)">
              <input type="radio" :id="playerName" name="playerName" :value="playerName">
              <label :for="playerName">{{playerName}}</label>
            </div>
        </div>
        <div>
          <p>Card:</p>
            <div v-for="strategyCard in Object.keys(StrategyCard).filter(key => isNaN(Number(key)))">
              <input type="radio" :id="strategyCard" name="strategyCard" :value="strategyCard">
              <label :class="strategyCard.toLowerCase()" :for="strategyCard">{{strategyCard}}</label>
            </div>
      </div>
    </div>
    <input type="submit" value="Assign Strategy Card">
    </form>
    <ul>
      <li v-for="[strategyCard, playerIndex] in game.roundData[game.round-1].strategyAssignment.entries()">
        <span>
          <button @click="game.removeStrategyCardPick(strategyCard)">Remove</button>
          &nbsp;
          <span :class="StrategyCard[strategyCard].toLowerCase()"> {{ StrategyCard[strategyCard] }}</span> - {{ game.playerData[playerIndex].name }} / {{ game.playerData[playerIndex].factionName }}
        </span>
      </li>
    </ul>
  </div>

  <h2>Game Phase Transition Buttons</h2>
  <button @click="game.undoAdvancePhase()">Back to Setup Phase</button>
  <button :disabled="!allSelectionsMade" @click="game.advancePhase('Action')">Advance -> Action Phase</button>
</template>

<style scoped>
.containerRow {
  display: flex;
  width: inherit;
  flex-direction: row;
}
</style>
