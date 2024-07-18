<script setup lang="ts">
import { useGameStore, Faction, StrategyCard } from '@/stores/game';
import { computed, onMounted, onUnmounted } from 'vue';

const game = useGameStore();

function handleKeyDown(e: KeyboardEvent) {
  switch(e.key) {
    case "ArrowRight":
      console.log("Advance turn");
      game.advanceTurn();
      break;
    case "ArrowLeft":
      console.log("Back a turn");
      game.previousTurn();
      break;
    case "s":
      console.log("Strategy toggle");
      game.toggleStrategyPopped();
      break;
    case "p":
      console.log("Pass toggle");
      game.togglePass();
      break;
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

const currentPlayerIndex = computed(() => game.roundData[game.roundData.length-1].turnOrder[game.turnOrderIndex]);
const currentPlayerData = computed(() => (currentPlayerIndex.value !== null) ? game.playerData[currentPlayerIndex.value] : null);
const currentPlayerName = computed(() => (currentPlayerData.value !== null) ? currentPlayerData.value.name : null);
const currentPlayerFactionName = computed(() => (currentPlayerData.value !== null) ? currentPlayerData.value.factionName : null);
const currentPlayerStrategyCard = computed(() => (currentPlayerIndex.value !== null) ? StrategyCard[game.roundData[game.roundData.length-1].strategyAssignmentReverse.get(currentPlayerIndex.value) as number] : 0);
const currentPlayerStrategyCardPopState = computed(() => (currentPlayerIndex.value !== null) ? game.roundData[game.roundData.length-1].playerStrategyPopState.get(currentPlayerIndex.value) as boolean : 0);
const currentPlayerPassState = computed(() => (currentPlayerIndex.value !== null) ? game.roundData[game.roundData.length-1].playerPassState.get(currentPlayerIndex.value) as boolean : 0);

const nextPlayerTurnOrderIndices = computed(() => Array.from(Array(game.players-1).keys()).map((i) => (i+game.turnOrderIndex+1) % game.players));
const nextPlayerIndices = computed(() => nextPlayerTurnOrderIndices.value.map((i) => game.roundData[game.roundData.length-1].turnOrder[i]));
const nextPlayerData = computed(() => nextPlayerIndices.value.map((i) => game.playerData[i]));
const nextPlayerNames = computed(() => nextPlayerData.value.map((p) => p.name));
const nextPlayerStrategyCards = computed(() => nextPlayerIndices.value.map((i) => StrategyCard[game.roundData[game.roundData.length-1].strategyAssignmentReverse.get(i) as number]));
const nextPlayerStrategyCardPopStates = computed(() => nextPlayerIndices.value.map((i) => game.roundData[game.roundData.length-1].playerStrategyPopState.get(i) as boolean));
const nextPlayerPassStates = computed(() => nextPlayerIndices.value.map((i) => game.roundData[game.roundData.length-1].playerPassState.get(i) as boolean));

defineProps<{
}>();
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
          <h1>{{ currentPlayerName }} / {{ currentPlayerFactionName }}</h1>
          <h2 v-if="currentPlayerPassState">
            Passed
          </h2>
          <h2 v-else-if="currentPlayerStrategyCardPopState">
            {{ currentPlayerStrategyCard }}&nbsp;(Spent)
          </h2>
          <h2 v-else :class="currentPlayerStrategyCard.toLowerCase()">
            {{ currentPlayerStrategyCard }}
          </h2>
        </div>
      </div>
      <div class="upcomingPlayersContainer">
        <div class="upcomingPlayersNamesContainer">
          <span v-for="name in nextPlayerNames" class="upcomingPlayerPad">{{ name }}</span>
        </div>
        <div class="upcomingPlayersPassStatusesContainer">
          <span v-for="passState in nextPlayerPassStates" class="upcomingPlayerPad">
            <span v-if="passState">PASS</span>
            <span v-else>&nbsp;</span>
          </span>
        </div>
        <div class="upcomingPlayersStrategyCardsContainer">
          <span v-for="(strategyCard, index) in nextPlayerStrategyCards" class="upcomingPlayerPad">
            <span v-if="nextPlayerStrategyCardPopStates[index]">{{ strategyCard }}&nbsp;(Spent)</span>
            <span v-else>{{ strategyCard }}</span>
          </span>
        </div>
      </div>
    </div>
    <div class="containerColumn containerColumnRight">
      <div class="lowerTextContainer">
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
  white-space: nowrap;
}
.upcomingPlayersPassStatusesContainer {
  background-color: var(--vt-c-white-soft);
  color: var(--vt-c-black-soft);
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  align-items:center;
  padding: 10px;
  min-width: 75px;
}
.upcomingPlayersStrategyCardsContainer {
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: start;
  padding: 10px 10px 10px 20px;
  white-space: nowrap;
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
