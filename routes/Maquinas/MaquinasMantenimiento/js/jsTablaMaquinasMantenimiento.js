let currentPage = 1;
const itemsPerPage = 8;
let filtrarMaquinas = []; // Variable para almacenar las maquinas filtradas

// Función para actualizar la tabla con los maquinas paginados
window.actualizarTabla = function (maquinas) {
    filtrarMaquinas = maquinas; // Guardar datos filtrados
    currentPage = 1; // Reiniciar a la primera página
    displayMaquinas();
    actualizarTotalMaquinas();
};

// Función para formatear fechas a "YYYY-MM-DD"
function formatDate(fecha) {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toISOString().split('T')[0]; // Extrae solo la parte de la fecha
}

// Función para mostrar los maquinas en la tabla con paginación
function displayMaquinas() {
    const tbody = document.querySelector("#tablamaquinas tbody");
    tbody.innerHTML = '';

    if (filtrarMaquinas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center;">No se encontraron resultados</td></tr>`;
        actualizarPaginacion();
        return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const maquinasPaginadas = filtrarMaquinas.slice(startIndex, endIndex);

    maquinasPaginadas.forEach(maquina => {
        const fila = document.createElement('tr');

        // Si el modo oscuro está activado, aplica la clase especial a la fila
        if (document.body.classList.contains("dark-mode")) {
            fila.classList.add("fila-dark");
        }

        fila.innerHTML = `
            <td>${maquina.nombrecorresponsal || 'N/A'}</td>
            <td>${maquina.imeiacercademac || 'N/A'}</td>
            <td>${maquina.codigoseta || 'N/A'}</td>
            <td>${maquina.tecnologia || 'N/A'}</td>
            <td>${maquina.lider || 'N/A'}</td>
            <td>${maquina.estado || 'N/A'}</td>
            <td>
                <i class="fas fa-edit" style="cursor: pointer;" onclick="editMaquina(${maquina.id})"></i>
            </td>
        `;
        tbody.appendChild(fila);
    });

    actualizarPaginacion();
}

let maquinaSeleccionadaId = null;


// Función para cargar los datos en el formulario al hacer clic en el icono de seleccionar
function editMaquina(id) {
    document.getElementById("maquinaId").value = id;
    const maquina = filtrarMaquinas.find(c => c.id == id);

    if (maquina) {
        // Llenar los datos de la máquina en el formulario
        Object.keys(maquina).forEach((campo) => {
            const input = document.getElementById(campo);
            if (input) input.value = maquina[campo] || '';
        });

        // Formatear la fecha si existe
        const fechaInput = document.getElementById("fecha");
        if (maquina.fecha && fechaInput) {
            fechaInput.value = new Date(maquina.fecha).toISOString().split('T')[0];
        }

        // Llamar a la función que obtiene el historial de envíos
        cargarHistorialEnvios(id);
    }
}

// Función para actualizar el total de maquinas
function actualizarTotalMaquinas() {
    document.getElementById("totalCount").innerText = filtrarMaquinas.length;
}

// Función para actualizar la paginación
function actualizarPaginacion() {
    const totalPages = Math.ceil(filtrarMaquinas.length / itemsPerPage);
    document.getElementById("pageNumber").textContent = `Página ${currentPage} de ${totalPages || 1}`;

    document.getElementById("prevPage").disabled = currentPage === 1;
    document.getElementById("nextPage").disabled = currentPage >= totalPages;
}

// Función para avanzar a la siguiente página
document.getElementById("nextPage").addEventListener("click", () => {
    const totalPages = Math.ceil(filtrarMaquinas.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayMaquinas();
    }
});

// Función para retroceder a la página anterior
document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        displayMaquinas();
    }
});

// Función para limpiar la tabla y reiniciar la paginación
document.getElementById("btnLimpiar").addEventListener("click", () => {
    setTimeout(() => {
        const tableMotivoEnvio = document.getElementById("tablahistorialmantenimiento");
        const tableMaquinas = document.getElementById("tablamaquinas");

        // LIMPIAR TABLA 'tablahistorialmantenimiento'
        if (tableMotivoEnvio) {
            while (tableMotivoEnvio.rows.length > 1) {
                tableMotivoEnvio.deleteRow(1); // Siempre borra la segunda fila hasta que solo quede el encabezado
            }
            console.log("✅ Tabla 'tablahistorialmantenimiento' limpiada.");
        } else {
            console.warn("⚠️ No se encontró la tabla 'tablahistorialmantenimiento'.");
        }

        // LIMPIAR TABLA 'tablamaquinas'
        if (tableMaquinas) {
            while (tableMaquinas.rows.length > 1) {
                tableMaquinas.deleteRow(1); // Borra todas las filas menos el encabezado
            }
            console.log("✅ Tabla 'tablamaquinas' limpiada.");
        } else {
            console.warn("⚠️ No se encontró la tabla 'tablamaquinas'.");
        }

        // Limpiar el campo oculto
        document.getElementById("maquinaId").value = "";

        // ACTUALIZAR TOTAL DE MÁQUINAS A 0
        document.getElementById("totalCount").textContent = "0";

    }, 300);
});

// Mantén la tabla vacía al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector("#tablamaquinas tbody");
    tableBody.innerHTML = `<tr><td colspan="8" style="text-align: center;">No se encontraron resultados</td></tr>`;
});


document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("btnExportExcel")?.addEventListener("click", exportToExcel);
});

async function exportToExcel() {
    if (filtrarMaquinas.length === 0) {
        Swal.fire({
            icon: "warning",
            title: "Sin datos",
            text: "No hay datos para exportar.",
        });
        return;
    }

    const workbook = new ExcelJS.Workbook(); // Usa ExcelJS directamente
    const worksheet = workbook.addWorksheet("maquinas");

    const headers = [
            'Tecnologia', 'imeiacercademac', 'Placa', 'Serial', 'Lider', 'Sim / Internet',
            'Cédula', 'Nombre Corresponsal', 'Codigo seta', 'Estado', 'Fecha creación', 'Ubicación'
    ];

    worksheet.addRow(headers);

    filtrarMaquinas.forEach(maquina => {
        worksheet.addRow([
            maquina.tecnologia || 'N/A',
            maquina.imeiacercademac || 'N/A',
            maquina.placa || 'N/A',
            maquina.serial || 'N/A',
            maquina.lider || 'N/A',
            maquina.siminternet || 'N/A',
            maquina.cedula || 'N/A',
            maquina.nombrecorresponsal || 'N/A',
            maquina.codigoseta || 'N/A',
            maquina.estado || 'N/A',
            formatDate(maquina.fecha),
            maquina.ubicacion || 'N/A',
        ]);
    });

    // Aplicar estilos a los encabezados
    worksheet.getRow(1).eachCell((cell) => {
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "DCE6F1" }, // Azul claro
        };
        cell.font = { bold: true };
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" }
        };
    });

    // Aplicar bordes a todas las celdas con datos
    worksheet.eachRow((row) => {
        row.eachCell((cell) => {
            // Centrar texto y habilitar ajuste de texto
            cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    
            // Aplicar bordes a cada celda
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" }
            };
        });
    });    

    // Ajustar automáticamente el ancho de las columnas
    worksheet.columns.forEach((column, index) => {
        column.width = headers[index].length + 5;
    });

    // Guardar el archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Maquinas.xlsx";
    link.click();
}