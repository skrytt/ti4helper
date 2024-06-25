<script setup lang="ts">
import { useGameStore, Faction, StrategyCard } from '@/stores/game';

const game = useGameStore();

defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="greetings">
  <h1 class="green">{{ msg }}</h1>

    <p>Current Phase: {{ game.phase }}</p>
    <p>Current Round: {{ game.round }}</p>
    <p>Player Count: {{ game.players }}</p>
    <p>Player Data: {{ game.playerData }}</p>
    <p>Round Data: {{ game.roundData }}</p>
    <hr />

    <h2>[GENERAL] Game Phase Transition Buttons</h2>
    <button @click="game.undoAdvancePhase()">Previous Phase</button>
    <button @click="game.advancePhase('Strategy')">Advance -> Strategy Phase</button>
    <button @click="game.advancePhase('Action')">Advance -> Action Phase</button>
    <button @click="game.advancePhase('Status')">Advance -> Status Phase</button>
    <button @click="game.advancePhase('Agenda')">Advance -> Agenda Phase</button>
    <button @click="game.advancePhase('Victory')">Advance -> End Game</button>

    <hr />
    <h2>[SETUP] Add Player Form</h2>
    <form id="addPlayerForm" @submit.prevent="onSubmit" @submit="game.addPlayer()">
      <label for="playerName">Player Name:</label><br />
      <input type="text" id="playerName" name="playerName"><br />
      <p>Faction:</p>
      <ul>
        <li v-for="factionName in Object.keys(Faction).filter(key => isNaN(Number(key)))">
          <input type="radio" :id="factionName" name="factionName" :value="factionName">
          <label :for="factionName">{{factionName}}</label>
        </li>
      </ul>
      <input type="submit" value="Add Player">
    </form>

    <h2>[STRATEGY] Assign Strategy Cards Form</h2>
    <form id="assignStrategyCardForm" @submit.prevent="onSubmit" @submit="game.assignStrategyCardToPlayer()">
      <p>Player:</p>
      <ul>
        <li v-for="playerName in game.playerData.map((p) => p.name)">
          <input type="radio" :id="playerName" name="playerName" :value="playerName">
          <label :for="playerName">{{playerName}}</label>
        </li>
      </ul>
      <p>Card:</p>
      <ul>
        <li v-for="strategyCard in Object.keys(StrategyCard).filter(key => isNaN(Number(key)))">
          <input type="radio" :id="strategyCard" name="strategyCard" :value="strategyCard">
          <label :for="strategyCard">{{strategyCard}}</label>
        </li>
      </ul>
      <input type="submit" value="Assign Strategy Card">
    </form>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}
</style>
