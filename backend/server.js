const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

// Cargar datos de meseros y pedidos
const meseros = JSON.parse(fs.readFileSync('./meseros.json'));
let pedidos = JSON.parse(fs.readFileSync('./pedidos.json'));

// Obtener lista de meseros
app.get('/api/meseros', (req, res) => {
  res.json(meseros);
});

// Obtener todos los pedidos
app.get('/api/pedidos', (req, res) => {
  res.json(pedidos);
});

// Crear un nuevo pedido
app.post('/api/pedidos', (req, res) => {
  const { mesa, mesero, items } = req.body;
  const nuevoPedido = { id: pedidos.length + 1, mesa, mesero, items, estado: 'Pendiente' };
  pedidos.push(nuevoPedido);
  fs.writeFileSync('./pedidos.json', JSON.stringify(pedidos, null, 2));
  res.status(201).json(nuevoPedido);
});

// Actualizar estado de un pedido
app.put('/api/pedidos/:id', (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  const pedido = pedidos.find(p => p.id == id);
  
  if (pedido) {
    pedido.estado = estado;
    fs.writeFileSync('./pedidos.json', JSON.stringify(pedidos, null, 2));
    res.json(pedido);
  } else {
    res.status(404).json({ mensaje: 'Pedido no encontrado' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
