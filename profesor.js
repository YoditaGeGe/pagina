// Lógica del panel del profesor

let preguntaCounter = 0;

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    cargarPruebas();
    cargarResultados();
    actualizarFiltroPruebas();
    
    // Event listener para el formulario
    document.getElementById('formCrearPrueba').addEventListener('submit', function(e) {
        e.preventDefault();
        guardarPruebaForm();
    });
});

// Agregar pregunta
function agregarPregunta() {
    preguntaCounter++;
    const container = document.getElementById('preguntasContainer');
    
    const preguntaDiv = document.createElement('div');
    preguntaDiv.className = 'pregunta-item';
    preguntaDiv.id = `pregunta-${preguntaCounter}`;
    
    preguntaDiv.innerHTML = `
        <div class="pregunta-header">
            <h3>Pregunta ${preguntaCounter}</h3>
            <button type="button" class="btn btn-danger" onclick="eliminarPregunta(${preguntaCounter})">Eliminar</button>
        </div>
        <div class="form-group">
            <label>Tipo de pregunta:</label>
            <select class="tipo-pregunta" onchange="cambiarTipoPregunta(${preguntaCounter})" required>
                <option value="opcion-multiple">Opción Múltiple (A, B, C, D)</option>
                <option value="verdadero-falso">Verdadero / Falso</option>
                <option value="con-imagen">Con Imagen</option>
            </select>
        </div>
        <div class="form-group">
            <label>Texto de la pregunta:</label>
            <textarea class="pregunta-texto" rows="2" placeholder="Escribe la pregunta aquí" required></textarea>
        </div>
        <div class="contenido-tipo-pregunta" id="contenido-${preguntaCounter}">
            <!-- Se llenará dinámicamente según el tipo -->
        </div>
    `;
    
    container.appendChild(preguntaDiv);
    // Inicializar con opción múltiple por defecto
    cambiarTipoPregunta(preguntaCounter);
}

// Cambiar tipo de pregunta
function cambiarTipoPregunta(num) {
    const preguntaDiv = document.getElementById(`pregunta-${num}`);
    const tipoSelect = preguntaDiv.querySelector('.tipo-pregunta');
    const tipo = tipoSelect.value;
    const contenidoDiv = preguntaDiv.querySelector('.contenido-tipo-pregunta');
    
    if (tipo === 'opcion-multiple') {
        contenidoDiv.innerHTML = `
            <div class="form-group">
                <label>Opciones de respuesta:</label>
                <div class="opciones-container">
                    <div class="opcion-item">
                        <input type="radio" name="correcta-${num}" value="0" required>
                        <label style="min-width: 30px; margin-right: 10px;">A)</label>
                        <input type="text" class="opcion-texto" placeholder="Opción A" required>
                    </div>
                    <div class="opcion-item">
                        <input type="radio" name="correcta-${num}" value="1" required>
                        <label style="min-width: 30px; margin-right: 10px;">B)</label>
                        <input type="text" class="opcion-texto" placeholder="Opción B" required>
                    </div>
                    <div class="opcion-item">
                        <input type="radio" name="correcta-${num}" value="2" required>
                        <label style="min-width: 30px; margin-right: 10px;">C)</label>
                        <input type="text" class="opcion-texto" placeholder="Opción C" required>
                    </div>
                    <div class="opcion-item">
                        <input type="radio" name="correcta-${num}" value="3" required>
                        <label style="min-width: 30px; margin-right: 10px;">D)</label>
                        <input type="text" class="opcion-texto" placeholder="Opción D" required>
                    </div>
                </div>
                <small style="color: #666; margin-top: 10px; display: block;">Selecciona la opción correcta marcando el círculo</small>
            </div>
        `;
    } else if (tipo === 'verdadero-falso') {
        contenidoDiv.innerHTML = `
            <div class="form-group">
                <label>Respuesta correcta:</label>
                <div class="opciones-container">
                    <div class="opcion-item">
                        <input type="radio" name="correcta-${num}" value="0" required>
                        <label style="font-size: 18px; font-weight: bold; color: #28a745;">✓ Verdadero</label>
                    </div>
                    <div class="opcion-item">
                        <input type="radio" name="correcta-${num}" value="1" required>
                        <label style="font-size: 18px; font-weight: bold; color: #dc3545;">✗ Falso</label>
                    </div>
                </div>
                <small style="color: #666; margin-top: 10px; display: block;">Selecciona la respuesta correcta</small>
            </div>
        `;
    } else if (tipo === 'con-imagen') {
        contenidoDiv.innerHTML = `
            <div class="form-group">
                <label>URL de la imagen:</label>
                <input type="url" class="imagen-url" placeholder="https://ejemplo.com/imagen.jpg" required>
                <small style="color: #666; margin-top: 5px; display: block;">Ingresa la URL de la imagen (debe ser accesible públicamente)</small>
                <div class="preview-imagen" style="margin-top: 15px; display: none;">
                    <img id="preview-${num}" src="" alt="Vista previa" style="max-width: 100%; max-height: 300px; border-radius: 8px; border: 2px solid #e0e0e0;">
                </div>
            </div>
            <div class="form-group" style="margin-top: 20px;">
                <label>Opciones de respuesta:</label>
                <div class="opciones-container">
                    <div class="opcion-item">
                        <input type="radio" name="correcta-${num}" value="0" required>
                        <label style="min-width: 30px; margin-right: 10px;">A)</label>
                        <input type="text" class="opcion-texto" placeholder="Opción A" required>
                    </div>
                    <div class="opcion-item">
                        <input type="radio" name="correcta-${num}" value="1" required>
                        <label style="min-width: 30px; margin-right: 10px;">B)</label>
                        <input type="text" class="opcion-texto" placeholder="Opción B" required>
                    </div>
                    <div class="opcion-item">
                        <input type="radio" name="correcta-${num}" value="2" required>
                        <label style="min-width: 30px; margin-right: 10px;">C)</label>
                        <input type="text" class="opcion-texto" placeholder="Opción C" required>
                    </div>
                    <div class="opcion-item">
                        <input type="radio" name="correcta-${num}" value="3" required>
                        <label style="min-width: 30px; margin-right: 10px;">D)</label>
                        <input type="text" class="opcion-texto" placeholder="Opción D" required>
                    </div>
                </div>
                <small style="color: #666; margin-top: 10px; display: block;">Selecciona la opción correcta</small>
            </div>
        `;
        
        // Agregar evento para preview de imagen
        setTimeout(() => {
            const imagenInput = preguntaDiv.querySelector('.imagen-url');
            if (imagenInput) {
                imagenInput.addEventListener('input', function() {
                    const previewDiv = preguntaDiv.querySelector('.preview-imagen');
                    const previewImg = preguntaDiv.querySelector(`#preview-${num}`);
                    if (this.value) {
                        previewImg.src = this.value;
                        previewDiv.style.display = 'block';
                        previewImg.onerror = function() {
                            previewDiv.innerHTML = '<p style="color: #dc3545;">Error al cargar la imagen. Verifica la URL.</p>';
                        };
                    } else {
                        previewDiv.style.display = 'none';
                    }
                });
            }
        }, 100);
    }
}

// Eliminar pregunta
function eliminarPregunta(num) {
    const preguntaDiv = document.getElementById(`pregunta-${num}`);
    if (preguntaDiv) {
        preguntaDiv.remove();
        actualizarNumerosPreguntas();
    }
}

// Actualizar números de preguntas
function actualizarNumerosPreguntas() {
    const preguntas = document.querySelectorAll('.pregunta-item');
    preguntas.forEach((pregunta, index) => {
        const header = pregunta.querySelector('.pregunta-header h3');
        if (header) {
            header.textContent = `Pregunta ${index + 1}`;
        }
    });
}

// Guardar prueba desde formulario
function guardarPruebaForm() {
    const titulo = document.getElementById('tituloPrueba').value;
    const descripcion = document.getElementById('descripcionPrueba').value;
    const tiempoLimite = parseInt(document.getElementById('tiempoLimite').value);
    
    const preguntasItems = document.querySelectorAll('.pregunta-item');
    
    if (preguntasItems.length === 0) {
        alert('Debes agregar al menos una pregunta');
        return;
    }
    
    const preguntas = [];
    
    preguntasItems.forEach((item, index) => {
        const textoPregunta = item.querySelector('.pregunta-texto').value;
        const tipoSelect = item.querySelector('.tipo-pregunta');
        const tipo = tipoSelect ? tipoSelect.value : 'opcion-multiple';
        const preguntaId = item.id.split('-')[1];
        const correctaRadio = item.querySelector(`input[name="correcta-${preguntaId}"]:checked`);
        
        if (!correctaRadio) {
            alert(`Debes seleccionar la respuesta correcta para la pregunta ${index + 1}`);
            return;
        }
        
        let preguntaData = {
            tipo: tipo,
            texto: textoPregunta,
            respuestaCorrecta: parseInt(correctaRadio.value)
        };
        
        if (tipo === 'opcion-multiple' || tipo === 'con-imagen') {
            const opciones = [];
            const opcionesInputs = item.querySelectorAll('.opcion-texto');
            opcionesInputs.forEach(input => {
                opciones.push(input.value);
            });
            preguntaData.opciones = opciones;
        } else if (tipo === 'verdadero-falso') {
            preguntaData.opciones = ['Verdadero', 'Falso'];
        }
        
        if (tipo === 'con-imagen') {
            const imagenUrl = item.querySelector('.imagen-url');
            if (imagenUrl && imagenUrl.value) {
                preguntaData.imagenUrl = imagenUrl.value;
            }
        }
        
        preguntas.push(preguntaData);
    });
    
    if (preguntas.length === 0) {
        return;
    }
    
    const prueba = {
        titulo: titulo,
        descripcion: descripcion,
        tiempoLimite: tiempoLimite,
        preguntas: preguntas
    };
    
    guardarPrueba(prueba);
    
    alert('¡Prueba creada exitosamente!');
    
    // Limpiar formulario
    document.getElementById('formCrearPrueba').reset();
    document.getElementById('preguntasContainer').innerHTML = '';
    preguntaCounter = 0;
    
    // Actualizar lista
    cargarPruebas();
    showTab('ver-pruebas');
}

// Cargar lista de pruebas
function cargarPruebas() {
    const pruebas = obtenerPruebas();
    const container = document.getElementById('listaPruebas');
    
    if (pruebas.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">No hay pruebas creadas aún.</p>';
        return;
    }
    
    container.innerHTML = pruebas.map(prueba => `
        <div class="prueba-item">
            <div class="prueba-info">
                <h3>${prueba.titulo}</h3>
                <p>${prueba.descripcion || 'Sin descripción'}</p>
                <p style="font-size: 12px; color: #999; margin-top: 5px;">
                    ${prueba.preguntas.length} preguntas • ${prueba.tiempoLimite} minutos
                </p>
            </div>
            <div class="prueba-actions">
                <button class="btn btn-danger" onclick="eliminarPrueba('${prueba.id}')">Eliminar</button>
            </div>
        </div>
    `).join('');
}

// Eliminar prueba
function eliminarPrueba(id) {
    if (confirm('¿Estás seguro de eliminar esta prueba?')) {
        const pruebas = obtenerPruebas();
        const nuevasPruebas = pruebas.filter(p => p.id !== id);
        localStorage.setItem('pruebas', JSON.stringify(nuevasPruebas));
        cargarPruebas();
    }
}

// Cargar resultados
function cargarResultados() {
    const resultados = obtenerResultados();
    const activos = obtenerEstudiantesActivos();
    const container = document.getElementById('resultadosContainer');
    
    // Combinar resultados completados con estudiantes activos
    const todosLosEstudiantes = {};
    
    // Agregar resultados completados
    resultados.forEach(resultado => {
        const key = `${resultado.estudiante}-${resultado.pruebaId}`;
        todosLosEstudiantes[key] = {
            ...resultado,
            estado: 'completado'
        };
    });
    
    // Agregar estudiantes activos
    activos.forEach(activo => {
        const key = `${activo.nombre}-${activo.pruebaId}`;
        if (!todosLosEstudiantes[key]) {
            const prueba = obtenerPruebaPorId(activo.pruebaId);
            todosLosEstudiantes[key] = {
                estudiante: activo.nombre,
                pruebaId: activo.pruebaId,
                pruebaTitulo: prueba ? prueba.titulo : 'Prueba eliminada',
                estado: activo.estado,
                puntaje: null,
                nota: null,
                fechaEnvio: null
            };
        }
    });
    
    const filtroPrueba = document.getElementById('filtroPrueba').value;
    let estudiantesFiltrados = Object.values(todosLosEstudiantes);
    
    if (filtroPrueba) {
        estudiantesFiltrados = estudiantesFiltrados.filter(e => e.pruebaId === filtroPrueba);
    }
    
    if (estudiantesFiltrados.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">No hay resultados aún.</p>';
        return;
    }
    
    container.innerHTML = estudiantesFiltrados.map(estudiante => {
        const prueba = obtenerPruebaPorId(estudiante.pruebaId);
        const estadoClass = estudiante.estado === 'completado' ? 'completado' : 'en-proceso';
        const estadoText = estudiante.estado === 'completado' ? 'Completado' : 'En Proceso';
        
        return `
            <div class="resultado-item-card ${estadoClass}">
                <div class="resultado-header">
                    <h3>${estudiante.estudiante}</h3>
                    <span class="estado-badge ${estadoClass}">${estadoText}</span>
                </div>
                <p style="color: #666; margin-bottom: 15px;">
                    <strong>Prueba:</strong> ${prueba ? prueba.titulo : estudiante.pruebaTitulo}
                </p>
                ${estudiante.estado === 'completado' ? `
                    <div class="resultado-details">
                        <div class="resultado-detail">
                            <span class="label">Puntaje</span>
                            <span class="value">${estudiante.puntaje}/${estudiante.totalPreguntas}</span>
                        </div>
                        <div class="resultado-detail">
                            <span class="label">Nota</span>
                            <span class="value">${estudiante.nota}</span>
                        </div>
                        <div class="resultado-detail">
                            <span class="label">Fecha Envío</span>
                            <span class="value" style="font-size: 14px;">${new Date(estudiante.fechaEnvio).toLocaleString('es-ES')}</span>
                        </div>
                    </div>
                ` : `
                    <p style="color: #856404;">El estudiante está realizando la prueba...</p>
                `}
            </div>
        `;
    }).join('');
}

// Filtrar resultados
function filtrarResultados() {
    cargarResultados();
}

// Actualizar filtro de pruebas
function actualizarFiltroPruebas() {
    const pruebas = obtenerPruebas();
    const select = document.getElementById('filtroPrueba');
    
    select.innerHTML = '<option value="">Todas las pruebas</option>' +
        pruebas.map(p => `<option value="${p.id}">${p.titulo}</option>`).join('');
}

