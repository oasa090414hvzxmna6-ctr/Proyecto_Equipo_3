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
    
    
    carrito = JSON.parse(localStorage.getItem("carritoDulceria")) || [];
    
    if (carrito.length === 0) {
        mostrarMensaje("Tu carrito está vacío");
        return false;
    }

    
    metodoSeleccionado = '';
    
    
    const btnTarjeta = document.getElementById('metodo-tarjeta');
    const btnEfectivo = document.getElementById('metodo-efectivo');
    const formTarjeta = document.getElementById('form-tarjeta');
    const infoEfectivo = document.getElementById('info-efectivo');
    
    if(btnTarjeta) btnTarjeta.classList.remove('seleccionado');
    if(btnEfectivo) btnEfectivo.classList.remove('seleccionado');
    if(formTarjeta) formTarjeta.classList.remove('visible');
    if(infoEfectivo) infoEfectivo.classList.remove('visible');

    
    if (!document.getElementById('modal-pago-overlay')) {
        crearModalPago();
    }

    const totalPrecio = carrito.reduce((total, producto) => {
        return total + (producto.precioNumerico * (producto.cantidad || 1));
    }, 0);

    const btnPagar = document.getElementById('btn-confirmar-pago');
    if(btnPagar) {
        btnPagar.textContent = `Pagar $${totalPrecio.toFixed(2)} MXN`;
        btnPagar.disabled = false;
    }

    const overlay = document.getElementById('modal-pago-overlay');
    overlay.classList.add('active'); 
    overlay.style.visibility = "visible"; 
    overlay.style.opacity = "1";
    
    return true;
}

function crearModalPago() {
    const modalHTML = `
    <div id="modal-pago-overlay" class="modal-overlay">
        <div class="modal-pago">
            <button class="btn-cerrar-modal" onclick="cerrarModalPago()">&times;</button>
            <h2 class="modal-titulo">Elige tu método de pago</h2>
            
            <div class="opciones-pago">
                <div class="btn-metodo" onclick="seleccionarMetodo('tarjeta')" id="metodo-tarjeta">
                    <span style="font-size: 30px;">💳</span>
                    <span>Tarjeta</span>
                </div>
                <div class="btn-metodo" onclick="seleccionarMetodo('efectivo')" id="metodo-efectivo">
                    <span style="font-size: 30px;">💵</span>
                    <span>Efectivo</span>
                </div>
            </div>

            
            <div id="form-tarjeta" class="form-pago">
                <div class="campo-pago">
                    <label>Nombre en la tarjeta</label>
                    <input type="text" placeholder="Como aparece en la tarjeta">
                </div>
                <div class="campo-pago">
                    <label>Número de tarjeta</label>
                    <input type="text" placeholder="0000 0000 0000 0000" maxlength="19">
                </div>
                <div class="fila-doble">
                    <div class="campo-pago">
                        <label>Vencimiento</label>
                        <input type="text" id="caducidad-tarjeta" placeholder="MM/AA" maxlength="5">
                    </div>
                    <div class="campo-pago">
                        <label>CVV</label>
                        <input type="text" placeholder="123" maxlength="3">
                    </div>
                </div>
            </div>

            
            <div id="info-efectivo" class="form-pago" style="text-align: center;">
                <p style="font-size: 1.2rem; margin-bottom: 10px;">Pago contra entrega</p>
                <p style="color: #666;">Pagarás al recibir tus dulces.</p>
                
                <div class="campo-pago" style="max-width: 200px; margin: 15px auto; text-align: left;">
                    <label>¿Con cuánto pagarás?</label>
                    <input type="number" id="monto-efectivo" placeholder="Ej: $500" min="0">
                </div>
            </div>

            <button id="btn-confirmar-pago" class="btn-confirmar-pago" onclick="procesarPago()">Pagar</button>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const cadInput = document.getElementById('caducidad-tarjeta');
    if (cadInput) {
        cadInput.addEventListener('input', function(e) {
            let v = e.target.value.replace(/\D/g, '');
            if (v.length >= 1) {
                let m = v.slice(0, 2);
                if (m.length === 2) {
                    let mi = parseInt(m, 10);
                    if (mi <= 0) m = '01';
                    else if (mi > 12) m = '12';
                    let y = v.slice(2, 4);
                    v = m + (v.length > 2 ? '/' + y : '/');
                } else {
                    v = m;
                }
            }
            e.target.value = v.slice(0, 5);
        });
    }
}

function cerrarModalPago() {
    const overlay = document.getElementById('modal-pago-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        overlay.style.visibility = "hidden";
        overlay.style.opacity = "0";
    }
}

let metodoSeleccionado = '';

function seleccionarMetodo(metodo) {
    metodoSeleccionado = metodo;
    
    const btnTarjeta = document.getElementById('metodo-tarjeta');
    const btnEfectivo = document.getElementById('metodo-efectivo');
    
    if(btnTarjeta) btnTarjeta.classList.remove('seleccionado');
    if(btnEfectivo) btnEfectivo.classList.remove('seleccionado');
    
    const seleccionado = document.getElementById(`metodo-${metodo}`);
    if(seleccionado) seleccionado.classList.add('seleccionado');

    const formTarjeta = document.getElementById('form-tarjeta');
    const infoEfectivo = document.getElementById('info-efectivo');

    if(formTarjeta) formTarjeta.classList.remove('visible');
    if(infoEfectivo) infoEfectivo.classList.remove('visible');

    if (metodo === 'tarjeta') {
        if(formTarjeta) formTarjeta.classList.add('visible');
    } else {
        if(infoEfectivo) infoEfectivo.classList.add('visible');
        const montoInput = document.getElementById('monto-efectivo');
        const btnPagar = document.getElementById('btn-confirmar-pago');
        if (montoInput && btnPagar) {
            const total = typeof obtenerTotal === 'function' ? obtenerTotal() : carrito.reduce((t, p) => t + (p.precioNumerico * (p.cantidad || 1)), 0);
            montoInput.focus();
            btnPagar.disabled = (parseFloat(montoInput.value) || 0) < total;
            const actualizarEstado = () => {
                const monto = parseFloat(montoInput.value) || 0;
                btnPagar.disabled = monto < total;
            };
            montoInput.removeEventListener('input', actualizarEstado);
            montoInput.addEventListener('input', actualizarEstado);
        }
    }
}

function procesarPago() {
    if (!metodoSeleccionado) {
        alert("Por favor selecciona un método de pago (Tarjeta o Efectivo)");
        return;
    }

    if (metodoSeleccionado === 'tarjeta') {
        const inputs = document.querySelectorAll('#form-tarjeta input');
        let completo = true;
        inputs.forEach(input => {
            if (!input.value.trim()) completo = false;
        });

        if (!completo) {
            alert("Por favor completa todos los datos de la tarjeta para continuar.");
            return;
        }
    }

    
    let mensajeExtra = "";
    if (metodoSeleccionado === 'efectivo') {
        const montoInput = document.getElementById('monto-efectivo');
        const monto = parseFloat(montoInput.value) || 0;
        
        const totalPrecio = carrito.reduce((total, producto) => {
            return total + (producto.precioNumerico * (producto.cantidad || 1));
        }, 0);

        if (monto < totalPrecio) {
            alert(`El monto a pagar ($${monto}) es menor al total ($${totalPrecio}). Por favor ingresa una cantidad válida.`);
            return;
        }
        
        const cambio = monto - totalPrecio;
        mensajeExtra = `\n\nPagas con: $${monto.toFixed(2)}\nCambio: $${cambio.toFixed(2)}`;
    }

    const btn = document.getElementById('btn-confirmar-pago');
    const textoOriginal = btn.textContent;
    btn.textContent = "Procesando...";
    btn.disabled = true;

    console.log(`💳 Procesando pago con método: ${metodoSeleccionado}`);

    setTimeout(() => {
        const totalPrecio = carrito.reduce((total, producto) => {
            return total + (producto.precioNumerico * (producto.cantidad || 1));
        }, 0);

        cerrarModalPago();

        alert(`¡PAGO EXITOSO!\n\nTotal pagado: $${totalPrecio.toFixed(2)} MXN\nMetodo: ${metodoSeleccionado.toUpperCase()}${mensajeExtra}\n\nGracias por tu compra en Dulcería Estrella.\nTe esperamos pronto.`);
        
        // Vaciar carrito
        carrito = [];
        localStorage.setItem("carritoDulceria", JSON.stringify([]));
        
        // Actualizar contador a 0
        actualizarContador();
        
        
        window.location.href = "index.html"; 
        
    }, 2000);
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


window.eliminarProducto = function(index) {
    carrito = JSON.parse(localStorage.getItem("carritoDulceria")) || [];
    
    if (index >= 0 && index < carrito.length) {
        const producto = carrito[index];
        carrito.splice(index, 1);
        localStorage.setItem("carritoDulceria", JSON.stringify(carrito));
        actualizarContador(); 
        
        
        const btnPagar = document.getElementById('btn-confirmar-pago');
        if (btnPagar) {
            const totalPrecio = carrito.reduce((total, p) => {
                return total + (p.precioNumerico * (p.cantidad || 1));
            }, 0);
            btnPagar.textContent = `Pagar $${totalPrecio.toFixed(2)} MXN`;
        }
        
        console.log(`🗑️ Eliminado desde carrito.js: ${producto.nombre}`);
        return producto;
    }
    return null;
};

window.actualizarCantidadProducto = function(index, nuevaCantidad) {
    carrito = JSON.parse(localStorage.getItem("carritoDulceria")) || [];

    if (index >= 0 && index < carrito.length && nuevaCantidad > 0) {
        carrito[index].cantidad = nuevaCantidad;
        localStorage.setItem("carritoDulceria", JSON.stringify(carrito));
        actualizarContador(); 
        
        
        const btnPagar = document.getElementById('btn-confirmar-pago');
        if (btnPagar) {
            const totalPrecio = carrito.reduce((total, p) => {
                return total + (p.precioNumerico * (p.cantidad || 1));
            }, 0);
            btnPagar.textContent = `Pagar $${totalPrecio.toFixed(2)} MXN`;
        }

        console.log(`✏️ Actualizado desde carrito.js: ${carrito[index].nombre} -> ${nuevaCantidad}`);
        return carrito[index];
    }
    return null;
};

window.obtenerTotal = function() {
    carrito = JSON.parse(localStorage.getItem("carritoDulceria")) || [];
    return carrito.reduce((total, producto) => {
        return total + (producto.precioNumerico * (producto.cantidad || 1));
    }, 0);
};

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
