<script setup>
import PokemonCard from './components/PokemonCard.vue'
</script>

<template>
  <main class="contenedor">
    <PokemonCard />
  </main>
</template>

<style scoped>
.contenedor {
  min-height: 100vh;
  padding: 40px 20px;
  background: #111827;
}
</style>