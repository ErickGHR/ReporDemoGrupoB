<template>
  <main class="app">
    <aside class="sidebar">
      <h1>AsisteProf</h1>
      <p class="subtitle">Pase de lista local</p>

      <section class="box dark-box">
        <h2>Nuevo grupo</h2>
        <input v-model="newGroup" placeholder="Ej. 3A Programación" />
        <button @click="createGroup">Crear grupo</button>
      </section>

      <section class="groups">
        <button
          v-for="group in groups"
          :key="group.id"
          :class="{ active: selectedGroup?.id === group.id }"
          @click="selectGroup(group)"
        >
          {{ group.name }}
        </button>
      </section>
    </aside>

    <section class="content">
      <div v-if="!selectedGroup" class="empty">
        Selecciona o crea un grupo para comenzar.
      </div>

      <template v-else>
        <header class="header">
          <div>
            <h2>{{ selectedGroup.name }}</h2>
            <p>Registro de asistencias por fecha</p>
          </div>

          <input v-model="date" type="date" @change="loadAttendance" />
        </header>

        <nav class="tabs">
          <button
            :class="{ tabActive: view === 'attendance' }"
            @click="view = 'attendance'"
          >
            Pase de lista
          </button>

          <button
            :class="{ tabActive: view === 'dashboard' }"
            @click="openDashboard"
          >
            Dashboard
          </button>
        </nav>

        <section v-if="view === 'attendance'">
          <div class="box">
            <h3>Agregar estudiante</h3>

            <div class="row">
              <input v-model="newStudent" placeholder="Nombre del estudiante" />
              <button @click="addStudent">Agregar</button>
            </div>
          </div>

          <div class="attendance-list">
            <article
              v-for="student in attendance"
              :key="student.id"
              class="student-card"
            >
              <div>
                <h3>{{ student.name }}</h3>
                <p :class="getStatusClass(student.status)">
                  {{ student.status || 'Sin registrar' }}
                </p>
              </div>

              <div class="actions">
                <button class="present" @click="markAttendance(student.id, 'Presente')">
                  Presente
                </button>

                <button class="late" @click="markAttendance(student.id, 'Retardo')">
                  Retardo
                </button>

                <button class="absent" @click="markAttendance(student.id, 'Falta')">
                  Falta
                </button>

                <button class="edit" @click="editStudent(student)">
                  Editar
                </button>

                <button class="delete" @click="deleteStudent(student.id)">
                  Eliminar
                </button>
              </div>
            </article>
          </div>
        </section>

        <section v-if="view === 'dashboard'" class="dashboard">
          <div class="stats">
            <article class="stat">
              <h3>Total registros</h3>
              <strong>{{ dashboard.totals?.total || 0 }}</strong>
            </article>

            <article class="stat">
              <h3>Presentes</h3>
              <strong>{{ dashboard.totals?.presentes || 0 }}</strong>
            </article>

            <article class="stat">
              <h3>Retardos</h3>
              <strong>{{ dashboard.totals?.retardos || 0 }}</strong>
            </article>

            <article class="stat">
              <h3>Faltas</h3>
              <strong>{{ dashboard.totals?.faltas || 0 }}</strong>
            </article>
          </div>

          <div class="box">
            <h3>Resumen por estudiante</h3>

            <table>
              <thead>
                <tr>
                  <th>Estudiante</th>
                  <th>Registros</th>
                  <th>Presentes</th>
                  <th>Retardos</th>
                  <th>Faltas</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="student in dashboard.byStudent" :key="student.name">
                  <td>{{ student.name }}</td>
                  <td>{{ student.registros || 0 }}</td>
                  <td>{{ student.presentes || 0 }}</td>
                  <td>{{ student.retardos || 0 }}</td>
                  <td>{{ student.faltas || 0 }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="box">
            <h3>Historial por fecha</h3>

            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Registros</th>
                  <th>Presentes</th>
                  <th>Retardos</th>
                  <th>Faltas</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="item in dashboard.dates" :key="item.date">
                  <td>{{ item.date }}</td>
                  <td>{{ item.registros || 0 }}</td>
                  <td>{{ item.presentes || 0 }}</td>
                  <td>{{ item.retardos || 0 }}</td>
                  <td>{{ item.faltas || 0 }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </template>
    </section>
  </main>
</template>

<script setup>
const groups = ref([])
const selectedGroup = ref(null)
const attendance = ref([])
const dashboard = ref({})
const view = ref('attendance')

const newGroup = ref('')
const newStudent = ref('')
const date = ref(new Date().toISOString().slice(0, 10))

const loadGroups = async () => {
  groups.value = await $fetch('/api/groups')
}

const createGroup = async () => {
  if (!newGroup.value.trim()) return

  await $fetch('/api/groups', {
    method: 'POST',
    body: {
      name: newGroup.value
    }
  })

  newGroup.value = ''
  await loadGroups()
}

const selectGroup = async (group) => {
  selectedGroup.value = group
  view.value = 'attendance'
  await loadAttendance()
}

const addStudent = async () => {
  if (!newStudent.value.trim()) return

  await $fetch('/api/students', {
    method: 'POST',
    body: {
      group_id: selectedGroup.value.id,
      name: newStudent.value
    }
  })

  newStudent.value = ''
  await loadAttendance()
}

const editStudent = async (student) => {
  const newName = prompt('Nuevo nombre del estudiante:', student.name)

  if (!newName || !newName.trim()) return

  await $fetch('/api/students', {
    method: 'PUT',
    body: {
      id: student.id,
      name: newName
    }
  })

  await loadAttendance()
}

const deleteStudent = async (id) => {
  const confirmDelete = confirm('¿Eliminar estudiante del grupo?')

  if (!confirmDelete) return

  await $fetch('/api/students', {
    method: 'DELETE',
    body: { id }
  })

  await loadAttendance()
}

const loadAttendance = async () => {
  if (!selectedGroup.value) return

  attendance.value = await $fetch('/api/attendance', {
    query: {
      group_id: selectedGroup.value.id,
      date: date.value
    }
  })
}

const markAttendance = async (studentId, status) => {
  await $fetch('/api/attendance', {
    method: 'POST',
    body: {
      student_id: studentId,
      group_id: selectedGroup.value.id,
      date: date.value,
      status
    }
  })

  await loadAttendance()
}

const openDashboard = async () => {
  view.value = 'dashboard'

  dashboard.value = await $fetch('/api/dashboard', {
    query: {
      group_id: selectedGroup.value.id
    }
  })
}

const getStatusClass = (status) => {
  return {
    statusPresent: status === 'Presente',
    statusLate: status === 'Retardo',
    statusAbsent: status === 'Falta'
  }
}

onMounted(loadGroups)
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f3f4f6;
}

.app {
  display: grid;
  grid-template-columns: 310px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: #111827;
  color: white;
  padding: 24px;
}

.sidebar h1 {
  margin: 0;
  font-size: 32px;
}

.subtitle {
  color: #d1d5db;
  margin-bottom: 24px;
}

.box {
  background: white;
  color: #111827;
  padding: 18px;
  border-radius: 14px;
  margin-bottom: 18px;
}

.dark-box {
  background: #1f2937;
  color: white;
}

input {
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  box-sizing: border-box;
  border-radius: 10px;
  border: 1px solid #d1d5db;
}

button {
  border: none;
  border-radius: 10px;
  padding: 12px 16px;
  cursor: pointer;
  font-weight: bold;
}

.dark-box button,
.row button {
  background: #2563eb;
  color: white;
}

.groups {
  display: grid;
  gap: 10px;
}

.groups button {
  background: #374151;
  color: white;
  text-align: left;
}

.groups button.active {
  background: #2563eb;
}

.content {
  padding: 30px;
}

.empty {
  height: 80vh;
  display: grid;
  place-items: center;
  font-size: 22px;
  color: #6b7280;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h2 {
  margin: 0;
  font-size: 34px;
}

.header p {
  color: #6b7280;
}

.tabs {
  display: flex;
  gap: 10px;
  margin: 20px 0;
}

.tabs button {
  background: #e5e7eb;
}

.tabs .tabActive {
  background: #111827;
  color: white;
}

.row {
  display: grid;
  grid-template-columns: 1fr 160px;
  gap: 10px;
}

.attendance-list {
  display: grid;
  gap: 14px;
}

.student-card {
  background: white;
  padding: 18px;
  border-radius: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.student-card h3 {
  margin: 0;
}

.student-card p {
  margin: 6px 0 0;
  font-weight: bold;
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.present {
  background: #16a34a;
  color: white;
}

.late {
  background: #f59e0b;
  color: white;
}

.absent {
  background: #dc2626;
  color: white;
}

.edit {
  background: #6b7280;
  color: white;
}

.delete {
  background: #991b1b;
  color: white;
}

.statusPresent {
  color: #16a34a;
}

.statusLate {
  color: #f59e0b;
}

.statusAbsent {
  color: #dc2626;
}

.dashboard {
  display: grid;
  gap: 18px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat {
  background: white;
  border-radius: 14px;
  padding: 20px;
}

.stat h3 {
  margin: 0 0 10px;
  color: #6b7280;
}

.stat strong {
  font-size: 34px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
}

th {
  background: #f9fafb;
}
</style>