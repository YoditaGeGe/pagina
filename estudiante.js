// Lógica del panel del estudiante

let estudianteActual = null;
let pruebaActual = null;
let respuestas = {};
let tiempoRestante = 0;
let timerInterval = null;

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si hay un estudiante en sesión
    const estudianteGuardado = sessionStorage.getItem('estudianteActual');
    if (estudianteGuardado) {
        estudianteActual = estudianteGuardado;
        mostrarVistaPruebas();
    } else {
        mostrarVistaSeleccion();
    }
});

// Iniciar sesión estudiante
function iniciarSesionEstudiante() {
    const nombre = document.getElementById('nombreEstudiante').value.trim();
    const mensajeError = document.getElementById('mensajeErrorNombre');
    
    // Limpiar mensaje anterior
    mensajeError.style.display = 'none';
    mensajeError.innerHTML = '';
    
    if (!nombre) {
        mostrarErrorNombre('Por favor ingresa tu nombre');
        document.getElementById('nombreEstudiante').focus();
        return;
    }
    
    if (nombre.length < 2) {
        mostrarErrorNombre('El nombre debe tener al menos 2 caracteres');
        document.getElementById('nombreEstudiante').focus();
        return;
    }
    
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
        mostrarErrorNombre('El nombre solo puede contener letras y espacios');
        document.getElementById('nombreEstudiante').focus();
        return;
    }
    
    estudianteActual = nombre;
    sessionStorage.setItem('estudianteActual', nombre);
    mostrarVistaPruebas();
}

// Mostrar error de nombre
function mostrarErrorNombre(mensaje) {
    const mensajeError = document.getElementById('mensajeErrorNombre');
    mensajeError.innerHTML = `<p style="color: #dc3545; background: #f8d7da; padding: 10px; border-radius: 6px; border: 1px solid #f5c6cb;">${mensaje}</p>`;
    mensajeError.style.display = 'block';
}

// Mostrar vista de selección
function mostrarVistaSeleccion() {
    document.getElementById('vistaSeleccion').style.display = 'block';
    document.getElementById('vistaPruebas').style.display = 'none';
    document.getElementById('vistaTomarPrueba').style.display = 'none';
    document.getElementById('vistaResultado').style.display = 'none';
}

// Mostrar vista de pruebas
function mostrarVistaPruebas() {
    document.getElementById('vistaSeleccion').style.display = 'none';
    document.getElementById('vistaPruebas').style.display = 'block';
    document.getElementById('vistaTomarPrueba').style.display = 'none';
    document.getElementById('vistaResultado').style.display = 'none';
    
    cargarPruebasDisponibles();
}

// Mostrar vista de tomar prueba
function mostrarVistaTomarPrueba() {
    document.getElementById('vistaSeleccion').style.display = 'none';
    document.getElementById('vistaPruebas').style.display = 'none';
    document.getElementById('vistaTomarPrueba').style.display = 'block';
    document.getElementById('vistaResultado').style.display = 'none';
}

// Mostrar vista de resultado
function mostrarVistaResultado() {
    document.getElementById('vistaSeleccion').style.display = 'none';
    document.getElementById('vistaPruebas').style.display = 'none';
    document.getElementById('vistaTomarPrueba').style.display = 'none';
    document.getElementById('vistaResultado').style.display = 'block';
}

// Cargar pruebas disponibles
function cargarPruebasDisponibles() {
    const pruebas = obtenerPruebas();
    const resultados = obtenerResultados();
    const container = document.getElementById('listaPruebasEstudiante');
    
    if (pruebas.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">No hay pruebas disponibles aún.</p>';
        return;
    }
    
    container.innerHTML = pruebas.map(prueba => {
        // Verificar si ya completó esta prueba
        const yaCompletada = resultados.some(r => 
            r.estudiante === estudianteActual && r.pruebaId === prueba.id
        );
        
        return `
            <div class="prueba-item">
                <div class="prueba-info">
                    <h3>${prueba.titulo}</h3>
                    <p>${prueba.descripcion || 'Sin descripción'}</p>
                    <p style="font-size: 12px; color: #999; margin-top: 5px;">
                        ${prueba.preguntas.length} preguntas • ${prueba.tiempoLimite} minutos
                    </p>
                    ${yaCompletada ? '<p style="color: #28a745; margin-top: 10px; font-weight: bold;">✓ Ya completada</p>' : ''}
                </div>
                <div class="prueba-actions">
                    ${yaCompletada ? 
                        `<button class="btn btn-secondary" onclick="verResultadoAnterior('${prueba.id}')">Ver Resultado</button>` :
                        `<button class="btn btn-primary" onclick="iniciarPrueba('${prueba.id}')">Comenzar</button>`
                    }
                </div>
            </div>
        `;
    }).join('');
}

// Iniciar prueba
function iniciarPrueba(pruebaId) {
    const prueba = obtenerPruebaPorId(pruebaId);
    
    if (!prueba) {
        alert('Prueba no encontrada');
        return;
    }
    
    pruebaActual = prueba;
    respuestas = {};
    tiempoRestante = prueba.tiempoLimite * 60; // Convertir a segundos
    
    // Marcar estudiante como activo
    actualizarEstudianteActivo(estudianteActual, pruebaId, 'en-proceso');
    
    // Mostrar prueba
    mostrarVistaTomarPrueba();
    renderizarPrueba();
    iniciarTimer();
}

// Renderizar prueba
function renderizarPrueba() {
    document.getElementById('tituloPruebaActual').textContent = pruebaActual.titulo;
    
    const container = document.getElementById('preguntasPrueba');
    
    container.innerHTML = pruebaActual.preguntas.map((pregunta, index) => {
        const preguntaId = `pregunta-${index}`;
        const respuestaGuardada = respuestas[index] !== undefined ? respuestas[index] : null;
        const tipo = pregunta.tipo || 'opcion-multiple';
        
        let contenidoPregunta = '';
        
        // Imagen si existe
        if (tipo === 'con-imagen' && pregunta.imagenUrl) {
            contenidoPregunta += `
                <div class="imagen-pregunta">
                    <img src="${pregunta.imagenUrl}" alt="Imagen de la pregunta" 
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <p style="display:none; color: #dc3545; padding: 10px; background: #f8d7da; border-radius: 6px;">
                        Error al cargar la imagen
                    </p>
                </div>
            `;
        }
        
        // Opciones según el tipo
        if (tipo === 'verdadero-falso') {
            contenidoPregunta += `
                <div class="opcion-quiz verdadero-falso">
                    <input 
                        type="radio" 
                        name="${preguntaId}" 
                        value="0" 
                        id="${preguntaId}-0"
                        ${respuestaGuardada === 0 ? 'checked' : ''}
                        onchange="guardarRespuesta(${index}, 0)"
                    >
                    <label for="${preguntaId}-0" class="verdadero-label">✓ Verdadero</label>
                </div>
                <div class="opcion-quiz verdadero-falso">
                    <input 
                        type="radio" 
                        name="${preguntaId}" 
                        value="1" 
                        id="${preguntaId}-1"
                        ${respuestaGuardada === 1 ? 'checked' : ''}
                        onchange="guardarRespuesta(${index}, 1)"
                    >
                    <label for="${preguntaId}-1" class="falso-label">✗ Falso</label>
                </div>
            `;
        } else {
            // Opción múltiple o con imagen
            const letras = ['A', 'B', 'C', 'D'];
            contenidoPregunta += pregunta.opciones.map((opcion, opcionIndex) => `
                <div class="opcion-quiz">
                    <input 
                        type="radio" 
                        name="${preguntaId}" 
                        value="${opcionIndex}" 
                        id="${preguntaId}-${opcionIndex}"
                        ${respuestaGuardada === opcionIndex ? 'checked' : ''}
                        onchange="guardarRespuesta(${index}, ${opcionIndex})"
                    >
                    <label for="${preguntaId}-${opcionIndex}">
                        <strong>${letras[opcionIndex]})</strong> ${opcion}
                    </label>
                </div>
            `).join('');
        }
        
        return `
            <div class="pregunta-quiz">
                <h3>Pregunta ${index + 1}: ${pregunta.texto}</h3>
                ${contenidoPregunta}
            </div>
        `;
    }).join('');
}

// Guardar respuesta
function guardarRespuesta(preguntaIndex, respuestaIndex) {
    respuestas[preguntaIndex] = respuestaIndex;
}

// Iniciar timer
function iniciarTimer() {
    actualizarTimer();
    
    timerInterval = setInterval(() => {
        tiempoRestante--;
        actualizarTimer();
        
        if (tiempoRestante <= 0) {
            clearInterval(timerInterval);
            alert('¡Tiempo agotado! La prueba se enviará automáticamente.');
            enviarPrueba();
        }
    }, 1000);
}

// Actualizar timer
function actualizarTimer() {
    const timerElement = document.getElementById('timer');
    timerElement.textContent = `Tiempo: ${formatearTiempo(tiempoRestante)}`;
    
    // Cambiar color según tiempo restante
    timerElement.className = 'timer';
    if (tiempoRestante <= 60) {
        timerElement.classList.add('danger');
    } else if (tiempoRestante <= 300) {
        timerElement.classList.add('warning');
    }
}

// Enviar prueba
function enviarPrueba() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Calcular puntaje
    let correctas = 0;
    const totalPreguntas = pruebaActual.preguntas.length;
    
    pruebaActual.preguntas.forEach((pregunta, index) => {
        const respuestaEstudiante = respuestas[index];
        const respuestaCorrecta = pregunta.respuestaCorrecta;
        
        if (respuestaEstudiante !== undefined && respuestaEstudiante === respuestaCorrecta) {
            correctas++;
        }
    });
    
    const nota = calcularNota(correctas, totalPreguntas);
    
    // Guardar resultado
    const resultado = {
        estudiante: estudianteActual,
        pruebaId: pruebaActual.id,
        pruebaTitulo: pruebaActual.titulo,
        respuestas: respuestas,
        puntaje: correctas,
        totalPreguntas: totalPreguntas,
        nota: nota
    };
    
    guardarResultado(resultado);
    
    // Actualizar estado del estudiante
    actualizarEstudianteActivo(estudianteActual, pruebaActual.id, 'completado');
    
    // Mostrar resultado
    mostrarResultado(correctas, totalPreguntas, nota);
}

// Mostrar resultado
function mostrarResultado(correctas, total, nota) {
    document.getElementById('puntajeFinal').textContent = `${correctas}/${total}`;
    document.getElementById('notaFinal').textContent = nota;
    document.getElementById('correctasFinal').textContent = correctas;
    document.getElementById('totalFinal').textContent = total;
    
    mostrarVistaResultado();
}

// Cancelar prueba
function cancelarPrueba() {
    if (confirm('¿Estás seguro de cancelar? Se perderán tus respuestas.')) {
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        mostrarVistaPruebas();
    }
}

// Volver a pruebas
function volverAPruebas() {
    mostrarVistaPruebas();
}

// Ver resultado anterior
function verResultadoAnterior(pruebaId) {
    const resultados = obtenerResultados();
    const resultado = resultados.find(r => 
        r.estudiante === estudianteActual && r.pruebaId === pruebaId
    );
    
    if (resultado) {
        mostrarResultado(resultado.puntaje, resultado.totalPreguntas, resultado.nota);
    }
}

