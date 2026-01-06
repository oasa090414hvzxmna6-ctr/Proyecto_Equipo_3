/* ============================
   MOSTRAR CARRITO - VERSIÓN QUE SÍ DEJA ESCRIBIR
============================ */

console.log("🛒 MostrarCarrito.js cargado - Versión corregida");

function mostrarProductosEnCarrito() {
    console.log("🔄 Mostrando productos del carrito...");
    
    let carrito = JSON.parse(localStorage.getItem("carritoDulceria")) || [];
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
        
        // También actualizar al perder el foco
        input.addEventListener("blur", function() {
            primeraVez = true; // Resetear para la próxima vez
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
            
            let carrito = JSON.parse(localStorage.getItem("carritoDulceria")) || [];
            
            if (carrito[index]) {
                const producto = carrito[index];
                producto.cantidad = nuevaCantidad;
                localStorage.setItem("carritoDulceria", JSON.stringify(carrito));
                
                console.log(`✏️ ${producto.nombre} - Cantidad actualizada: ${nuevaCantidad}`);
                
                const precioNumerico = producto.precioNumerico || 0;
                const nuevoSubtotal = precioNumerico * nuevaCantidad;
                
                const subtotalElement = document.getElementById(`subtotal-${index}`);
                if (subtotalElement) {
                    subtotalElement.innerHTML = `<strong>Subtotal: $${nuevoSubtotal.toFixed(2)} MXN</strong>`;
                }
                
                recalcularTotal();
                mostrarMensaje(`✅ ${producto.nombre} actualizado a ${nuevaCantidad} unidades`);
                actualizarContadorEnHeader();
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
                
                let carrito = JSON.parse(localStorage.getItem("carritoDulceria")) || [];
                
                if (carrito[index]) {
                    const producto = carrito[index];
                    producto.cantidad = nuevaCantidad;
                    localStorage.setItem("carritoDulceria", JSON.stringify(carrito));
                    
                    const precioNumerico = producto.precioNumerico || 0;
                    const nuevoSubtotal = precioNumerico * nuevaCantidad;
                    
                    const subtotalElement = document.getElementById(`subtotal-${index}`);
                    if (subtotalElement) {
                        subtotalElement.innerHTML = `<strong>Subtotal: $${nuevoSubtotal.toFixed(2)} MXN</strong>`;
                    }
                    
                    recalcularTotal();
                    mostrarMensaje(`✅ ${producto.nombre} actualizado a ${nuevaCantidad} unidades`);
                    actualizarContadorEnHeader();
                }
            }
        });
    });
    
    // 4. BOTÓN ELIMINAR
    document.querySelectorAll(".btn-eliminar").forEach(boton => {
        boton.addEventListener("click", function() {
            const index = this.getAttribute("data-index");
            let carrito = JSON.parse(localStorage.getItem("carritoDulceria")) || [];
            
            const nombreProducto = carrito[index]?.nombre;
            
            if (confirm(`¿Estás seguro de eliminar "${nombreProducto}" del carrito?`)) {
                carrito.splice(index, 1);
                localStorage.setItem("carritoDulceria", JSON.stringify(carrito));
                
                console.log(`🗑️ Eliminado: ${nombreProducto}`);
                
                mostrarProductosEnCarrito();
                mostrarMensaje(`🗑️ ${nombreProducto} eliminado del carrito`);
                actualizarContadorEnHeader();
            }
        });
    });
    
    // 5. BOTÓN COMPRAR
    const btnComprar = document.querySelector(".btn-comprar");
    if (btnComprar) {
        btnComprar.addEventListener("click", function() {
            let carrito = JSON.parse(localStorage.getItem("carritoDulceria")) || [];
            
            if (carrito.length === 0) {
                alert("Tu carrito está vacío");
                return;
            }
            
            const total = calcularTotalCarrito();
            
            let resumen = "📋 RESUMEN DE COMPRA:\n\n";
            carrito.forEach((producto, index) => {
                const subtotal = (producto.precioNumerico || 0) * (producto.cantidad || 1);
                resumen += `${producto.cantidad}x ${producto.nombre} - $${subtotal.toFixed(2)} MXN\n`;
            });
            resumen += `\n💰 TOTAL: $${total.toFixed(2)} MXN\n\n`;
            resumen += "¿Confirmar compra?";
            
            if (confirm(resumen)) {
                alert(`✅ ¡Compra realizada!\n\nTotal: $${total.toFixed(2)} MXN\n\nGracias por tu compra en Dulcería Estrella.\nTe esperamos pronto.`);
                
                localStorage.setItem("carritoDulceria", JSON.stringify([]));
                mostrarProductosEnCarrito();
                actualizarContadorEnHeader();
            }
        });
    }
}

// FUNCIONES AUXILIARES
function recalcularTotal() {
    let carrito = JSON.parse(localStorage.getItem("carritoDulceria")) || [];
    let totalCompra = 0;
    
    carrito.forEach((producto, index) => {
        const precioNumerico = producto.precioNumerico || 0;
        const cantidad = producto.cantidad || 1;
        totalCompra += precioNumerico * cantidad;
    });
    
    const totalElemento = document.getElementById("total-precio");
    if (totalElemento) {
        totalElemento.textContent = `$${totalCompra.toFixed(2)}`;
        console.log(`💰 Total actualizado: $${totalCompra.toFixed(2)}`);
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

function calcularTotalCarrito() {
    let carrito = JSON.parse(localStorage.getItem("carritoDulceria")) || [];
    return carrito.reduce((sum, producto) => {
        const precio = producto.precioNumerico || 0;
        return sum + (precio * (producto.cantidad || 1));
    }, 0);
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

function actualizarContadorEnHeader() {
    let carrito = JSON.parse(localStorage.getItem("carritoDulceria")) || [];
    const total = carrito.reduce((sum, p) => sum + (p.cantidad || 1), 0);
    
    const contador = document.getElementById("cart-count");
    if (contador) {
        contador.textContent = total;
        console.log(`🔢 Contador actualizado: ${total}`);
    }
}

// INICIALIZAR
document.addEventListener("DOMContentLoaded", function() {
    console.log("📄 Página cargada");
    setTimeout(mostrarProductosEnCarrito, 100);
});

console.log("✅ MostrarCarrito.js listo - AHORA SÍ DEJA ESCRIBIR");