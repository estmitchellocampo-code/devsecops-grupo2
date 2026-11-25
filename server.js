const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10kb" }));

let tareas = [];
let siguienteId = 1;

// Comprobar funcionamiento
app.get("/health", (req, res) => {
  res.json({
    mensaje: "API funcionando correctamente",
    estado: "OK"
  });
});

// Consultar tareas
app.get("/tasks", (req, res) => {
  res.json(tareas);
});

// Crear tareas
app.post("/tasks", (req, res) => {
  const { titulo, descripcion } = req.body;

  if (
    typeof titulo !== "string" ||
    !titulo.trim() ||
    titulo.length > 100
  ) {
    return res.status(400).json({
      error: "Título inválido"
    });
  }

  if (
    descripcion !== undefined &&
    (typeof descripcion !== "string" || descripcion.length > 500)
  ) {
    return res.status(400).json({
      error: "Descripción inválida"
    });
  }

  const nuevaTarea = {
    id: siguienteId++,
    titulo: titulo.trim(),
    descripcion: descripcion || "",
    estado: "pendiente"
  };

  tareas.push(nuevaTarea);

  res.status(201).json(nuevaTarea);
});

// Actualizar tareas
app.put("/tasks/:id", (req, res) => {
  const tarea = tareas.find(
    t => t.id === Number(req.params.id)
  );

  if (!tarea) {
    return res.status(404).json({
      error: "Tarea no encontrada"
    });
  }

  const { titulo, descripcion, estado } = req.body;

  if (titulo !== undefined) {
    if (typeof titulo !== "string" || !titulo.trim() || titulo.length > 100) {
      return res.status(400).json({ error: "Título inválido" });
    }
    tarea.titulo = titulo.trim();
  }

  if (descripcion !== undefined) {
    if (typeof descripcion !== "string" || descripcion.length > 500) {
      return res.status(400).json({ error: "Descripción inválida" });
    }
    tarea.descripcion = descripcion;
  }

  if (estado !== undefined) {
    if (!["pendiente", "completada"].includes(estado)) {
      return res.status(400).json({ error: "Estado inválido" });
    }
    tarea.estado = estado;
  }

  res.json(tarea);
});

// Eliminar tareas
app.delete("/tasks/:id", (req, res) => {
  const cantidadInicial = tareas.length;

  tareas = tareas.filter(
    t => t.id !== Number(req.params.id)
  );

  if (tareas.length === cantidadInicial) {
    return res.status(404).json({
      error: "Tarea no encontrada"
    });
  }

  res.json({ mensaje: "Tarea eliminada correctamente" });
});

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.listen(PORT, () => {
  console.log(`API disponible en http://localhost:${PORT}`);
});