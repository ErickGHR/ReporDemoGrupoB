<script setup>
import { ref } from 'vue'

const contador = ref(0)

function incrementar() {
  contador.value++
}

function decrementar() {
  contador.value--
}
</script>

<template>
  <section class="contador">
    <h2>Contador</h2>

    <p class="valor">{{ contador }}</p>

    <div class="botones">
      <button @click="decrementar">Decrementar</button>
      <button @click="incrementar">Incrementar</button>
    </div>
  </section>
</template>

<style scoped>
.contador {
  width: 360px;
  padding: 28px;
  border-radius: 16px;
  background: white;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
  font-family: Arial, sans-serif;
}

h2 {
  margin: 0 0 18px;
  color: #111827;
}

.valor {
  margin: 0 0 22px;
  font-size: 48px;
  font-weight: bold;
  color: #2563eb;
}

.botones {
  display: flex;
  justify-content: center;
  gap: 12px;
}

button {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: white;
  cursor: pointer;
  font-size: 15px;
}

button:hover {
  background: #1d4ed8;
}
</style>