console.log('Hola 🔥');

//Referencias HTML
const serverOnline = document.querySelector('#serverOnline')
const serverOffline = document.querySelector('#serverOffline')
const txtMensaje = document.querySelector('#txtMensaje')
const btnEnviar = document.querySelector('#btnEnviar')
const btnBorrar = document.querySelector('#btnBorrar')

// Referencias Tabla
const registros = document.querySelector('#registros')
const fecha = document.querySelector('#fecha')
const hora = document.querySelector('#hora')
const mensaje = document.querySelector('#mensaje');

const socketClient = io();

socketClient.on('connect', () => {
    serverOffline.classList.add('hidden');
    console.log('Conectado 👌');
});

socketClient.on('disconnect', () => {
    serverOnline.classList.add('hidden');
    console.log('Desconectado 👎');
});

// Insertar mensaje desde servidor
socketClient.on('res-ser', (resp, row, id) => {
    console.log('🟡 Servidor respondio', resp);
    const item = `
    <tr id="fila${row + (resp.hora).substr(-2)}" class="bg-white border-b dark:bg-gray-800 
        dark:border-gray-700 transition-all ease-in">
        <td class="py-3 px-6 text-sm font-medium text-gray-900 whitespace-nowrap 
        dark:text-white">${id}</td>
        <td class="py-3 px-6 text-sm font-medium text-gray-900 whitespace-nowrap 
        dark:text-white">${resp.fecha}</td>
        <td class="py-3 px-6 text-sm font-medium text-gray-900 whitespace-nowrap 
        dark:text-white">${resp.hora}</td>
        <td class="py-3 px-6 text-sm font-medium text-gray-900 w-full whitespace-pre-wrap
        dark:text-white">${resp.data}</td>
        <td id="tdBorrar" class="py-3 px-6 text-sm font-medium text-right whitespace-nowrap">
            <button id="btnBorrar" class="text-blue-600 dark:text-blue-500 hover:underline">
                borrar
            </button>
        </td>
    </tr>`;
    registros.innerHTML += item;
});

// Borrar mensajes desde servidor
socketClient.on('borrado:mensajes', (row) => {
    const fila = document.querySelector(`#${row}`);
    fila.classList.remove('dark:bg-gray-800');
    fila.classList.add('bg-red-500');
    fila.innerHTML = `
    <td class="py-3 px-6 text-sm font-medium text-gray-900 whitespace-nowrap 
    dark:text-white"></td>
    <td class="py-3 px-6 text-sm font-medium text-gray-900 whitespace-nowrap 
    dark:text-white"></td>
    <td class="py-3 px-6 text-sm font-medium text-gray-900 whitespace-nowrap 
    dark:text-white">🚩</td>
    <td class="py-3 px-6 text-sm font-medium text-gray-900 whitespace-nowrap 
    dark:text-white">Mensaje borrado!</td>
    <td id="tdBorrar" class="py-3 px-6 text-sm font-medium text-right whitespace-nowrap">
    </td>`;
})

// Enviar mensaje a servidor
function sendMessage() {
    const mensaje = txtMensaje.value;
    if (!mensaje) {
        return null;
    } else {
        const payload = {
            data: mensaje,
            fecha: new Date().toLocaleDateString(),
            hora: new Date().toLocaleTimeString()
        };
        socketClient.emit('enviar-mensaje', payload, (id) => {
            console.log('🚩 Callback Server', id);
        });
        txtMensaje.value = '';
    }
};

// Borrar registro a servidor
document.addEventListener('click', (element) => {
    if (element.target.id != 'btnBorrar') {
        return null;
    } else {
        const id = element.target.closest('tr').id;
        socketClient.emit('borrado:mensajes', id);
        console.log('🚩 closest', id);
    }
});
