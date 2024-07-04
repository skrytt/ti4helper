<script setup lang="ts">
import { useGameStore, Faction, StrategyCard } from '@/stores/game';

const game = useGameStore();

defineProps<{
}>()
</script>

<template>
  <div class="containerMain">
    <div class="containerColumn containerColumnLeft">
      <div class="lowerTextContainer">
        <p>Previous Turn (←)</p>
        <p>Strategy Toggle (S)</p>
        <p>Pass Toggle (P)</p>
        <p>Next Turn (→)</p>
      </div>
    </div>
    <div class="containerColumn containerColumnMid">
      <div class="activePlayerContainer">
        <div class="activePlayerContainerInner">
          <h1>The Hamburglar</h1>
          <h2 class="warfare">Warfare</h2>
        </div>
      </div>
      <div class="upcomingPlayersContainer">
        <div class="upcomingPlayersNamesContainer">
          <span class="upcomingPlayerPad">Ronald</span>
          <span class="upcomingPlayerPad">Grimace</span>
          <span class="upcomingPlayerPad">Birdie</span>
          <span class="upcomingPlayerPad">Sundae</span>
          <span class="upcomingPlayerPad">Mayor McCheese</span>
        </div>
        <div class="upcomingPlayersPassStatusesContainer">
          <span class="upcomingPlayerPad">PASS</span>
          <span class="upcomingPlayerPad">&nbsp;</span>
          <span class="upcomingPlayerPad">&nbsp;</span>
          <span class="upcomingPlayerPad">PASS</span>
          <span class="upcomingPlayerPad">&nbsp;</span>
        </div>
        <div class="upcomingPlayersStrategyCardsContainer">
          <span class="upcomingPlayerPad">Leadership (Spent)</span>
          <span class="upcomingPlayerPad">Construction (Spent)</span>
          <span class="upcomingPlayerPad imperial">Imperial</span>
          <span class="upcomingPlayerPad">Technology (Spent)</span>
          <span class="upcomingPlayerPad diplomacy">Diplomacy</span>
        </div>
      </div>
    </div>
    <div class="containerColumn containerColumnRight">
      <div class="lowerTextContainer">
        <p>Round 1: 36m 25s</p>
        <p>Round 2: 48m 10s</p>
        <p>Round 3: 5m 50s</p>
      </div>
    </div>
  </div>

  <!--
  <h2>Game Phase Transition Buttons</h2>
  <button @click="game.undoAdvancePhase()">Back to Strategy Phase</button>
  <button @click="game.advancePhase('Status')">Advance -> Status Phase</button>
  <button @click="game.advancePhase('Victory')">Advance -> End Game</button>
  <hr />
  -->
</template>

<style scoped>
.containerMain {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  width: inherit;
  height: inherit;
}
.containerColumn {
  padding: 10px;
}
.containerColumnLeft {
  display: flex;
  flex-direction: column-reverse;
  width: 15%;
  height: inherit;
}
.containerColumnMid {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 70%;
  height: inherit;
}
.containerColumnRight {
  display: flex;
  flex-direction: column-reverse;
  width: 15%;
  height: inherit;
  align-items: end;
}
.lowerTextContainer {
  display: flex;
  flex-direction: column;
  padding: 5px;
  white-space: nowrap;
  z-index: 1;
}
.lowerTextContainer p {
  font-size: 18px;
}
.activePlayerContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10vh 5px 10vh 5px;
}
.activePlayerContainerInner {
  display: flex;
  flex-direction: column;
  align-items: left;
}
.activePlayerContainer h1 {
  font-size: 80px;
  line-height: 1.15;
  color: var(--vt-c-white-soft);
  font-weight: 600;
}
.activePlayerContainer h2 {
  font-size: 40px;
  line-height: 1.25;
  font-weight: 700;
}
.upcomingPlayersContainer {
  display: flex;
  flex-direction: row;
  font-size: 20px;
}
.upcomingPlayerPad {
  padding: 5px 0 5px 0;
}
.upcomingPlayersNamesContainer {
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: end;
  padding: 10px 20px 10px 10px;
  color: var(--vt-c-white-soft);
}
.upcomingPlayersPassStatusesContainer {
  background-color: var(--vt-c-white-soft);
  color: var(--vt-c-black-soft);
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  align-items:center;
  padding: 10px;
}
.upcomingPlayersStrategyCardsContainer {
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: start;
  padding: 10px 10px 10px 20px;
}
.upcomingPlayersNamesContainer span {
  font-weight: 600;
}
.upcomingPlayersPassStatusesContainer span {
  font-weight: 700;
}
.upcomingPlayersStrategyCardsContainer span {
  font-weight: 600;
}
</style>
