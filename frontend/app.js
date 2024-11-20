// Cargar meseros al iniciar la página
document.addEventListener('DOMContentLoaded', async () => {
    const meseroSelect = document.getElementById('mesero');
    const respuesta = await fetch('/api/meseros');
    const meseros = await respuesta.json();
  
    meseros.forEach(m => {
      const option = document.createElement('option');
      option.value = m.nombre;
      option.textContent = m.nombre;
      meseroSelect.appendChild(option);
    });
  
    cargarPedidos();
  });
  
  // Agregar un nuevo pedido
  document.getElementById('form-pedido').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const mesa = document.getElementById('mesa').value;
    const mesero = document.getElementById('mesero').value;
    const items = document.getElementById('items').value.split(',');
  
    const respuesta = await fetch('/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mesa, mesero, items })
    });
  
    if (respuesta.ok) {
      alert('Pedido agregado!');
      cargarPedidos();
    }
  });
  
  // Cargar lista de pedidos
  async function cargarPedidos() {
    const lista = document.getElementById('lista-pedidos');
    lista.innerHTML = '';
  
    const respuesta = await fetch('/api/pedidos');
    const pedidos = await respuesta.json();
  
    pedidos.forEach(p => {
      const li = document.createElement('li');
      li.textContent = `Mesa ${p.mesa} - ${p.mesero}: ${p.items.join(', ')} [${p.estado}]`;
      lista.appendChild(li);
    });
  }
  