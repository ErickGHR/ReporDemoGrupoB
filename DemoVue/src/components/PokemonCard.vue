<script setup>
import { ref, computed, onMounted } from 'vue'

const pokemones = ref([])
const pokemonSeleccionado = ref(null)
const busqueda = ref('')
const cargando = ref(false)
const error = ref('')

const pokemonesFiltrados = computed(() => {
  const texto = busqueda.value.toLowerCase().trim()

  if (texto === '') {
    return pokemones.value
  }

  return pokemones.value.filter(pokemon =>
    pokemon.name.toLowerCase().includes(texto) ||
    String(pokemon.id).includes(texto)
  )
})

function formatearNombre(nombre) {
  return nombre
    .replace('-', ' ')
    .replace(/\b\w/g, letra => letra.toUpperCase())
}

function formatearNumero(numero) {
  return String(numero).padStart(3, '0')
}

function seleccionarPokemon(pokemon) {
  pokemonSeleccionado.value = pokemon
}

async function obtenerPokemones() {
  cargando.value = true
  error.value = ''

  try {
    const respuesta = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151')

    if (!respuesta.ok) {
      throw new Error('No se pudo obtener la lista de Pokémon')
    }

    const datos = await respuesta.json()

    const detalles = await Promise.all(
      datos.results.map(async (pokemon) => {
        const respuestaDetalle = await fetch(pokemon.url)

        if (!respuestaDetalle.ok) {
          throw new Error('No se pudo obtener el detalle del Pokémon')
        }

        const datosDetalle = await respuestaDetalle.json()

        return {
          id: datosDetalle.id,
          name: datosDetalle.name,
          image:
            datosDetalle.sprites.other['official-artwork'].front_default ||
            datosDetalle.sprites.front_default,
          types: datosDetalle.types.map(tipo => tipo.type.name),
          height: datosDetalle.height / 10,
          weight: datosDetalle.weight / 10,
          experience: datosDetalle.base_experience
        }
      })
    )

    pokemones.value = detalles.sort((a, b) => a.id - b.id)
    pokemonSeleccionado.value = pokemones.value[24]
  } catch (err) {
    error.value = 'Error al cargar los Pokémon desde la API'
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  obtenerPokemones()
})
</script>

<template>
  <section class="pagina-pokemon">
    <header class="encabezado">
      <h1>Pokédex Vue</h1>
      <p>Pokémon de la primera generación usando la API de Pokémon.</p>
    </header>

    <p v-if="cargando" class="estado">
      Cargando Pokémon...
    </p>

    <p v-if="error" class="error">
      {{ error }}
    </p>

    <template v-if="!cargando && !error">
      <section v-if="pokemonSeleccionado" class="card-principal">
        <span class="numero">
          #{{ formatearNumero(pokemonSeleccionado.id) }}
        </span>

        <img
          :src="pokemonSeleccionado.image"
          :alt="pokemonSeleccionado.name"
          class="imagen-principal"
        />

        <h2>{{ formatearNombre(pokemonSeleccionado.name) }}</h2>

        <div class="tipos">
          <span
            v-for="tipo in pokemonSeleccionado.types"
            :key="tipo"
          >
            {{ formatearNombre(tipo) }}
          </span>
        </div>

        <div class="datos-principales">
          <div>
            <strong>{{ pokemonSeleccionado.height }} m</strong>
            <small>Altura</small>
          </div>

          <div>
            <strong>{{ pokemonSeleccionado.weight }} kg</strong>
            <small>Peso</small>
          </div>

          <div>
            <strong>{{ pokemonSeleccionado.experience }}</strong>
            <small>Experiencia</small>
          </div>
        </div>
      </section>

      <section class="pokedex">
        <div class="barra-busqueda">
          <h2>Primera generación</h2>

          <input
            v-model="busqueda"
            type="text"
            placeholder="Buscar por nombre o número"
          />
        </div>

        <div class="grid-pokemon">
          <article
            v-for="pokemon in pokemonesFiltrados"
            :key="pokemon.id"
            class="card-pokemon"
            @click="seleccionarPokemon(pokemon)"
          >
            <span class="numero">
              #{{ formatearNumero(pokemon.id) }}
            </span>

            <img
              :src="pokemon.image"
              :alt="pokemon.name"
            />

            <h3>{{ formatearNombre(pokemon.name) }}</h3>

            <div class="tipos">
              <span
                v-for="tipo in pokemon.types"
                :key="tipo"
              >
                {{ formatearNombre(tipo) }}
              </span>
            </div>

            <div class="datos">
              <p>
                <strong>{{ pokemon.height }} m</strong>
                <small>Altura</small>
              </p>

              <p>
                <strong>{{ pokemon.weight }} kg</strong>
                <small>Peso</small>
              </p>
            </div>
          </article>
        </div>
      </section>
    </template>
  </section>
</template>

<style scoped>
.pagina-pokemon {
  width: 100%;
  max-width: 1200px;
  font-family: Arial, sans-serif;
}

.encabezado {
  margin-bottom: 30px;
  text-align: center;
  color: white;
}

.encabezado h1 {
  margin: 0;
  font-size: 42px;
}

.encabezado p {
  color: #d1d5db;
}

.card-principal {
  width: 430px;
  margin: 0 auto 36px;
  padding: 28px;
  border-radius: 22px;
  background: white;
  text-align: center;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.25);
}

.numero {
  display: block;
  margin-bottom: 10px;
  color: #6b7280;
  font-weight: bold;
}

.imagen-principal {
  width: 210px;
  height: 210px;
  object-fit: contain;
}

.card-principal h2 {
  margin: 12px 0;
  font-size: 34px;
  color: #111827;
}

.tipos {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0 20px;
}

.tipos span {
  padding: 7px 12px;
  border-radius: 20px;
  background: #fee2e2;
  color: #991b1b;
  font-size: 13px;
  font-weight: bold;
}

.datos-principales {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 11px;
}

.datos-principales div {
  padding: 12px;
  border-radius: 12px;
  background: #f3f4f6;
}

.datos-principales strong,
.datos strong {
  display: block;
  color: #111827;
}

.datos-principales small,
.datos small {
  color: #6b7280;
}

.pokedex {
  padding: 28px;
  border-radius: 22px;
  background: white;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.25);
}

.barra-busqueda {
  margin-bottom: 24px;
  text-align: center;
}

.barra-busqueda h2 {
  margin: 0 0 16px;
  color: #111827;
  font-size: 30px;
}

input {
  width: 100%;
  max-width: 430px;
  padding: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  outline: none;
  font-size: 15px;
}

input:focus {
  border-color: #ef4444;
}

.grid-pokemon {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 18px;
}

.card-pokemon {
  padding: 18px;
  border-radius: 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card-pokemon:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.14);
}

.card-pokemon img {
  width: 120px;
  height: 120px;
  object-fit: contain;
}

.card-pokemon h3 {
  margin: 10px 0;
  color: #111827;
  font-size: 20px;
}

.datos {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.datos p {
  margin: 0;
  padding: 8px;
  min-width: 70px;
  border-radius: 10px;
  background: white;
}

.estado {
  text-align: center;
  color: white;
  font-weight: bold;
}

.error {
  text-align: center;
  color: #fecaca;
  font-weight: bold;
}

@media (max-width: 520px) {
  .card-principal {
    width: 100%;
  }

  .datos-principales {
    grid-template-columns: 1fr;
  }
}
</style>