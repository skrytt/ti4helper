<script setup lang="ts">
import { useGameStore, Faction, StrategyCard } from '@/stores/game';

const game = useGameStore();

defineProps<{
}>()
</script>

<template>
  <h2>Assign Strategy Cards</h2>
  <div class="containerRow">
    <form id="assignStrategyCardForm" @submit.prevent="onSubmit" @submit="game.assignStrategyCardToPlayer()">
      <div class="containerRow">
        <div>
          <p>Player:</p>
          <ul>
            <li v-for="playerName in game.playerData.map((p) => p.name)">
              <input type="radio" :id="playerName" name="playerName" :value="playerName">
              <label :for="playerName">{{playerName}}</label>
            </li>
          </ul>
        </div>
        <div>
          <p>Card:</p>
          <ul>
            <li v-for="strategyCard in Object.keys(StrategyCard).filter(key => isNaN(Number(key)))">
              <input type="radio" :id="strategyCard" name="strategyCard" :value="strategyCard">
              <label :class="strategyCard.toLowerCase()" :for="strategyCard">{{strategyCard}}</label>
            </li>
          </ul>
      </div>
    </div>
    <input type="submit" value="Assign Strategy Card">
    </form>
    <ol>
      <li v-for="[strategyCard, playerIndex] in game.roundData[game.round-1].strategyAssignment.entries()">
        <p><span :class="StrategyCard[strategyCard].toLowerCase()"> {{ StrategyCard[strategyCard] }}</span> - {{ game.playerData[playerIndex].name }} / {{ game.playerData[playerIndex].factionName }}</p>
      </li>
    </ol>
  </div>

  <h2>Game Phase Transition Buttons</h2>
  <button @click="game.undoAdvancePhase()">Back to Setup Phase</button>
  <button @click="game.advancePhase('Action')">Advance -> Action Phase</button>
  <hr />
</template>

<style scoped>
.containerRow {
  display: flex;
  width: inherit;
  flex-direction: row;
}
</style>
