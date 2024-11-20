const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const http = require('http'); // Necesario para integrar con Socket.IO
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Inicializa Socket.IO

const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Configura transporte de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tu-email@gmail.com',
    pass: 'tu-contraseña'
  }
});

// Ruta para enviar pedidos y notificar al cliente y chef
app.post('/send-order', (req, res) => {
  const { customerName, dish, notes } = req.body;

  const chefMailOptions = {
    from: 'tu-email@gmail.com',
    to: 'chef-email@gmail.com',
    subject: 'Nuevo Pedido',
    text: `Pedido de ${customerName}: ${dish}\nNotas: ${notes}`
  };

  transporter.sendMail(chefMailOptions, (err) => {
    if (err) return res.status(500).send('Error enviando al chef');

    // Emitir evento de nuevo pedido a los clientes conectados
    io.emit('newOrder', { customerName, dish, notes });
    res.status(200).send('Pedido enviado y notificado con éxito');
  });
});

// Escuchar conexiones de Socket.IO
io.on('connection', (socket) => {
  console.log('Cliente conectado');
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
