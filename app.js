// BarberPro — lógica de la app
// Guarda todo en localStorage, así que los datos persisten en el celular
// aunque cierres el navegador (hasta que borres datos del sitio).

const STORAGE_KEY = 'barberpro_data_v1';

const DATOS_INICIALES = {
  citas: [
    { id: 1, hora: '10:00 am', cliente: 'Carlos Ruiz', servicio: 'Corte + barba', barbero: 'Andrés' },
    { id: 2, hora: '11:30 am', cliente: 'Julián Pérez', servicio: 'Corte clásico', barbero: 'Andrés' },
    { id: 3, hora: '2:00 pm', cliente: 'Mateo Gómez', servicio: 'Diseño de barba', barbero: 'Felipe' }
  ],
  servicios: [
    { id: 1, nombre: 'Corte clásico', precio: 25000, dur: '30 min' },
    { id: 2, nombre: 'Corte + barba', precio: 38000, dur: '45 min' },
    { id: 3, nombre: 'Diseño de barba', precio: 18000, dur: '20 min' },
    { id: 4, nombre: 'Afeitado tradicional', precio: 22000, dur: '25 min' }
  ],
  clientes: [
    { id: 1, nombre: 'Carlos Ruiz', visitas: 12 },
    { id: 2, nombre: 'Julián Pérez', visitas: 7 },
    { id: 3, nombre: 'Mateo Gómez', visitas: 3 }
  ],
  barberos: ['Andrés', 'Felipe']
};

function cargarDatos() {
  try {
    const guardado = localStorage.getItem(STORAGE_KEY);
    if (guardado) return JSON.parse(guardado);
  } catch (e) {
    console.warn('No se pudo leer localStorage, usando datos iniciales.', e);
  }
  return structuredClone(DATOS_INICIALES);
}

function guardarDatos() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
  } catch (e) {
    console.warn('No se pudo guardar en localStorage.', e);
  }
}

let datos = cargarDatos();

const fmt = n => new Intl.NumberFormat('es-CO').format(Math.round(n));
const iniciales = nombre => nombre.trim().split(/\s+/).map(p => p[0]).slice(0, 2).join('').toUpperCase();
const nuevoId = lista => (lista.length ? Math.max(...lista.map(x => x.id)) + 1 : 1);

// ---------- Fecha ----------
document.getElementById('fecha-hoy').textContent = new Date().toLocaleDateString('es-CO', {
  weekday: 'long', day: 'numeric', month: 'long'
});

// ---------- Render: Agenda ----------
function renderCitas() {
  const lista = document.getElementById('citas-list');
  const vacio = document.getElementById('empty-agenda');
  document.getElementById('citas-count').textContent = `${datos.citas.length} cita${datos.citas.length === 1 ? '' : 's'}`;

  if (datos.citas.length === 0) {
    lista.innerHTML = '';
    vacio.hidden = false;
    return;
  }
  vacio.hidden = true;

  lista.innerHTML = datos.citas.map(c => `
    <div class="item-card">
      <div class="item-main">
        <p class="item-title">${escapeHtml(c.cliente)}</p>
        <p class="item-sub">${escapeHtml(c.servicio)} · ${escapeHtml(c.barbero)}</p>
      </div>
      <div class="item-right">
        <span class="time-tag">${escapeHtml(c.hora)}</span>
        <button class="delete-btn" aria-label="Eliminar cita" onclick="eliminarCita(${c.id})">✕</button>
      </div>
    </div>
  `).join('');
}

// ---------- Render: Servicios ----------
function renderServicios() {
  const selServicio = document.getElementById('cc-servicio');
  selServicio.innerHTML = datos.servicios.map(s => `<option value="${escapeAttr(s.nombre)}">${escapeHtml(s.nombre)}</option>`).join('');

  const selBarbero = document.getElementById('cc-barbero');
  selBarbero.innerHTML = datos.barberos.map(b => `<option value="${escapeAttr(b)}">${escapeHtml(b)}</option>`).join('');

  document.getElementById('servicios-list').innerHTML = datos.servicios.map(s => `
    <div class="item-card">
      <div class="item-main">
        <p class="item-title">${escapeHtml(s.nombre)}</p>
        <p class="item-sub">${escapeHtml(s.dur)}</p>
      </div>
      <div class="item-right">
        <span class="price-tag">$${fmt(s.precio)}</span>
        <button class="delete-btn" aria-label="Eliminar servicio" onclick="eliminarServicio(${s.id})">✕</button>
      </div>
    </div>
  `).join('');
}

// ---------- Render: Clientes ----------
function renderClientes() {
  document.getElementById('clientes-list').innerHTML = datos.clientes.map(c => `
    <div class="item-card">
      <div class="item-main" style="display:flex; align-items:center; gap:10px;">
        <div class="avatar">${escapeHtml(iniciales(c.nombre))}</div>
        <div>
          <p class="item-title">${escapeHtml(c.nombre)}</p>
          <p class="item-sub">${c.visitas} visita${c.visitas === 1 ? '' : 's'}</p>
        </div>
      </div>
      <button class="delete-btn" aria-label="Eliminar cliente" onclick="eliminarCliente(${c.id})">✕</button>
    </div>
  `).join('');
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}
function escapeAttr(str) { return escapeHtml(str); }

// ---------- Navegación de pestañas ----------
function showTab(tab) {
  ['agenda', 'servicios', 'clientes'].forEach(t => {
    document.getElementById('view-' + t).hidden = (t !== tab);
    document.querySelector(`.tab[data-tab="${t}"]`).classList.toggle('active', t === tab);
  });
}

// ---------- Formularios: abrir / cerrar genérico ----------
function abrirForm(tipo) {
  document.getElementById('form-' + tipo).hidden = false;
  document.getElementById('btn-nuevo' + (tipo === 'cita' ? 'a-cita' : tipo === 'servicio' ? '-servicio' : '-cliente')).hidden = true;
}
function cerrarForm(tipo) {
  document.getElementById('form-' + tipo).hidden = true;
  document.getElementById('btn-nuevo' + (tipo === 'cita' ? 'a-cita' : tipo === 'servicio' ? '-servicio' : '-cliente')).hidden = false;
  document.getElementById(tipo === 'cita' ? 'cc-error' : tipo === 'servicio' ? 'sv-error' : 'cl-error').hidden = true;
  if (tipo === 'cita') { document.getElementById('cc-cliente').value = ''; document.getElementById('cc-hora').value = ''; }
  if (tipo === 'servicio') { document.getElementById('sv-nombre').value = ''; document.getElementById('sv-precio').value = ''; document.getElementById('sv-dur').value = ''; }
  if (tipo === 'cliente') { document.getElementById('cl-nombre').value = ''; }
}

// ---------- Citas ----------
function guardarCita() {
  const cliente = document.getElementById('cc-cliente').value.trim();
  const hora = document.getElementById('cc-hora').value.trim();
  const servicio = document.getElementById('cc-servicio').value;
  const barbero = document.getElementById('cc-barbero').value;
  const error = document.getElementById('cc-error');

  if (!cliente || !hora) { error.hidden = false; return; }
  error.hidden = true;

  datos.citas.push({ id: nuevoId(datos.citas), hora, cliente, servicio, barbero });
  guardarDatos();
  renderCitas();
  cerrarForm('cita');
}
function eliminarCita(id) {
  datos.citas = datos.citas.filter(c => c.id !== id);
  guardarDatos();
  renderCitas();
}

// ---------- Servicios ----------
function guardarServicio() {
  const nombre = document.getElementById('sv-nombre').value.trim();
  const precio = parseFloat(document.getElementById('sv-precio').value);
  const dur = document.getElementById('sv-dur').value.trim() || '30 min';
  const error = document.getElementById('sv-error');

  if (!nombre || isNaN(precio) || precio < 0) { error.hidden = false; return; }
  error.hidden = true;

  datos.servicios.push({ id: nuevoId(datos.servicios), nombre, precio, dur });
  guardarDatos();
  renderServicios();
  cerrarForm('servicio');
}
function eliminarServicio(id) {
  datos.servicios = datos.servicios.filter(s => s.id !== id);
  guardarDatos();
  renderServicios();
}

// ---------- Clientes ----------
function guardarCliente() {
  const nombre = document.getElementById('cl-nombre').value.trim();
  const error = document.getElementById('cl-error');

  if (!nombre) { error.hidden = false; return; }
  error.hidden = true;

  datos.clientes.push({ id: nuevoId(datos.clientes), nombre, visitas: 0 });
  guardarDatos();
  renderClientes();
  cerrarForm('cliente');
}
function eliminarCliente(id) {
  datos.clientes = datos.clientes.filter(c => c.id !== id);
  guardarDatos();
  renderClientes();
}

// ---------- Inicio ----------
renderCitas();
renderServicios();
renderClientes();
