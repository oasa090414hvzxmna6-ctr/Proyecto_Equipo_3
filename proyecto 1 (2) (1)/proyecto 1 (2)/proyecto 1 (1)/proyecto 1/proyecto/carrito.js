/* ============================
   CARRITO.js - VERSIÓN COMPLETA
   Con función de finalizar compra
============================ */

console.log("🛒 carrito.js - CARGADO");

// ========== 1. CARRITO ==========
let carrito = JSON.parse(localStorage.getItem("carritoDulceria")) || [];

// ========== 2. ACTUALIZAR CONTADOR ==========
function actualizarContador() {
    // Calcular total
    const total = carrito.reduce((sum, p) => sum + (p.cantidad || 1), 0);
    
    console.log("🔢 Productos en carrito: " + total);
    
    // Buscar el contador POR ID
    const contador = document.getElementById('cart-count');
    
    if (contador) {
        contador.textContent = total;
        console.log("✅ Contador actualizado a: " + total);
    } else {
        console.log("⚠️ No se encontró #cart-count, esperando...");
        // Intentar de nuevo en 500ms
        setTimeout(actualizarContador, 500);
    }
    
    return total;
}

// ========== 3. AGREGAR PRODUCTO ==========
function agregarAlCarrito(nombre, precio, imagen = 'img/default.jpg') {
    console.log("➕ AGREGANDO 1 UNIDAD de: " + nombre);
    
    // Extraer precio
    let precioNum = 0;
    if (typeof precio === 'string') {
        const match = precio.match(/\d+/);
        precioNum = match ? parseInt(match[0]) : 10;
    } else {
        precioNum = precio || 10;
    }
    
    // Buscar si ya existe
    let productoEncontrado = null;
    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].nombre === nombre) {
            productoEncontrado = carrito[i];
            break;
        }
    }
    
    if (productoEncontrado) {
        // SOLO SUMAR 1
        productoEncontrado.cantidad += 1;
        console.log("📈 " + nombre + " - Nueva cantidad: " + productoEncontrado.cantidad);
    } else {
        // Si no existe, agregar con cantidad 1
        carrito.push({
            nombre: nombre,
            precio: "$" + precioNum + ".00 MXN",
            precioNumerico: precioNum,
            imagen: imagen,
            cantidad: 1
        });
        console.log("🆕 Producto nuevo - Cantidad: 1");
    }
    
    // GUARDAR
    localStorage.setItem("carritoDulceria", JSON.stringify(carrito));
    
    // ACTUALIZAR CONTADOR
    actualizarContador();
    
    // Mensaje
    alert("✅ " + nombre + "\nAgregado al carrito\n\nCantidad: " + 
          (productoEncontrado ? productoEncontrado.cantidad : 1));
    
    return true;
}

// ========== 4. FUNCIÓN PARA FINALIZAR COMPRA ==========
function finalizarCompra() {
    console.log("💰 FINALIZANDO COMPRA...");
    
    if (carrito.length === 0) {
        alert("Tu carrito está vacío");
        return false;
    }
    
    // Calcular total
    const totalProductos = carrito.reduce((total, producto) => {
        return total + (producto.cantidad || 1);
    }, 0);
    
    const totalPrecio = carrito.reduce((total, producto) => {
        return total + (producto.precioNumerico * (producto.cantidad || 1));
    }, 0);
    
    // Mostrar resumen de compra
    let resumen = "📋 RESUMEN DE COMPRA:\n\n";
    carrito.forEach((producto, index) => {
        const subtotal = producto.precioNumerico * (producto.cantidad || 1);
        resumen += `${producto.cantidad}x ${producto.nombre} - $${subtotal.toFixed(2)} MXN\n`;
    });
    resumen += `\n💰 TOTAL: $${totalPrecio.toFixed(2)} MXN\n\n`;
    resumen += "¿Confirmar compra?";
    
    if (confirm(resumen)) {
        // Vaciar carrito
        carrito = [];
        localStorage.setItem("carritoDulceria", JSON.stringify([]));
        
        // Actualizar contador a 0
        actualizarContador();
        
        // Mostrar mensaje de éxito
        alert(`✅ ¡COMPRA REALIZADA CON ÉXITO!\n\nTotal pagado: $${totalPrecio.toFixed(2)} MXN\n\nGracias por tu compra en Dulcería Estrella.\nTe esperamos pronto.`);
        
        console.log("✅ Compra finalizada - Carrito vaciado");
        return true;
    } else {
        console.log("❌ Compra cancelada por el usuario");
        return false;
    }
}

// ========== 5. FUNCIÓN PARA VACIAR CARRITO ==========
function vaciarCarrito() {
    console.log("🗑️ SOLICITUD PARA VACIAR CARRITO");
    
    if (carrito.length === 0) {
        alert("El carrito ya está vacío");
        return false;
    }
    
    if (confirm("¿Estás seguro de vaciar todo el carrito?")) {
        carrito = [];
        localStorage.setItem("carritoDulceria", JSON.stringify([]));
        actualizarContador();
        alert("✅ Carrito vaciado correctamente");
        console.log("✅ Carrito vaciado");
        return true;
    }
    
    return false;
}

// ========== 6. CONECTAR BOTONES ==========
function conectarBotones() {
    console.log("🔌 Conectando botones...");
    
    const botones = document.querySelectorAll('.add-to-cart');
    console.log("🔍 Botones encontrados: " + botones.length);
    
    botones.forEach((boton, index) => {
        // Remover cualquier evento anterior
        const nuevoBoton = boton.cloneNode(true);
        boton.parentNode.replaceChild(nuevoBoton, boton);
        
        // Agregar evento NUEVO con prevención de doble click
        let procesando = false;
        
        nuevoBoton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Evitar múltiples clicks rápidos
            if (procesando) {
                console.log("⏸️ Click ignorado (ya se está procesando)");
                return;
            }
            
            procesando = true;
            
            console.log("🎯 Botón clickeado #" + (index + 1));
            
            const nombre = this.getAttribute('data-name');
            const precio = this.getAttribute('data-price');
            const imagen = this.getAttribute('data-img');
            
            if (nombre && precio) {
                agregarAlCarrito(nombre, precio, imagen);
            } else {
                alert("Error: Faltan datos");
            }
            
            // Permitir nuevo click después de 500ms
            setTimeout(() => {
                procesando = false;
            }, 500);
        });
    });
}

// ========== 7. INICIALIZACIÓN ==========
function inicializar() {
    console.log("🚀 Inicializando...");
    
    // 1. Cargar carrito
    carrito = JSON.parse(localStorage.getItem("carritoDulceria")) || [];
    
    // 2. Esperar a que cargue el header (fetch)
    console.log("⏳ Esperando a que cargue el header...");
    
    let intentos = 0;
    const maxIntentos = 10;
    
    const intervalo = setInterval(() => {
        intentos++;
        
        // Buscar el contador
        const contador = document.getElementById('cart-count');
        
        if (contador) {
            clearInterval(intervalo);
            console.log("✅ Header cargado en intento " + intentos);
            
            // Actualizar contador
            actualizarContador();
            
            // Conectar botones
            setTimeout(conectarBotones, 300);
        } else if (intentos >= maxIntentos) {
            clearInterval(intervalo);
            console.log("⚠️ Header no encontrado después de " + maxIntentos + " intentos");
        }
    }, 300);
}

// ========== 8. EJECUCIÓN ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log("📄 DOM cargado");
    setTimeout(inicializar, 100);
});

document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        console.log("👀 Página visible - Actualizando");
        carrito = JSON.parse(localStorage.getItem("carritoDulceria")) || [];
        actualizarContador();
    }
});

// Verificar cada 2 segundos
setInterval(() => {
    const contador = document.getElementById('cart-count');
    if (contador) {
        const totalReal = carrito.reduce((t, p) => t + (p.cantidad || 1), 0);
        const totalMostrado = parseInt(contador.textContent) || 0;
        
        if (totalReal !== totalMostrado) {
            console.log("🔄 Contador desactualizado, corrigiendo...");
            contador.textContent = totalReal;
        }
    }
}, 2000);

// ========== 9. FUNCIONES GLOBALES ==========
window.agregarAlCarrito = agregarAlCarrito;
window.actualizarContador = actualizarContador;
window.finalizarCompra = finalizarCompra;
window.vaciarCarrito = vaciarCarrito;

// Función para ver carrito en consola
window.verCarrito = function() {
    console.log("🛒 === CARRITO ACTUAL ===");
    if (carrito.length === 0) {
        console.log("📭 Carrito vacío");
    } else {
        carrito.forEach((p, i) => {
            console.log((i+1) + ". " + p.nombre + " - $" + p.precioNumerico + " x " + p.cantidad + " = $" + (p.precioNumerico * p.cantidad).toFixed(2));
        });
        const total = carrito.reduce((t, p) => t + (p.precioNumerico * p.cantidad), 0);
        console.log("💰 TOTAL: $" + total.toFixed(2));
    }
    console.log("========================");
};

console.log("✅ carrito.js LISTO - Con función de finalizar compra");