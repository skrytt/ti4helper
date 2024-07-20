<script setup lang="ts">
import { useGameStore, Faction, StrategyCard } from '@/stores/game';
import { ref } from 'vue';

const game = useGameStore();

defineProps<{
}>()

</script>

<template>
  <h2>Status Phase</h2>

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
