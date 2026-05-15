import db from '../../db/database'

export default defineEventHandler((event) => {
  const query = getQuery(event)

  const totals = db.prepare(`
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN status = 'Presente' THEN 1 ELSE 0 END) AS presentes,
      SUM(CASE WHEN status = 'Retardo' THEN 1 ELSE 0 END) AS retardos,
      SUM(CASE WHEN status = 'Falta' THEN 1 ELSE 0 END) AS faltas
    FROM attendance
    WHERE group_id = ?
  `).get(query.group_id)

  const byStudent = db.prepare(`
    SELECT
      students.name,
      COUNT(attendance.id) AS registros,
      SUM(CASE WHEN attendance.status = 'Presente' THEN 1 ELSE 0 END) AS presentes,
      SUM(CASE WHEN attendance.status = 'Retardo' THEN 1 ELSE 0 END) AS retardos,
      SUM(CASE WHEN attendance.status = 'Falta' THEN 1 ELSE 0 END) AS faltas
    FROM students
    LEFT JOIN attendance
      ON students.id = attendance.student_id
    WHERE students.group_id = ?
      AND students.active = 1
    GROUP BY students.id
    ORDER BY students.name ASC
  `).all(query.group_id)

  const dates = db.prepare(`
    SELECT
      date,
      COUNT(*) AS registros,
      SUM(CASE WHEN status = 'Presente' THEN 1 ELSE 0 END) AS presentes,
      SUM(CASE WHEN status = 'Retardo' THEN 1 ELSE 0 END) AS retardos,
      SUM(CASE WHEN status = 'Falta' THEN 1 ELSE 0 END) AS faltas
    FROM attendance
    WHERE group_id = ?
    GROUP BY date
    ORDER BY date DESC
  `).all(query.group_id)

  return {
    totals,
    byStudent,
    dates
  }
})