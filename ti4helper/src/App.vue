<script setup lang="ts">
import SetupPhase from './components/SetupPhase.vue';
import ActionPhase from './components/ActionPhase.vue';
import StrategyPhase from './components/StrategyPhase.vue';
import { useGameStore } from '@/stores/game';

const game = useGameStore();
</script>

<template>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">
  <div class="container">
  <SetupPhase v-if="game.phase == 'Setup'" />
  <StrategyPhase v-if="game.phase == 'Strategy'" />
  <ActionPhase v-if="game.phase == 'Action'" />
  <StatusPhase v-if="game.phase == 'Status'" />
  </div>
</template>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
}
</style>
