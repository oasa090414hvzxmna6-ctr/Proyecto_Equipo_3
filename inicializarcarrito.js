/* ============================
   INICIALIZAR CARRITO DESPUÉS DE CARGA DINÁMICA
   Este script maneja contenido cargado con fetch()
============================ */

console.log("🔄 inicializarCarrito.js cargado - Esperando contenido dinámico...");

// Variable para controlar si ya inicializamos
let contenidoInicializado = false;

// Función para esperar a que un elemento exista
function esperarElemento(selector, callback, maxIntentos = 20, intervalo = 200) {
  let intentos = 0;
  const verificar = setInterval(() => {
    intentos++;
    const elemento = document.querySelector(selector);
    
    if (elemento) {
      clearInterval(verificar);
      callback(elemento);
      console.log(`✅ Elemento "${selector}" encontrado en intento ${intentos}`);
    } else if (intentos >= maxIntentos) {
      clearInterval(verificar);
      console.warn(`⚠️ Elemento "${selector}" no encontrado después de ${maxIntentos} intentos`);
    }
  }, intervalo);
}

// Función principal de inicialización
function inicializarTodo() {
  if (contenidoInicializado) {
    console.log("🔄 El contenido ya fue inicializado anteriormente");
    return;
  }
  
  console.log("🚀 Inicializando sistema completo...");
  
  // 1. Verificar que el contador del carrito exista (en el header)
  esperarElemento('#cart-count', function(contador) {
    console.log("🎯 Contador del carrito encontrado");
    
    // 2. Actualizar contador inicial
    if (typeof actualizarIndicadorCarrito === 'function') {
      actualizarIndicadorCarrito();
    } else {
      // Función alternativa si no está disponible
      const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
      const total = carrito.reduce((acc, p) => acc + (p.cantidad || 1), 0);
      contador.textContent = total;
    }
    
    // 3. Configurar botones del carrito
    configurarBotonesDinamicos();
    
    contenidoInicializado = true;
    console.log("✅ Sistema de carrito completamente inicializado");
  });
}

// Función para configurar botones (especial para contenido dinámico)
function configurarBotonesDinamicos() {
  console.log("🔧 Buscando botones dinámicos...");
  
  const botones = document.querySelectorAll('.add-to-cart');
  console.log(`🔍 Encontrados ${botones.length} botones de carrito`);
  
  if (botones.length === 0) {
    console.log("ℹ️ No se encontraron botones, reintentando en 1 segundo...");
    setTimeout(configurarBotonesDinamicos, 1000);
    return;
  }
  
  botones.forEach((btn, index) => {
    // Verificar si ya está inicializado
    if (!btn.hasAttribute('data-dinamico-inicializado')) {
      btn.setAttribute('data-dinamico-inicializado', 'true');
      
      // Clonar y reemplazar para limpiar listeners anteriores
      const nuevoBoton = btn.cloneNode(true);
      btn.parentNode.replaceChild(nuevoBoton, btn);
      
      // Agregar evento al nuevo botón
      nuevoBoton.addEventListener('click', manejarClickDinamico);
      
      console.log(`✅ Botón dinámico ${index + 1} configurado: ${nuevoBoton.getAttribute('data-name')}`);
    }
  });
}

// Manejador de clicks para botones dinámicos
function manejarClickDinamico(event) {
  event.preventDefault();
  event.stopPropagation();
  
  const boton = event.currentTarget;
  const nombre = boton.getAttribute('data-name');
  const precio = boton.getAttribute('data-price');
  const imagen = boton.getAttribute('data-img');
  
  console.log(`🎯 Botón dinámico clickeado: ${nombre}`);
  
  // Validar datos
  if (!nombre || !precio || !imagen) {
    console.error('❌ Faltan datos en el botón:', boton);
    alert('Error: El producto no tiene toda la información necesaria.');
    return;
  }
  
  // Crear objeto producto
  const producto = {
    nombre: nombre,
    precio: `$${precio}.00 MXN`,
    precioNumerico: parseFloat(precio),
    imagen: imagen,
    cantidad: 1
  };
  
  // Intentar usar la función del carrito.js si existe
  if (typeof agregarAlCarrito === 'function') {
    agregarAlCarrito(producto);
  } else {
    // Si no existe, agregar directamente
    agregarDirectamente(producto);
  }
}

// Función alternativa si carrito.js no está disponible
function agregarDirectamente(producto) {
  console.log("📦 Agregando producto directamente...");
  
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  
  const existe = carrito.find(p => p.nombre === producto.nombre);
  
  if (existe) {
    existe.cantidad++;
    console.log(`📈 Producto existente. Nueva cantidad: ${existe.cantidad}`);
  } else {
    carrito.push(producto);
    console.log("🆕 Nuevo producto agregado");
  }
  
  // Guardar
  localStorage.setItem('carrito', JSON.stringify(carrito));
  
  // Actualizar contador
  const contador = document.getElementById('cart-count');
  if (contador) {
    const total = carrito.reduce((acc, p) => acc + p.cantidad, 0);
    contador.textContent = total;
    contador.classList.add('cart-bounce');
    setTimeout(() => contador.classList.remove('cart-bounce'), 300);
  }
  
  // Mostrar notificación
  mostrarNotificacionDirecta(producto.nombre);
  
  console.log("✅ Producto agregado directamente:", producto);
}

// Notificación alternativa
function mostrarNotificacionDirecta(nombre) {
  const notif = document.createElement('div');
  notif.className = 'notificacion-carrito';
  notif.textContent = `✅ ${nombre} agregado al carrito`;
  notif.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 9999;
    opacity: 0;
    transform: translateX(100%);
    transition: opacity 0.3s, transform 0.3s;
    font-weight: bold;
  `;
  
  document.body.appendChild(notif);
  
  setTimeout(() => {
    notif.style.opacity = '1';
    notif.style.transform = 'translateX(0)';
  }, 10);
  
  setTimeout(() => {
    notif.style.opacity = '0';
    notif.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notif.parentNode) notif.parentNode.removeChild(notif);
    }, 300);
  }, 2000);
}

// ====== INICIALIZACIÓN AUTOMÁTICA ======

// 1. Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  console.log("📄 DOMContentLoaded - Iniciando proceso...");
  
  // Inicializar después de un breve delay
  setTimeout(inicializarTodo, 300);
});

// 2. Esperar a que la ventana se cargue completamente
window.addEventListener('load', function() {
  console.log("🖼️ Window loaded - Completando inicialización...");
  setTimeout(inicializarTodo, 500);
});

// 3. Observer para detectar cambios dinámicos
if (typeof MutationObserver !== 'undefined') {
  const observer = new MutationObserver(function(mutations) {
    let hayCambios = false;
    
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length > 0) {
        hayCambios = true;
      }
    });
    
    if (hayCambios) {
      console.log("🔄 Cambios detectados en el DOM");
      setTimeout(configurarBotonesDinamicos, 200);
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  console.log("👀 Observer configurado para cambios dinámicos");
}

// Hacer funciones disponibles globalmente
window.inicializarTodo = inicializarTodo;
window.configurarBotonesDinamicos = configurarBotonesDinamicos;

console.log("✅ inicializarCarrito.js listo y esperando");