// Funciones compartidas y gestión de datos

// Inicializar almacenamiento
function inicializarAlmacenamiento() {
    if (!localStorage.getItem('pruebas')) {
        localStorage.setItem('pruebas', JSON.stringify([]));
    }
    if (!localStorage.getItem('resultados')) {
        localStorage.setItem('resultados', JSON.stringify([]));
    }
    if (!localStorage.getItem('estudiantesActivos')) {
        localStorage.setItem('estudiantesActivos', JSON.stringify([]));
    }
    // Inicializar contraseña del profesor (por defecto: "profesor123")
    if (!localStorage.getItem('passwordProfesor')) {
        localStorage.setItem('passwordProfesor', 'profesor123');
    }
}

// Obtener contraseña del profesor
function obtenerPasswordProfesor() {
    return localStorage.getItem('passwordProfesor') || 'profesor123';
}

// Cambiar contraseña del profesor
function cambiarPasswordProfesor(nuevaPassword) {
    localStorage.setItem('passwordProfesor', nuevaPassword);
}

// Verificar contraseña del profesor
function verificarPasswordProfesor(password) {
    const passwordCorrecta = obtenerPasswordProfesor();
    return password === passwordCorrecta;
}

// Verificar si el profesor está autenticado
function verificarAutenticacionProfesor() {
    return sessionStorage.getItem('profesorAutenticado') === 'true';
}

// Obtener todas las pruebas
function obtenerPruebas() {
    const pruebas = localStorage.getItem('pruebas');
    return pruebas ? JSON.parse(pruebas) : [];
}

// Guardar prueba
function guardarPrueba(prueba) {
    const pruebas = obtenerPruebas();
    prueba.id = Date.now().toString();
    prueba.fechaCreacion = new Date().toISOString();
    pruebas.push(prueba);
    localStorage.setItem('pruebas', JSON.stringify(pruebas));
    return prueba.id;
}

// Obtener prueba por ID
function obtenerPruebaPorId(id) {
    const pruebas = obtenerPruebas();
    return pruebas.find(p => p.id === id);
}

// Guardar resultado
function guardarResultado(resultado) {
    const resultados = obtenerResultados();
    resultado.id = Date.now().toString();
    resultado.fechaEnvio = new Date().toISOString();
    resultados.push(resultado);
    localStorage.setItem('resultados', JSON.stringify(resultados));
    return resultado.id;
}

// Obtener todos los resultados
function obtenerResultados() {
    const resultados = localStorage.getItem('resultados');
    return resultados ? JSON.parse(resultados) : [];
}

// Actualizar estudiante activo
function actualizarEstudianteActivo(estudiante, pruebaId, estado) {
    const activos = obtenerEstudiantesActivos();
    const index = activos.findIndex(e => e.nombre === estudiante && e.pruebaId === pruebaId);
    
    const estudianteActivo = {
        nombre: estudiante,
        pruebaId: pruebaId,
        estado: estado, // 'en-proceso', 'completado'
        ultimaActualizacion: new Date().toISOString()
    };
    
    if (index >= 0) {
        activos[index] = estudianteActivo;
    } else {
        activos.push(estudianteActivo);
    }
    
    localStorage.setItem('estudiantesActivos', JSON.stringify(activos));
}

// Obtener estudiantes activos
function obtenerEstudiantesActivos() {
    const activos = localStorage.getItem('estudiantesActivos');
    return activos ? JSON.parse(activos) : [];
}

// Calcular nota (escala 0-7)
function calcularNota(puntaje, total) {
    if (total === 0) return 0;
    const porcentaje = (puntaje / total) * 100;
    // Escala 0-7: 0% = 1.0, 100% = 7.0
    return (1.0 + (porcentaje / 100) * 6.0).toFixed(1);
}

// Formatear tiempo
function formatearTiempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
}

// Cambiar tab
function showTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    const selectedButton = Array.from(tabButtons).find(btn => 
        btn.textContent.includes(tabName === 'crear' ? 'Crear' : 
                                 tabName === 'ver-pruebas' ? 'Ver' : 'Resultados'));
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
}

// Inicializar al cargar
inicializarAlmacenamiento();

