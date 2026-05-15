import db from '../../db/database'

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const query = getQuery(event)

    return db.prepare(`
      SELECT
        students.id,
        students.name,
        attendance.status
      FROM students
      LEFT JOIN attendance
        ON students.id = attendance.student_id
        AND attendance.date = ?
      WHERE students.group_id = ?
        AND students.active = 1
      ORDER BY students.name ASC
    `).all(query.date, query.group_id)
  }

  if (event.method === 'POST') {
    const body = await readBody(event)

    db.prepare(`
      INSERT INTO attendance (student_id, group_id, date, status)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(student_id, date)
      DO UPDATE SET status = excluded.status
    `).run(
      body.student_id,
      body.group_id,
      body.date,
      body.status
    )

    return { message: 'Asistencia guardada' }
  }
})