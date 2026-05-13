<script setup>
import { ref } from 'vue'

const nombre = ref('')
const correo = ref('')
</script>

<template>
  <section class="tarjeta">
    <h2>Datos del usuario</h2>

    <div class="campo">
      <label>Nombre</label>
      <input
        v-model="nombre"
        type="text"
        placeholder="Escribe tu nombre"
      />
    </div>

    <div class="campo">
      <label>Correo electrónico</label>
      <input
        v-model="correo"
        type="email"
        placeholder="Escribe tu correo"
      />
    </div>

    <div class="resultado">
      <h3>Información capturada</h3>

      <p>
        <strong>Nombre:</strong>
        {{ nombre || 'Aún no se ha escrito un nombre' }}
      </p>

      <p>
        <strong>Correo:</strong>
        {{ correo || 'Aún no se ha escrito un correo' }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.tarjeta {
  width: 420px;
  padding: 28px;
  border-radius: 16px;
  background: white;
  font-family: Arial, sans-serif;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
}

h2 {
  margin: 0 0 22px;
  color: #111827;
  text-align: center;
}

.campo {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 6px;
  color: #374151;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 11px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  outline: none;
  font-size: 15px;
}

input:focus {
  border-color: #2563eb;
}

.resultado {
  margin-top: 24px;
  padding: 16px;
  border-radius: 10px;
  background: #f3f4f6;
}

.resultado h3 {
  margin: 0 0 12px;
  color: #111827;
}

.resultado p {
  margin: 8px 0;
  color: #374151;
}
</style>