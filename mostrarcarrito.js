/* ============================
   MOSTRAR CARRITO - VERSIÓN QUE SÍ DEJA ESCRIBIR
============================ */

console.log("🛒 MostrarCarrito.js cargado - Versión corregida");

function mostrarProductosEnCarrito() {
    console.log("🔄 Mostrando productos del carrito...");
    
    let carrito = JSON.parse(localStorage.getItem("carritoDulceria")) || [];
    
    
    carrito = carrito.filter(p => p !== null && p !== undefined);
    
    const contenedor = document.getElementById("contenido-carrito");
    const totalElemento = document.getElementById("total-precio");
    const carritoVacio = document.getElementById("carrito-vacio");
    const carritoLleno = document.getElementById("carrito-lleno");
    
    console.log(`📦 Productos en carrito: ${carrito.length}`);
    
    if (carrito.length === 0) {
        console.log("📭 Carrito vacío");
        if (carritoVacio) carritoVacio.style.display = "block";
        if (carritoLleno) carritoLleno.style.display = "none";
        if (totalElemento) totalElemento.textContent = "$0.00";
        return;
    }
    
    if (carritoVacio) carritoVacio.style.display = "none";
    if (carritoLleno) carritoLleno.style.display = "block";
    
    if (contenedor) contenedor.innerHTML = "";
    
    let totalCompra = 0;
    
    carrito.forEach((producto, index) => {
        const precioNumerico = producto.precioNumerico || 
                              parseFloat(producto.precio.replace(/[^0-9.]/g, "")) || 0;
        const subtotal = precioNumerico * (producto.cantidad || 1);
        totalCompra += subtotal;
        
        console.log(`📋 ${producto.nombre} - $${precioNumerico} x ${producto.cantidad}`);
        
        const imagen = producto.imagen || 'img/default.jpg';
        
        const productoHTML = `
            <div class="item-carrito" data-index="${index}" data-precio="${precioNumerico}">
                <div class="producto-info">
                    <img src="${imagen}" alt="${producto.nombre}" width="100" height="100" 
                         style="border-radius: 8px; object-fit: cover;">
                    <div class="detalles-producto">
                        <h3>${producto.nombre}</h3>
                        <p class="precio-unitario">Precio unitario: $${precioNumerico.toFixed(2)} MXN</p>
                        <p class="subtotal-item" id="subtotal-${index}">
                            <strong>Subtotal: $${subtotal.toFixed(2)} MXN</strong>
                        </p>
                        
                        <div class="controles-cantidad" style="margin-top: 10px;">
                            <strong>Cantidad:</strong>
                            <input type="number" 
                                   class="input-cantidad" 
                                   value="${producto.cantidad || 1}" 
                                   min="1" 
                                   data-index="${index}"
                                   data-precio="${precioNumerico}"
                                   style="width: 70px; margin: 0 10px; padding: 5px;">
                            
                            <button class="btn-actualizar" data-index="${index}" 
                                    style="padding: 5px 15px; margin-right: 10px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">
                                Actualizar
                            </button>
                            
                            <button class="btn-eliminar" data-index="${index}"
                                    style="padding: 5px 15px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
                <hr style="margin: 20px 0;">
            </div>
        `;
        
        if (contenedor) contenedor.innerHTML += productoHTML;
    });
    
    if (totalElemento) {
        totalElemento.textContent = `$${totalCompra.toFixed(2)}`;
        console.log(`💰 Total compra: $${totalCompra.toFixed(2)}`);
    }
    
    agregarEventosAlCarrito();
}

function agregarEventosAlCarrito() {
    console.log("🔧 Agregando eventos al carrito...");
    
    // 1. EVENTOS PARA LOS INPUTS - VERSIÓN QUE SÍ DEJA ESCRIBIR
    document.querySelectorAll(".input-cantidad").forEach(input => {
        // Quitar límite máximo
        if (input.hasAttribute('max')) {
            input.removeAttribute('max');
        }
        
        // **CORRECCIÓN: USAR SOLO MOUSEDOWN EN VEZ DE CLICK**
        input.addEventListener("mousedown", function(e) {
            console.log("🖱️ Mouse down en input");
            
            // Solo seleccionar si NO está ya seleccionado
            if (this.selectionStart === this.selectionEnd) {
                setTimeout(() => {
                    this.select();
                }, 10);
            }
        });
        
        // **CORRECCIÓN: FOCUS SOLO LA PRIMERA VEZ**
        let primeraVez = true;
        input.addEventListener("focus", function() {
            console.log("🎯 Focus en input");
            if (primeraVez) {
                this.select();
                primeraVez = false;
            }
        });
        
        // Permitir que el usuario escriba normal
        input.addEventListener("click", function(e) {
            // No hacer nada - dejar que el usuario haga clic normalmente
            console.log("👆 Clic normal en input");
        });
        
        // Actualizar precio al cambiar valor
        input.addEventListener("input", function() {
            const index = this.getAttribute("data-index");
            const nuevaCantidad = parseInt(this.value) || 1;
            const precio = parseFloat(this.getAttribute("data-precio")) || 0;
            
            if (nuevaCantidad < 1) {
                this.value = 1;
                return;
            }
            
            const nuevoSubtotal = precio * nuevaCantidad;
            const subtotalElement = document.getElementById(`subtotal-${index}`);
            if (subtotalElement) {
                subtotalElement.innerHTML = `<strong>Subtotal: $${nuevoSubtotal.toFixed(2)} MXN</strong>`;
            }
            
            recalcularTotalTemporal();
        });
        
        
        input.addEventListener("change", function() {
            const index = this.getAttribute("data-index");
            const nuevaCantidad = parseInt(this.value) || 1;
            
            if (typeof window.actualizarCantidadProducto === 'function') {
                window.actualizarCantidadProducto(index, nuevaCantidad);
                recalcularTotal();
            }
        });
        
        input.addEventListener("blur", function() {
            primeraVez = true; 
        });
    });
    
    // 2. BOTÓN ACTUALIZAR
    document.querySelectorAll(".btn-actualizar").forEach(boton => {
        boton.addEventListener("click", function() {
            const index = this.getAttribute("data-index");
            const item = document.querySelector(`.item-carrito[data-index="${index}"]`);
            const input = item.querySelector(".input-cantidad");
            const nuevaCantidad = parseInt(input.value) || 1;
            
            if (nuevaCantidad < 1) {
                alert("La cantidad debe ser al menos 1");
                input.value = 1;
                return;
            }
            
            
            if (typeof window.actualizarCantidadProducto === 'function') {
                const producto = window.actualizarCantidadProducto(index, nuevaCantidad);
                
                if (producto) {
                    const precioNumerico = producto.precioNumerico || 0;
                    const nuevoSubtotal = precioNumerico * nuevaCantidad;
                    
                    const subtotalElement = document.getElementById(`subtotal-${index}`);
                    if (subtotalElement) {
                        subtotalElement.innerHTML = `<strong>Subtotal: ${nuevoSubtotal.toFixed(2)} MXN</strong>`;
                    }
                    
                    recalcularTotal();
                    mostrarMensaje(`✅ ${producto.nombre} actualizado a ${nuevaCantidad} unidades`);
                }
            }
        });
    });
    
    // 3. ACTUALIZAR CON ENTER
    document.querySelectorAll(".input-cantidad").forEach(input => {
        input.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                const index = this.getAttribute("data-index");
                const nuevaCantidad = parseInt(this.value) || 1;
                
                if (nuevaCantidad < 1) {
                    alert("La cantidad debe ser al menos 1");
                    this.value = 1;
                    return;
                }
                
                
                if (typeof window.actualizarCantidadProducto === 'function') {
                    const producto = window.actualizarCantidadProducto(index, nuevaCantidad);
                    
                    if (producto) {
                        const precioNumerico = producto.precioNumerico || 0;
                        const nuevoSubtotal = precioNumerico * nuevaCantidad;
                        
                        const subtotalElement = document.getElementById(`subtotal-${index}`);
                        if (subtotalElement) {
                            subtotalElement.innerHTML = `<strong>Subtotal: ${nuevoSubtotal.toFixed(2)} MXN</strong>`;
                        }
                        
                        recalcularTotal();
                        mostrarMensaje(`✅ ${producto.nombre} actualizado a ${nuevaCantidad} unidades`);
                    }
                }
            }
        });
    });
    
    // 4. BOTÓN ELIMINAR
    document.querySelectorAll(".btn-eliminar").forEach(boton => {
        boton.addEventListener("click", function() {
            const index = parseInt(this.getAttribute("data-index"));
            
            let carritoTemp = JSON.parse(localStorage.getItem("carritoDulceria")) || [];
            const nombreProducto = carritoTemp[index]?.nombre;
            
            
            if (typeof window.eliminarProducto === 'function') {
                window.eliminarProducto(index);
                mostrarProductosEnCarrito();
                mostrarMensaje(`🗑️ ${nombreProducto} eliminado del carrito`);
            }
        });
    });
    
}

// FUNCIONES AUXILIARES
function recalcularTotal() {
    let totalCompra = 0;
    if (typeof window.obtenerTotal === 'function') {
        totalCompra = window.obtenerTotal();
    } else {
        let carrito = JSON.parse(localStorage.getItem("carritoDulceria")) || [];
        carrito.forEach(p => totalCompra += (p.precioNumerico || 0) * (p.cantidad || 1));
    }
    
    const totalElemento = document.getElementById("total-precio");
    if (totalElemento) {
        totalElemento.textContent = `${totalCompra.toFixed(2)}`;
        console.log(`💰 Total actualizado: ${totalCompra.toFixed(2)}`);
    }
}

function recalcularTotalTemporal() {
    let totalTemp = 0;
    
    document.querySelectorAll(".item-carrito").forEach(item => {
        const input = item.querySelector(".input-cantidad");
        const cantidad = parseInt(input.value) || 1;
        const precio = parseFloat(item.getAttribute("data-precio")) || 0;
        
        totalTemp += precio * cantidad;
    });
    
    const totalElemento = document.getElementById("total-precio");
    if (totalElemento) {
        totalElemento.textContent = `$${totalTemp.toFixed(2)}`;
    }
}

function mostrarMensaje(texto) {
    const mensajeAnterior = document.querySelector(".mensaje-flotante");
    if (mensajeAnterior) {
        mensajeAnterior.remove();
    }
    
    const mensaje = document.createElement("div");
    mensaje.textContent = texto;
    mensaje.className = "mensaje-flotante";
    mensaje.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #4CAF50;
        color: white;
        padding: 12px 24px;
        border-radius: 6px;
        z-index: 9999;
        font-weight: bold;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: fadeInOut 2s ease;
    `;
    
    document.body.appendChild(mensaje);
    
    setTimeout(() => {
        if (mensaje.parentNode) {
            mensaje.parentNode.removeChild(mensaje);
        }
    }, 2000);
}


window.mostrarMensaje = mostrarMensaje;


// INICIALIZAR
document.addEventListener("DOMContentLoaded", function() {
    console.log("📄 Página cargada");
    setTimeout(mostrarProductosEnCarrito, 100);
});

console.log("✅ MostrarCarrito.js listo - AHORA SÍ DEJA ESCRIBIR");