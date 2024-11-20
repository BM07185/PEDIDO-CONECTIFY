document.addEventListener('DOMContentLoaded', () => {
  cargarPedidos();
});

document.getElementById('form-pedido').addEventListener('submit', (e) => {
  e.preventDefault();

  const usuario = document.getElementById('usuario').value;
  const direccion = document.getElementById('direccion').value;
  const metodoPago = document.getElementById('pago').value;
  const items = document.getElementById('items').value.split(',');
  const cantidad = parseInt(document.getElementById('cantidad').value);
  const importe = parseFloat(document.getElementById('importe').value);
  const total = cantidad * importe;
  const hora = new Date().toLocaleTimeString();

  const nuevoPedido = {
    id: Date.now(),
    usuario,
    direccion,
    metodoPago,
    items,
    cantidad,
    importe,
    total,
    estado: 'Pendiente',
    hora
  };

  guardarPedido(nuevoPedido);
  cargarPedidos();
  e.target.reset();
});

function guardarPedido(pedido) {
  const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
  pedidos.push(pedido);
  localStorage.setItem('pedidos', JSON.stringify(pedidos));
}

function cargarPedidos() {
  const lista = document.getElementById('lista-pedidos');
  lista.innerHTML = '';

  const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

  pedidos.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>Usuario:</strong> ${p.usuario} |
      <strong>Dirección:</strong> ${p.direccion} |
      <strong>Método de Pago:</strong> ${p.metodoPago} |
      <strong>Items:</strong> ${p.items.join(', ')} |
      <strong>Total:</strong> $${p.total.toFixed(2)} |
      <strong>Hora:</strong> ${p.hora}
    `;

    const btnCompletar = document.createElement('button');
    btnCompletar.textContent = 'Completar';
    btnCompletar.addEventListener('click', () => cambiarEstadoPedido(p.id));

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.style.backgroundColor = '#b71c1c';
    btnEliminar.addEventListener('click', () => eliminarPedido(p.id));

    li.appendChild(btnCompletar);
    li.appendChild(btnEliminar);
    lista.appendChild(li);
  });
}

function cambiarEstadoPedido(id) {
  const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
  const pedido = pedidos.find(p => p.id === id);
  if (pedido) {
    pedido.estado = 'Completado';
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    cargarPedidos();
  }
}

function eliminarPedido(id) {
  let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
  pedidos = pedidos.filter(p => p.id !== id);
  localStorage.setItem('pedidos', JSON.stringify(pedidos));
  cargarPedidos();
}
