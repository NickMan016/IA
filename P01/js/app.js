const pisos = document.getElementById("pisos"),
    cajones = document.getElementById("cajones"),
    init = document.getElementById("btn-init"),
    destroy = document.getElementById("btn-destroy"),
    reset = document.getElementById("btn-reset"),
    estacinamiento = document.getElementById("estacionamiento");
destroy.disabled = true;
reset.disabled = true;

// Variable para ejecutar o no el Agente Inteligente
let ejecutarAgenteInteligente = false;
const cajonesOcupados = [];

// Componente para notificación
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2500,
})

const alerta = (icono, titulo) => {
    Toast.fire({
        icon: icono,
        title: titulo
    })
}

// Función para asignar cajón aleatoriamente
const asignarCajon = (totalCajones, intentos) => {
    // Generacion de número aleatorio para asignar un cajón
    const cajonBusqueda = Math.floor((Math.random() * (totalCajones - 1 + 1)) + 1);
    // Comprobación si el cajón está ocupado para ejecutar nuevamente la bísqueda
    if (cajonesOcupados.includes(cajonBusqueda))
        return asignarCajon(totalCajones, intentos + 1);
    // Comprobación de intentos de recursión para asiganr primer cajón disponible
    else if (intentos === 5) {
        for (let index = 1; index <= totalCajones; index++) {
            if (!cajonesOcupados.includes(index)) {
                return index;
            }
        }
    // Retorno del cajón disponible
    } else
        return cajonBusqueda;
}

// Función para mostrar llegada de auto
const estacionarAuto = (cajonEstacionamiento) => {
    const autoEstacionamiento = document.createElement('span');
    autoEstacionamiento.classList.add('absolute');
    autoEstacionamiento.classList.add('bottom-2');
    autoEstacionamiento.classList.add('text-4xl');
    autoEstacionamiento.classList.add('-translate-x-1/2');
    autoEstacionamiento.classList.add('left-1/2');
    autoEstacionamiento.innerHTML = '<i class="fa-solid fa-car-side"></i>'
    cajonEstacionamiento.append(autoEstacionamiento);

    alerta('info', 'Un auto ha llegado');
}

// Función para mostrar auto estacionado
const guardarAuto = (cajonEstacionamiento, cajonAsignado) => {
    alerta('success', `Auto guardado en el cajón ${cajonAsignado}`);
    cajonEstacionamiento.innerHTML = 'Estacionamiento';
    const cajon = document.getElementById(`cajon-${cajonAsignado}`);
    const autoCajon = document.createElement('span');
    autoCajon.classList.add('absolute');
    autoCajon.classList.add('bottom-2');
    autoCajon.classList.add('text-4xl');
    autoCajon.classList.add('-translate-x-1/2');
    autoCajon.classList.add('left-1/2');
    autoCajon.innerHTML = '<i class="fa-solid fa-car"></i>'
    cajon.classList.remove('border-green-600');
    cajon.classList.add('border-red-600');
    cajon.append(autoCajon);
}

// Función del agente inteligente
const agenteInteligente = (totalCajones) => {
    // Comprobando si se continua ejecutando el Agente Inteligente
    if (ejecutarAgenteInteligente) {
        // Mostrar la llegada de un auto
        const cajonEstacionamiento = document.getElementById('cajon-estacionamiento');
        estacionarAuto(cajonEstacionamiento);

        setTimeout(() => {
            // Ejecución si el estacionamiento esta lleno
            if (totalCajones === cajonesOcupados.length) {
                alerta('error', 'Ya no hay ningún cajón disponible');
                reset.disabled = false;
                destroy.disabled = true;
                ejecutarAgenteInteligente = false;
                cajonEstacionamiento.innerHTML = 'Estacionamiento';
            // Ejecución si el estacionamiento no esta lleno
            } else {
                // Asignación de cajón
                const cajonAsignado = asignarCajon(totalCajones, 1);
                cajonesOcupados.push(cajonAsignado);
                alerta('success', `Cajón ${cajonAsignado} disponible`);
                setTimeout(() => {
                    // Mostrar el auto estacionado
                    guardarAuto(cajonEstacionamiento, cajonAsignado);

                    setTimeout(() => {
                        // Volver a ejecutar el agente inteligente para guardae más autos
                        agenteInteligente(totalCajones);
                    }, 3500);
                }, 3500);
            }
        }, 3500);
    } else {
        alerta('error', 'Agente Inteligente finalizado')
    }
}

// Validación de input de Cajones
cajones.addEventListener('keyup', ({ target }) => {
    const { value } = target

    if (parseInt(value) > 12) {
        cajones.classList.remove('border-gray-600');
        cajones.classList.add('border-red-600');
    } else {
        cajones.classList.remove('border-red-600');
        cajones.classList.add('border-gray-600');
    }
})

// Evento de botón Inicializar
init.addEventListener('click', (e) => {
    e.preventDefault();

    const numeroPisos = parseInt(pisos.value);
    const numeroCajones = parseInt(cajones.value);
    ejecutarAgenteInteligente = true;

    if (numeroCajones > 12) {
        Swal.fire({
            title: 'Error',
            text: 'El limite de cajones es de 12.',
            icon: 'error',
            color: '#fff',
            background: 'rgb(17, 24, 39)',
            backdrop: 'rgba(0, 0, 0, .3)',
            showConfirmButton: false,
            timer: 3500
        })
    } else {
        estacinamiento.innerHTML = '';
        init.disabled = true;
        destroy.disabled = false;

        Swal.fire({
            title: 'Calculando...',
            text: 'Asignando cajones.',
            timer: 3500,
            color: '#fff',
            background: 'rgb(17, 24, 39)',
            backdrop: 'rgba(0, 0, 0, .3)',
            allowOutsideClick: false,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading()
            }
        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {

                const grid = document.createElement('div');
                grid.classList.add('grid')
                grid.classList.add(`grid-cols-${numeroCajones}`)
                grid.classList.add(`grid-rows-${numeroPisos + 1}`)
                grid.classList.add('gap-1')
                grid.classList.add('mt-2')

                for (let index = 1; index <= (numeroCajones * numeroPisos); index++) {
                    const cajon = document.createElement('div');
                    cajon.classList.add("relative");
                    cajon.classList.add("border-2");
                    cajon.classList.add("border-green-600");
                    cajon.classList.add("h-24");
                    cajon.classList.add("text-center");
                    cajon.classList.add("text-sm");
                    cajon.id = `cajon-${index}`
                    cajon.innerHTML = `Cajón ${index}`;

                    grid.append(cajon);
                }

                const cajonEstacionamiento = document.createElement('div');
                cajonEstacionamiento.classList.add("relative");
                cajonEstacionamiento.classList.add("border-2");
                cajonEstacionamiento.classList.add("border-gray-600");
                cajonEstacionamiento.classList.add("h-24");
                cajonEstacionamiento.classList.add("text-center");
                cajonEstacionamiento.classList.add("text-lg");
                cajonEstacionamiento.classList.add(`col-span-${numeroCajones}`);
                cajonEstacionamiento.id = 'cajon-estacionamiento'
                cajonEstacionamiento.innerHTML = 'Estacionamiento';

                grid.append(cajonEstacionamiento);

                estacinamiento.append(grid)

                setTimeout(() => {
                    agenteInteligente((numeroCajones * numeroPisos));
                }, 1000);
            }
        })
    }

});

// Evento de botón Finalizar
destroy.addEventListener('click', (e) => {
    e.preventDefault();
    ejecutarAgenteInteligente = false;
    reset.disabled = false;
    destroy.disabled = true;
});

// Evento de botón Resetear
reset.addEventListener('click', (e) => {
    e.preventDefault();
    estacinamiento.innerHTML = '';
    reset.disabled = true;
    init.disabled = false;

    cajonesOcupados = [];
    pisos.value = '1';
    cajones.value = '1';
});