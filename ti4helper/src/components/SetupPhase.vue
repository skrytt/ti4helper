<script setup lang="ts">
import { useGameStore, Faction, StrategyCard } from '@/stores/game';

const game = useGameStore();

defineProps<{
}>()
</script>

<template>
  <h2>Add Players (In Speaker Order)</h2>
  <div class="containerRow">
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
    <ol>
      <li v-for="playerData in game.playerData">
        <p>{{ playerData.name }} / {{ playerData.factionName }}</p>
      </li>
    </ol>
  </div>

  <h2>Game Phase Transition Buttons</h2>
  <button @click="game.advancePhase('Strategy')">Advance -> Strategy Phase</button>
  <hr />

</template>

<style scoped>
.containerRow {
  display: flex;
  width: inherit;
  flex-direction: row;
}
</style>
