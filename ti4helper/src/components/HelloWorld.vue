<script setup lang="ts">
import { useGameStore } from '@/stores/game';

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

    <button>Previous Phase</button>
    <button @click="game.advancePhase('Strategy')">Advance -> Strategy Phase</button>
    <button @click="game.advancePhase('Action')">Advance -> Action Phase</button>
    <button @click="game.advancePhase('Status')">Advance -> Status Phase</button>
    <button @click="game.advancePhase('Agenda')">Advance -> Agenda Phase</button>
    <button @click="game.advancePhase('Victory')">Advance -> End Game</button>

    <br /><br />
    <span class="leadership">Leadership</span><br />
    <span class="diplomacy">Diplomacy</span><br />
    <span class="politics">Politics</span><br />
    <span class="construction">Construction</span><br />
    <span class="trade">Trade</span><br />
    <span class="warfare">Warfare</span><br />
    <span class="technology">Technology</span><br />
    <span class="imperial">Imperial</span><br />
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
