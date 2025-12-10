// Variables globales para los gráficos
let chartEcuaciones = null;
let chartIntegracion = null;
let chartDiferenciales = null;

// Función para evaluar expresiones matemáticas
function evaluarFuncion(expresion, x) {
    // Reemplazar x en la expresión
    let expr = expresion.replace(/x/g, '(' + x + ')');
    expr = expr.replace(/\^/g, '**');
    
    // Evaluar la expresión
    try {
        return eval(expr);
    } catch (error) {
        console.error("Error al evaluar la función:", error);
        return NaN;
    }
}

// Función para evaluar expresiones con dos variables
function evaluarFuncionDosVariables(expresion, t, y) {
    // Reemplazar t e y en la expresión
    let expr = expresion.replace(/t/g, '(' + t + ')');
    expr = expr.replace(/y/g, '(' + y + ')');
    expr = expr.replace(/\^/g, '**');
    
    // Evaluar la expresión
    try {
        return eval(expr);
    } catch (error) {
        console.error("Error al evaluar la función:", error);
        return NaN;
    }
}

// Función para derivar numéricamente
function derivadaNumerica(f, x, h = 0.0001) {
    return (f(x + h) - f(x - h)) / (2 * h);
}

// ================ SOLUCIÓN DE ECUACIONES ================

// Método de Bisección
function metodoBiseccion(f, a, b, tolerancia, maxIter) {
    let resultados = [];
    
    if (f(a) * f(b) >= 0) {
        return { raiz: null, iteraciones: resultados, error: "f(a) y f(b) deben tener signos opuestos" };
    }
    
    let iter = 0;
    let c = a;
    
    while ((b - a) >= tolerancia && iter < maxIter) {
        // Encontrar punto medio
        c = (a + b) / 2;
        
        // Calcular f(c)
        let fc = f(c);
        
        // Guardar información de la iteración
        resultados.push({
            iteracion: iter + 1,
            a: a,
            b: b,
            c: c,
            f_a: f(a),
            f_b: f(b),
            f_c: fc,
            error: (b - a) / 2
        });
        
        // Verificar si c es la raíz
        if (fc === 0.0) {
            break;
        }
        
        // Decidir el lado para continuar
        if (f(c) * f(a) < 0) {
            b = c;
        } else {
            a = c;
        }
        
        iter++;
    }
    
    return { raiz: c, iteraciones: resultados, error: null };
}

// Método de Newton-Raphson
function metodoNewton(f, df, x0, tolerancia, maxIter) {
    let resultados = [];
    
    let x = x0;
    let iter = 0;
    let error = tolerancia + 1;
    
    while (error > tolerancia && iter < maxIter) {
        let fx = f(x);
        let dfx = df(x);
        
        // Evitar división por cero
        if (dfx === 0) {
            return { raiz: null, iteraciones: resultados, error: "Derivada cero encontrada" };
        }
        
        // Calcular nuevo x
        let xNuevo = x - fx / dfx;
        error = Math.abs(xNuevo - x);
        
        // Guardar información de la iteración
        resultados.push({
            iteracion: iter + 1,
            x: x,
            f_x: fx,
            df_x: dfx,
            x_nuevo: xNuevo,
            error: error
        });
        
        x = xNuevo;
        iter++;
    }
    
    return { raiz: x, iteraciones: resultados, error: null };
}

// ================ INTEGRACIÓN NUMÉRICA ================

// Regla del Trapecio
function reglaTrapecio(f, a, b, n) {
    let h = (b - a) / n;
    let suma = f(a) + f(b);
    
    // Puntos para graficar
    let puntos = [];
    puntos.push({ x: a, y: f(a) });
    
    for (let i = 1; i < n; i++) {
        let x = a + i * h;
        suma += 2 * f(x);
        puntos.push({ x: x, y: f(x) });
    }
    
    puntos.push({ x: b, y: f(b) });
    
    let resultado = (h / 2) * suma;
    
    return { resultado: resultado, puntos: puntos, h: h };
}

// Regla de Simpson
function reglaSimpson(f, a, b, n) {
    // Asegurar que n es par
    if (n % 2 !== 0) {
        n += 1;
    }
    
    let h = (b - a) / n;
    let suma = f(a) + f(b);
    
    // Puntos para graficar
    let puntos = [];
    puntos.push({ x: a, y: f(a) });
    
    for (let i = 1; i < n; i++) {
        let x = a + i * h;
        if (i % 2 === 0) {
            suma += 2 * f(x);
        } else {
            suma += 4 * f(x);
        }
        puntos.push({ x: x, y: f(x) });
    }
    
    puntos.push({ x: b, y: f(b) });
    
    let resultado = (h / 3) * suma;
    
    return { resultado: resultado, puntos: puntos, h: h };
}

// ================ ECUACIONES DIFERENCIALES ================

// Método de Euler
function metodoEuler(f, t0, y0, h, n) {
    let resultados = [];
    let t = t0;
    let y = y0;
    
    resultados.push({ t: t, y: y });
    
    for (let i = 0; i < n; i++) {
        y = y + h * f(t, y);
        t = t + h;
        
        resultados.push({ t: t, y: y });
    }
    
    return resultados;
}

// Método de Taylor (Orden 2)
function metodoTaylor(f, df, t0, y0, h, n) {
    let resultados = [];
    let t = t0;
    let y = y0;
    
    resultados.push({ t: t, y: y });
    
    for (let i = 0; i < n; i++) {
        y = y + h * f(t, y) + (h * h / 2) * df(t, y);
        t = t + h;
        
        resultados.push({ t: t, y: y });
    }
    
    return resultados;
}

// ================ GENERACIÓN DE VALORES ALEATORIOS ================

// Generar valores aleatorios para ecuaciones
// Generar valores aleatorios para ecuaciones
function generarValoresEcuaciones() {
    // Generar coeficientes aleatorios para la ecuación cuadrática
    let a, b, cTerm;
    
    // Asegurar que la ecuación tenga raíces reales y que f(a) y f(b) tengan signos opuestos
    do {
        a = (Math.random() * 0.8 + 0.2).toFixed(2); // Entre 0.2 y 1.0 (positivo para que sea cóncava hacia arriba)
        b = -(Math.random() * 20 + 10).toFixed(1); // Entre -30 y -10 (negativo)
        cTerm = (Math.random() * 60 + 40).toFixed(1); // Entre 40 y 100
    } while (parseFloat(a) <= 0); // Asegurar que a sea positivo
    
    // Calcular c (c = cTerm - 20 porque la ecuación es aT² + bT + cTerm = 20)
    let c = parseFloat(cTerm) - 20;
    
    // La ecuación es: a*T² + b*T + c = 0
    
    // Calcular el vértice de la parábola (Tv = -b/(2a))
    let Tv = -parseFloat(b) / (2 * parseFloat(a));
    
    // Calcular f(Tv) para verificar si la parábola cruza el eje x
    let f_Tv = parseFloat(a) * Tv * Tv + parseFloat(b) * Tv + c;
    
    // Si f(Tv) > 0 (la parábola no cruza el eje x), ajustar c para asegurar raíces reales
    if (f_Tv > 0) {
        // Hacer que c sea más negativo para bajar la parábola
        c = c - Math.abs(f_Tv) - 1;
    }
    
    // Recalcular discriminante
    let discriminante = parseFloat(b) * parseFloat(b) - 4 * parseFloat(a) * c;
    
    // Si el discriminante es negativo, ajustar parámetros
    if (discriminante < 0) {
        // Ajustar c para hacer el discriminante positivo
        c = parseFloat(b) * parseFloat(b) / (4 * parseFloat(a)) - 0.1;
    }
    
    // Recalcular discriminante con el nuevo c
    discriminante = parseFloat(b) * parseFloat(b) - 4 * parseFloat(a) * c;
    
    // Calcular raíces
    let raiz1 = (-parseFloat(b) - Math.sqrt(discriminante)) / (2 * parseFloat(a));
    let raiz2 = (-parseFloat(b) + Math.sqrt(discriminante)) / (2 * parseFloat(a));
    
    // Ordenar raíces
    let raizMenor = Math.min(raiz1, raiz2);
    let raizMayor = Math.max(raiz1, raiz2);
    
    // Verificar que las raíces sean positivas (temperatura en °C)
    if (raizMenor < 0) {
        // Desplazar la ecuación para que las raíces sean positivas
        let desplazamiento = Math.abs(raizMenor) + 5;
        raizMenor += desplazamiento;
        raizMayor += desplazamiento;
        // Ajustar c para reflejar el desplazamiento
        c = c + parseFloat(b) * desplazamiento + parseFloat(a) * desplazamiento * desplazamiento;
    }
    
    // Establecer intervalo para bisección que garantice f(a) y f(b) con signos opuestos
    let intervaloA, intervaloB;
    
    // Tomar un intervalo que contenga la raíz menor
    intervaloA = Math.max(0, raizMenor - 10); // Asegurar que sea positivo
    intervaloB = raizMenor + 10;
    
    // Verificar que f(intervaloA) y f(intervaloB) tengan signos opuestos
    let f_a = parseFloat(a) * intervaloA * intervaloA + parseFloat(b) * intervaloA + c;
    let f_b = parseFloat(a) * intervaloB * intervaloB + parseFloat(b) * intervaloB + c;
    
    // Si no tienen signos opuestos, ajustar el intervalo
    if (f_a * f_b > 0) {
        // Si ambos son positivos, reducir intervaloB
        if (f_a > 0 && f_b > 0) {
            intervaloB = raizMenor + 5;
        }
        // Si ambos son negativos, aumentar intervaloA
        else if (f_a < 0 && f_b < 0) {
            intervaloA = Math.max(0, raizMenor - 5);
        }
    }
    
    // Recalcular para asegurar
    f_a = parseFloat(a) * intervaloA * intervaloA + parseFloat(b) * intervaloA + c;
    f_b = parseFloat(a) * intervaloB * intervaloB + parseFloat(b) * intervaloB + c;
    
    // Si aún no tienen signos opuestos, usar un método más directo
    if (f_a * f_b > 0) {
        // Usar un intervalo simétrico alrededor de la raíz
        intervaloA = raizMenor - 5;
        intervaloB = raizMenor + 5;
        // Asegurar que intervaloA no sea negativo
        if (intervaloA < 0) {
            intervaloA = 0;
            intervaloB = 10;
        }
    }
    
    // Actualizar el problema
    document.getElementById('ecuacion-problema').innerHTML = `
        Determinar el punto de fusión de una aleación metálica. La resistencia eléctrica de la aleación cambia con la temperatura según el modelo: <code>R(T) = ${parseFloat(a).toFixed(2)}T² ${parseFloat(b) >= 0 ? '+' : ''}${parseFloat(b).toFixed(1)}T + ${(c + 20).toFixed(1)}</code>. 
        El punto de fusión ocurre cuando la resistencia alcanza un valor crítico de 20 Ω. Por lo tanto, necesitamos resolver: <code>${parseFloat(a).toFixed(2)}T² ${parseFloat(b) >= 0 ? '+' : ''}${parseFloat(b).toFixed(1)}T + ${(c + 20).toFixed(1)} = 20</code>.
        <p>Simplificando: <code>f(T) = ${parseFloat(a).toFixed(2)}T² ${parseFloat(b) >= 0 ? '+' : ''}${parseFloat(b).toFixed(1)}T + ${c.toFixed(1)} = 0</code></p>
        <p>Donde T representa la temperatura en grados Celsius.</p>
    `;
    
    // Actualizar valores de entrada
    document.getElementById('intervalo-a').value = intervaloA.toFixed(1);
    document.getElementById('intervalo-b').value = intervaloB.toFixed(1);
    document.getElementById('valor-inicial').value = ((intervaloA + intervaloB) / 2).toFixed(1);
    
    // Devolver función para usar en cálculos
    return {
        f: (x) => parseFloat(a) * x * x + parseFloat(b) * x + c,
        df: (x) => 2 * parseFloat(a) * x + parseFloat(b),
        a: parseFloat(a),
        b: parseFloat(b),
        c: c
    };
}

// Generar valores aleatorios para integración
function generarValoresIntegracion() {
    // Generar parámetros aleatorios para la función
    let a = 8 + Math.random() * 4; // Entre 8 y 12
    let b = 1 + Math.random() * 2; // Entre 1 y 3
    let c = 0.1 + Math.random() * 0.4; // Entre 0.1 y 0.5
    
    // Actualizar el problema
    document.getElementById('integracion-problema').innerHTML = `
        Calcular el área de un terreno irregular. Se han tomado mediciones de ancho (en metros) a intervalos regulares a lo largo del terreno. Los anchos medidos siguen la función: <code>f(x) = ${a.toFixed(1)} + ${b.toFixed(1)}*sin(0.5x) + ${c.toFixed(2)}*x</code>, donde x es la distancia desde el inicio del terreno.
        <p>Función: <code>f(x) = ${a.toFixed(1)} + ${b.toFixed(1)}*Math.sin(0.5*x) + ${c.toFixed(2)}*x</code></p>
        <p>Queremos calcular el área total del terreno entre x=0 y x=20 metros.</p>
    `;
    
    // Actualizar valores de entrada
    document.getElementById('limite-a').value = 0;
    document.getElementById('limite-b').value = 20;
    document.getElementById('n-subintervalos').value = 8 + Math.floor(Math.random() * 8); // Entre 8 y 15
    document.getElementById('funcion-integracion').value = `${a.toFixed(1)} + ${b.toFixed(1)}*Math.sin(0.5*x) + ${c.toFixed(2)}*x`;
    
    // Devolver función para usar en cálculos
    return (x) => a + b * Math.sin(0.5 * x) + c * x;
}

// Generar valores aleatorios para ecuaciones diferenciales
function generarValoresDiferenciales() {
    // Generar parámetros aleatorios
    let tempInicial = 70 + Math.random() * 30; // Entre 70 y 100°C
    let tempAmbiente = 15 + Math.random() * 15; // Entre 15 y 30°C
    let constanteEnfriamiento = 0.03 + Math.random() * 0.08; // Entre 0.03 y 0.11
    let tiempoFinal = 20 + Math.random() * 20; // Entre 20 y 40 minutos
    let paso = 0.2 + Math.random() * 0.6; // Entre 0.2 y 0.8
    
    // Actualizar el problema
    document.getElementById('diferencial-problema').innerHTML = `
        Modelar el enfriamiento de una taza de café. Según la ley de enfriamiento de Newton, la tasa de cambio de la temperatura de un objeto es proporcional a la diferencia entre su temperatura y la temperatura ambiente: <code>dT/dt = -k(T - Tₐ)</code>, donde T es la temperatura del objeto, Tₐ es la temperatura ambiente, y k es la constante de enfriamiento.
        <p>Ecuación: <code>dT/dt = -${constanteEnfriamiento.toFixed(3)} * (T - ${tempAmbiente.toFixed(1)})</code></p>
        <p>Condición inicial: <code>T(0) = ${tempInicial.toFixed(1)}°C</code></p>
        <p>Queremos predecir la temperatura después de ${tiempoFinal.toFixed(0)} minutos.</p>
    `;
    
    // Actualizar valores de entrada
    document.getElementById('condicion-inicial').value = tempInicial.toFixed(1);
    document.getElementById('temperatura-ambiente').value = tempAmbiente.toFixed(1);
    document.getElementById('constante-enfriamiento').value = constanteEnfriamiento.toFixed(3);
    document.getElementById('punto-final').value = tiempoFinal.toFixed(0);
    document.getElementById('paso-h').value = paso.toFixed(1);
    
    // Devolver parámetros para usar en cálculos
    return {
        f: (t, y) => -constanteEnfriamiento * (y - tempAmbiente),
        df: (t, y) => -constanteEnfriamiento * (-constanteEnfriamiento * (y - tempAmbiente)), // Derivada de f respecto a y
        tempAmbiente: tempAmbiente,
        constanteEnfriamiento: constanteEnfriamiento
    };
}

// ================ INTERFAZ DE USUARIO ================



// Añade esto al final de la función DOMContentLoaded o crea una función nueva
// Configurar navegación de enlaces del navbar y tarjetas

// Configurar navegación de enlaces del navbar y tarjetas
function configurarNavegacion() {
    // Mapeo de enlaces a IDs de pestañas
    const enlacesMap = {
        '#ecuaciones': 'ecuaciones-tab',
        '#integracion': 'integracion-tab', 
        '#diferenciales': 'diferenciales-tab'
    };
    
    // Función para activar una pestaña por su href
    function activarPestana(href) {
        const tabId = enlacesMap[href];
        if (tabId) {
            const tabButton = document.getElementById(tabId);
            if (tabButton) {
                // Activar la pestaña usando Bootstrap
                const tab = new bootstrap.Tab(tabButton);
                tab.show();
                
                // Actualizar clases activas en el navbar
                document.querySelectorAll('nav .nav-link').forEach(navLink => {
                    navLink.classList.remove('active');
                });
                
                // Activar el enlace correspondiente en el navbar
                const navLink = document.querySelector(`nav a[href="${href}"]`);
                if (navLink) {
                    navLink.classList.add('active');
                }
                
                // Desplazar suavemente a la sección principal
                setTimeout(() => {
                    const mainContent = document.getElementById('main-content');
                    if (mainContent) {
                        mainContent.scrollIntoView({ 
                            behavior: 'smooth' 
                        });
                    }
                }, 100);
            }
        }
    }
    
    // Configurar clics en enlaces del navbar
    document.querySelectorAll('nav .nav-link').forEach(enlace => {
        enlace.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (enlacesMap[href]) {
                e.preventDefault();
                activarPestana(href);
            }
        });
    });
    
    // Configurar botones "Explorar" de las tarjetas - ENFOQUE SIMPLIFICADO
    document.querySelectorAll('.method-card .btn-explorar').forEach((boton, index) => {
        boton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Determinar a qué pestaña debe ir basado en el href del botón
            const href = this.getAttribute('href');
            
            if (href && enlacesMap[href]) {
                activarPestana(href);
            } else {
                // Si no tiene href válido, usar un enfoque alternativo
                let targetHref = '';
                switch(index) {
                    case 0:
                        targetHref = '#ecuaciones';
                        break;
                    case 1:
                        targetHref = '#integracion';
                        break;
                    case 2:
                        targetHref = '#diferenciales';
                        break;
                }
                
                if (targetHref) {
                    activarPestana(targetHref);
                }
            }
        });
    });
    
    // Configurar clics en las pestañas para actualizar navbar
    document.querySelectorAll('#myTab button').forEach(tabButton => {
        tabButton.addEventListener('shown.bs.tab', function(e) {
            // Actualizar navbar cuando se muestra una pestaña
            const target = this.getAttribute('data-bs-target');
            
            document.querySelectorAll('nav .nav-link').forEach(navLink => {
                navLink.classList.remove('active');
                if (navLink.getAttribute('href') === target) {
                    navLink.classList.add('active');
                }
            });
        });
    });
}

// Actualiza el evento DOMContentLoaded para incluir la configuración de navegación
document.addEventListener('DOMContentLoaded', function() {
    // Configurar navegación por pestañas
    document.querySelectorAll('.nav-tabs button').forEach(button => {
        button.addEventListener('click', function() {
            // Actualizar navegación
            document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Configurar selectores de método para cada pestaña
    configurarSelectoresMetodo();
    
    // Configurar botones de cálculo
    configurarBotonesCalculo();
    
    // Configurar botones de cambio de valores
    configurarBotonesCambioValores();
    
    // Configurar botones de reinicio
    configurarBotonesReinicio();
    
    // Configurar navegación (esto es nuevo)
    configurarNavegacion();
    
    // Generar valores iniciales aleatorios
    generarValoresEcuaciones();
    generarValoresIntegracion();
    generarValoresDiferenciales();
});

// Configurar selectores de método
function configurarSelectoresMetodo() {
    // Solución de ecuaciones
    document.getElementById('btn-biseccion').addEventListener('click', function() {
        document.getElementById('controles-biseccion').style.display = 'block';
        document.getElementById('controles-newton').style.display = 'none';
        document.getElementById('explicacion-biseccion').style.display = 'block';
        document.getElementById('explicacion-newton').style.display = 'none';
        
        document.getElementById('btn-biseccion').classList.remove('btn-outline-primary');
        document.getElementById('btn-biseccion').classList.add('btn-primary');
        document.getElementById('btn-newton').classList.remove('btn-primary');
        document.getElementById('btn-newton').classList.add('btn-outline-primary');
    });
    
    document.getElementById('btn-newton').addEventListener('click', function() {
        document.getElementById('controles-biseccion').style.display = 'none';
        document.getElementById('controles-newton').style.display = 'block';
        document.getElementById('explicacion-biseccion').style.display = 'none';
        document.getElementById('explicacion-newton').style.display = 'block';
        
        document.getElementById('btn-biseccion').classList.remove('btn-primary');
        document.getElementById('btn-biseccion').classList.add('btn-outline-primary');
        document.getElementById('btn-newton').classList.remove('btn-outline-primary');
        document.getElementById('btn-newton').classList.add('btn-primary');
    });
    
    // Integración numérica
    document.getElementById('btn-trapecio').addEventListener('click', function() {
        document.getElementById('explicacion-trapecio').style.display = 'block';
        document.getElementById('explicacion-simpson').style.display = 'none';
        
        document.getElementById('btn-trapecio').classList.remove('btn-outline-primary');
        document.getElementById('btn-trapecio').classList.add('btn-primary');
        document.getElementById('btn-simpson').classList.remove('btn-primary');
        document.getElementById('btn-simpson').classList.add('btn-outline-primary');
    });
    
    document.getElementById('btn-simpson').addEventListener('click', function() {
        document.getElementById('explicacion-trapecio').style.display = 'none';
        document.getElementById('explicacion-simpson').style.display = 'block';
        
        document.getElementById('btn-trapecio').classList.remove('btn-primary');
        document.getElementById('btn-trapecio').classList.add('btn-outline-primary');
        document.getElementById('btn-simpson').classList.remove('btn-outline-primary');
        document.getElementById('btn-simpson').classList.add('btn-primary');
    });
    
    // Ecuaciones diferenciales
    document.getElementById('btn-euler').addEventListener('click', function() {
        document.getElementById('explicacion-euler').style.display = 'block';
        document.getElementById('explicacion-taylor').style.display = 'none';
        
        document.getElementById('btn-euler').classList.remove('btn-outline-primary');
        document.getElementById('btn-euler').classList.add('btn-primary');
        document.getElementById('btn-taylor').classList.remove('btn-primary');
        document.getElementById('btn-taylor').classList.add('btn-outline-primary');
    });
    
    document.getElementById('btn-taylor').addEventListener('click', function() {
        document.getElementById('explicacion-euler').style.display = 'none';
        document.getElementById('explicacion-taylor').style.display = 'block';
        
        document.getElementById('btn-euler').classList.remove('btn-primary');
        document.getElementById('btn-euler').classList.add('btn-outline-primary');
        document.getElementById('btn-taylor').classList.remove('btn-outline-primary');
        document.getElementById('btn-taylor').classList.add('btn-primary');
    });
}

// Configurar botones de cálculo
function configurarBotonesCalculo() {
    // Solución de ecuaciones
    document.getElementById('calcular-ecuacion').addEventListener('click', calcularEcuacion);
    
    // Integración numérica
    document.getElementById('calcular-integracion').addEventListener('click', calcularIntegracion);
    
    // Ecuaciones diferenciales
    document.getElementById('calcular-diferencial').addEventListener('click', calcularDiferencial);
}

// Configurar botones de cambio de valores
function configurarBotonesCambioValores() {
    document.getElementById('cambiar-valores-ecuacion').addEventListener('click', function() {
        generarValoresEcuaciones();
        // Limpiar resultados anteriores
        document.getElementById('resultado-ecuaciones').style.display = 'none';
        if (chartEcuaciones) {
            chartEcuaciones.destroy();
            chartEcuaciones = null;
        }
    });
    
    document.getElementById('cambiar-valores-integracion').addEventListener('click', function() {
        generarValoresIntegracion();
        // Limpiar resultados anteriores
        document.getElementById('resultado-integracion').style.display = 'none';
        if (chartIntegracion) {
            chartIntegracion.destroy();
            chartIntegracion = null;
        }
    });
    
    document.getElementById('cambiar-valores-diferencial').addEventListener('click', function() {
        generarValoresDiferenciales();
        // Limpiar resultados anteriores
        document.getElementById('resultado-diferenciales').style.display = 'none';
        if (chartDiferenciales) {
            chartDiferenciales.destroy();
            chartDiferenciales = null;
        }
    });
}

// Configurar botones de reinicio
function configurarBotonesReinicio() {
    document.getElementById('reiniciar-ecuacion').addEventListener('click', function() {
        generarValoresEcuaciones();
        document.getElementById('resultado-ecuaciones').style.display = 'none';
        
        if (chartEcuaciones) {
            chartEcuaciones.destroy();
            chartEcuaciones = null;
        }
    });
    
    document.getElementById('reiniciar-integracion').addEventListener('click', function() {
        generarValoresIntegracion();
        document.getElementById('resultado-integracion').style.display = 'none';
        
        if (chartIntegracion) {
            chartIntegracion.destroy();
            chartIntegracion = null;
        }
    });
    
    document.getElementById('reiniciar-diferencial').addEventListener('click', function() {
        generarValoresDiferenciales();
        document.getElementById('resultado-diferenciales').style.display = 'none';
        
        if (chartDiferenciales) {
            chartDiferenciales.destroy();
            chartDiferenciales = null;
        }
    });
}

// ================ FUNCIONES DE CÁLCULO ================

// Calcular solución de ecuación
// Calcular solución de ecuación
function calcularEcuacion() {
    // Obtener parámetros
    let metodo = document.getElementById('btn-biseccion').classList.contains('btn-primary') ? 'biseccion' : 'newton';
    
    // Obtener los valores actuales y generar la función
    let funcionData = generarValoresEcuaciones();
    let f = funcionData.f;
    let df = funcionData.df;
    
    // Verificar que el intervalo para bisección sea válido
    if (metodo === 'biseccion') {
        let a = parseFloat(document.getElementById('intervalo-a').value);
        let b = parseFloat(document.getElementById('intervalo-b').value);
        let f_a = f(a);
        let f_b = f(b);
        
        if (f_a * f_b >= 0) {
            // Si no hay cambio de signo, ajustar automáticamente el intervalo
            // Buscar un intervalo que contenga una raíz
            let encontrado = false;
            for (let i = 0; i < 10; i++) {
                a = a - 5;
                b = b + 5;
                f_a = f(a);
                f_b = f(b);
                if (f_a * f_b < 0) {
                    document.getElementById('intervalo-a').value = a.toFixed(1);
                    document.getElementById('intervalo-b').value = b.toFixed(1);
                    encontrado = true;
                    break;
                }
            }
            
            if (!encontrado) {
                document.getElementById('resultado-texto').innerHTML = `
                    <div class="alert alert-warning">
                        <strong>Advertencia:</strong> No se pudo encontrar un intervalo con cambio de signo. 
                        Intentando con un intervalo predeterminado.
                    </div>
                `;
                // Usar intervalo predeterminado
                document.getElementById('intervalo-a').value = "0";
                document.getElementById('intervalo-b').value = "50";
            }
        }
    }
    
    // Continuar con el cálculo normal
    let resultado;
    let iteraciones;
    
    if (metodo === 'biseccion') {
        let a = parseFloat(document.getElementById('intervalo-a').value);
        let b = parseFloat(document.getElementById('intervalo-b').value);
        let tolerancia = parseFloat(document.getElementById('tolerancia-biseccion').value);
        let maxIter = parseInt(document.getElementById('max-iteraciones-biseccion').value);
        
        resultado = metodoBiseccion(f, a, b, tolerancia, maxIter);
        iteraciones = resultado.iteraciones;
        
        // Mostrar resultado
        if (resultado.error) {
            document.getElementById('resultado-texto').innerHTML = `
                <div class="alert alert-danger">
                    <strong>Error:</strong> ${resultado.error}<br>
                    <small>Intenta cambiar los valores con el botón "Cambiar Valores" o ajusta manualmente el intervalo.</small>
                </div>
            `;
        } else {
            document.getElementById('resultado-texto').innerHTML = `
                <p><strong>Temperatura de fusión encontrada:</strong> T = ${resultado.raiz.toFixed(2)} °C</p>
                <p><strong>Número de iteraciones:</strong> ${iteraciones.length}</p>
                <p><strong>Error estimado:</strong> ${(resultado.iteraciones[resultado.iteraciones.length-1]?.error || 0).toFixed(6)}</p>
                <p><strong>Significado:</strong> La aleación metálica alcanza su punto de fusión a aproximadamente <strong>${resultado.raiz.toFixed(1)}°C</strong>. A esta temperatura, su resistencia eléctrica alcanza el valor crítico de 20 Ω.</p>
            `;
        }
    } else {
        // Código para Newton-Raphson (sin cambios)
        let x0 = parseFloat(document.getElementById('valor-inicial').value);
        let tolerancia = parseFloat(document.getElementById('tolerancia-newton').value);
        let maxIter = parseInt(document.getElementById('max-iteraciones-newton').value);
        
        resultado = metodoNewton(f, df, x0, tolerancia, maxIter);
        iteraciones = resultado.iteraciones;
        
        // Mostrar resultado
        if (resultado.error) {
            document.getElementById('resultado-texto').innerHTML = `
                <div class="alert alert-danger">${resultado.error}</div>
            `;
        } else {
            document.getElementById('resultado-texto').innerHTML = `
                <p><strong>Temperatura de fusión encontrada:</strong> T = ${resultado.raiz.toFixed(2)} °C</p>
                <p><strong>Número de iteraciones:</strong> ${iteraciones.length}</p>
                <p><strong>Error final:</strong> ${(resultado.iteraciones[resultado.iteraciones.length-1]?.error || 0).toFixed(8)}</p>
                <p><strong>Significado:</strong> La aleación metálica alcanza su punto de fusión a aproximadamente <strong>${resultado.raiz.toFixed(1)}°C</strong>. A esta temperatura, su resistencia eléctrica alcanza el valor crítico de 20 Ω.</p>
            `;
        }
    }
    
    // Resto del código sin cambios...
    // Mostrar tabla de iteraciones
    if (iteraciones.length > 0) {
        let tablaHTML = `
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        ${metodo === 'biseccion' ? 
                            '<th>Iteración</th><th>a</th><th>b</th><th>c</th><th>f(a)</th><th>f(b)</th><th>f(c)</th><th>Error</th>' : 
                            '<th>Iteración</th><th>T</th><th>f(T)</th><th>f\'(T)</th><th>T_nuevo</th><th>Error</th>'}
                    </tr>
                </thead>
                <tbody>
        `;
        
        iteraciones.forEach(item => {
            if (metodo === 'biseccion') {
                tablaHTML += `
                    <tr>
                        <td>${item.iteracion}</td>
                        <td>${item.a.toFixed(4)}</td>
                        <td>${item.b.toFixed(4)}</td>
                        <td>${item.c.toFixed(4)}</td>
                        <td>${item.f_a.toFixed(6)}</td>
                        <td>${item.f_b.toFixed(6)}</td>
                        <td>${item.f_c.toFixed(6)}</td>
                        <td>${item.error.toFixed(8)}</td>
                    </tr>
                `;
            } else {
                tablaHTML += `
                    <tr>
                        <td>${item.iteracion}</td>
                        <td>${item.x.toFixed(4)}</td>
                        <td>${item.f_x.toFixed(6)}</td>
                        <td>${item.df_x.toFixed(6)}</td>
                        <td>${item.x_nuevo.toFixed(4)}</td>
                        <td>${item.error.toFixed(8)}</td>
                    </tr>
                `;
            }
        });
        
        tablaHTML += `</tbody></table>`;
        document.getElementById('tabla-iteraciones').innerHTML = tablaHTML;
    }
    
    // Mostrar resultado
    document.getElementById('resultado-ecuaciones').style.display = 'block';
    
    // Crear gráfico
    crearGraficoEcuaciones(f, resultado.raiz, metodo === 'biseccion' ? 
        {a: parseFloat(document.getElementById('intervalo-a').value), b: parseFloat(document.getElementById('intervalo-b').value)} : 
        {x0: parseFloat(document.getElementById('valor-inicial').value)});
}

// Calcular integración
function calcularIntegracion() {
    // Obtener parámetros
    let metodo = document.getElementById('btn-trapecio').classList.contains('btn-primary') ? 'trapecio' : 'simpson';
    let a = parseFloat(document.getElementById('limite-a').value);
    let b = parseFloat(document.getElementById('limite-b').value);
    let n = parseInt(document.getElementById('n-subintervalos').value);
    
    // Obtener función actual
    let f = generarValoresIntegracion();
    
    let resultado;
    
    if (metodo === 'trapecio') {
        resultado = reglaTrapecio(f, a, b, n);
    } else {
        resultado = reglaSimpson(f, a, b, n);
    }
    
    // Calcular valor "exacto" mediante integración numérica de alta precisión para comparación
    let nExacto = 1000;
    let resultadoExacto = reglaSimpson(f, a, b, nExacto).resultado;
    let error = Math.abs(resultado.resultado - resultadoExacto);
    
    // Mostrar resultado
    document.getElementById('resultado-integracion-texto').innerHTML = `
        <p><strong>Área aproximada:</strong> ${resultado.resultado.toFixed(4)} m²</p>
        <p><strong>Valor de referencia (alta precisión):</strong> ${resultadoExacto.toFixed(4)} m²</p>
        <p><strong>Error absoluto:</strong> ${error.toFixed(6)} m²</p>
        <p><strong>Error relativo:</strong> ${(error/resultadoExacto*100).toFixed(4)}%</p>
        <p><strong>Número de subintervalos:</strong> ${n}</p>
        <p><strong>Significado:</strong> El terreno irregular tiene un área de aproximadamente <strong>${resultado.resultado.toFixed(2)} m²</strong>. Este cálculo es útil para determinar el valor del terreno o la cantidad de materiales necesarios para su preparación.</p>
    `;
    
    document.getElementById('resultado-integracion').style.display = 'block';
    
    // Crear gráfico
    crearGraficoIntegracion(f, a, b, resultado.puntos, metodo);
}

// Calcular ecuación diferencial
function calcularDiferencial() {
    // Obtener parámetros
    let metodo = document.getElementById('btn-euler').classList.contains('btn-primary') ? 'euler' : 'taylor';
    let y0 = parseFloat(document.getElementById('condicion-inicial').value);
    let tFinal = parseFloat(document.getElementById('punto-final').value);
    let h = parseFloat(document.getElementById('paso-h').value);
    
    // Obtener parámetros actuales
    let parametros = generarValoresDiferenciales();
    let f = parametros.f;
    let df = parametros.df;
    let tempAmbiente = parametros.tempAmbiente;
    
    // Calcular número de pasos
    let n = Math.ceil(tFinal / h);
    
    let resultados;
    
    if (metodo === 'euler') {
        resultados = metodoEuler(f, 0, y0, h, n);
    } else {
        resultados = metodoTaylor(f, df, 0, y0, h, n);
    }
    
    // Calcular temperatura final
    let temperaturaFinal = resultados[resultados.length-1].y;
    
    // Calcular solución exacta para comparación
    // Solución exacta de dT/dt = -k(T-Ta) es T(t) = Ta + (T0-Ta)*exp(-k*t)
    let solExacta = (t) => tempAmbiente + (y0 - tempAmbiente) * Math.exp(-parametros.constanteEnfriamiento * t);
    let tempExacta = solExacta(tFinal);
    let error = Math.abs(temperaturaFinal - tempExacta);
    
    // Mostrar resultado
    document.getElementById('resultado-diferenciales-texto').innerHTML = `
        <p><strong>Temperatura final (t = ${tFinal} min):</strong> ${temperaturaFinal.toFixed(2)} °C</p>
        <p><strong>Temperatura exacta (solución analítica):</strong> ${tempExacta.toFixed(2)} °C</p>
        <p><strong>Error absoluto:</strong> ${error.toFixed(4)} °C</p>
        <p><strong>Temperatura ambiente:</strong> ${tempAmbiente.toFixed(1)} °C</p>
        <p><strong>Número de pasos:</strong> ${n}</p>
        <p><strong>Tamaño de paso (h):</strong> ${h}</p>
        <p><strong>Significado:</strong> Después de ${tFinal} minutos, la bebida tendrá una temperatura de aproximadamente <strong>${temperaturaFinal.toFixed(1)}°C</strong>. La temperatura ambiente es ${tempAmbiente.toFixed(1)}°C.</p>
    `;
    
    // Mostrar tabla de resultados
    let tablaHTML = `
        <table class="table table-striped table-hover">
            <thead>
                <tr>
                    <th>Paso</th>
                    <th>t (min)</th>
                    <th>Temperatura (°C)</th>
                    <th>Exacta (°C)</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    resultados.forEach((item, index) => {
        let exacta = solExacta(item.t);
        tablaHTML += `
            <tr>
                <td>${index}</td>
                <td>${item.t.toFixed(2)}</td>
                <td>${item.y.toFixed(2)}</td>
                <td>${exacta.toFixed(2)}</td>
            </tr>
        `;
    });
    
    tablaHTML += `</tbody></table>`;
    document.getElementById('tabla-diferenciales').innerHTML = tablaHTML;
    
    document.getElementById('resultado-diferenciales').style.display = 'block';
    
    // Crear gráfico
    crearGraficoDiferenciales(resultados, metodo, solExacta);
}

// ================ FUNCIONES DE GRÁFICOS ================

// Crear gráfico para solución de ecuaciones
function crearGraficoEcuaciones(f, raiz, parametros) {
    const ctx = document.getElementById('grafico-ecuaciones').getContext('2d');
    
    // Destruir gráfico anterior si existe
    if (chartEcuaciones) {
        chartEcuaciones.destroy();
    }
    
    // Generar datos para la función
    let minX, maxX;
    if (parametros.a !== undefined) {
        minX = Math.min(parametros.a, parametros.b) - 5;
        maxX = Math.max(parametros.a, parametros.b) + 5;
    } else {
        minX = raiz - 15;
        maxX = raiz + 15;
    }
    
    // Asegurar que minX no sea negativo para temperatura
    minX = Math.max(0, minX);
    
    let labels = [];
    let data = [];
    
    for (let x = minX; x <= maxX; x += (maxX - minX) / 50) {
        labels.push(x.toFixed(1));
        data.push(f(x));
    }
    
    // Configurar el gráfico
    chartEcuaciones = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'f(T) = aT² + bT + c',
                data: data,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.1
            },
            {
                label: 'Raíz encontrada',
                data: labels.map((x, i) => Math.abs(f(parseFloat(x))) < 5 ? data[i] : null),
                pointBackgroundColor: '#e74c3c',
                pointBorderColor: '#e74c3c',
                pointRadius: 6,
                pointHoverRadius: 8,
                showLine: false,
                type: 'scatter'
            },
            {
                label: 'Eje x',
                data: labels.map(() => 0),
                borderColor: '#95a5a6',
                borderWidth: 1,
                borderDash: [3, 3],
                fill: false,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Función y raíz encontrada',
                    font: {
                        size: 14
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y.toFixed(4);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Temperatura T (°C)'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'f(T)'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            }
        }
    });
}

// Crear gráfico para integración
function crearGraficoIntegracion(f, a, b, puntos, metodo) {
    const ctx = document.getElementById('grafico-integracion').getContext('2d');
    
    // Destruir gráfico anterior si existe
    if (chartIntegracion) {
        chartIntegracion.destroy();
    }
    
    // Generar datos para la función
    let labels = [];
    let data = [];
    
    for (let x = a; x <= b; x += (b - a) / 100) {
        labels.push(x.toFixed(2));
        data.push(f(x));
    }
    
    // Crear datos para las áreas trapezoidales/parabólicas
    let areaData = new Array(labels.length).fill(null);
    
    puntos.forEach((punto, index) => {
        let idx = Math.round((punto.x - a) / (b - a) * (labels.length - 1));
        if (idx >= 0 && idx < areaData.length) {
            areaData[idx] = punto.y;
        }
    });
    
    // Configurar el gráfico
    chartIntegracion = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
            {
                label: 'Ancho del terreno f(x)',
                data: data,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0
            },
            {
                label: 'Aproximación por ' + (metodo === 'trapecio' ? 'trapecios' : 'parábolas'),
                data: areaData,
                borderColor: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.2)',
                borderWidth: 2,
                fill: true,
                tension: 0,
                pointRadius: 3,
                pointBackgroundColor: '#e74c3c'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Área del terreno irregular',
                    font: {
                        size: 14
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Distancia (metros)'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Ancho (metros)'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    beginAtZero: false
                }
            }
        }
    });
}

// Crear gráfico para ecuaciones diferenciales
function crearGraficoDiferenciales(resultados, metodo, solExacta) {
    const ctx = document.getElementById('grafico-diferenciales').getContext('2d');
    
    // Destruir gráfico anterior si existe
    if (chartDiferenciales) {
        chartDiferenciales.destroy();
    }
    
    // Extraer datos
    let labels = resultados.map(item => item.t.toFixed(1));
    let data = resultados.map(item => item.y);
    
    // Calcular solución exacta para comparación
    let dataExacta = resultados.map(item => solExacta(item.t));
    
    // Configurar el gráfico
    chartDiferenciales = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
            {
                label: 'Solución numérica (' + (metodo === 'euler' ? 'Euler' : 'Taylor') + ')',
                data: data,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.1
            },
            {
                label: 'Solución exacta',
                data: dataExacta,
                borderColor: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.05)',
                borderWidth: 2,
                borderDash: [5, 5],
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Enfriamiento de la bebida',
                    font: {
                        size: 14
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Tiempo (minutos)'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Temperatura (°C)'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            }
        }
    });
}