$(document).ready(function() {
    let dataTable;
    let perfilModal;
    let isEditing = false;

    const API_BASE = '/perfiles/api';
    const ENDPOINTS = {
        list: `${API_BASE}/listar`,
        save: `${API_BASE}/guardar`,
        get: (id) => `${API_BASE}/${id}`,
        delete: (id) => `${API_BASE}/eliminar/${id}`,
        toggleStatus: (id) => `${API_BASE}/cambiar-estado/${id}`,
    };

    // Inicializar tabla
    dataTable = $('#tablaPerfiles').DataTable({
        responsive: true,
        processing: true,
        ajax: {
            url: ENDPOINTS.list,
            dataSrc: 'data'
        },
        columns: [
            { data: 'id' },
            { data: 'nombre' },
            { data: 'descripcion' },
            {
                data: 'estado',
                render: function(data) {
                    return data === 1
                        ? '<span class="badge bg-success">Activo</span>'
                        : '<span class="badge bg-danger">Inactivo</span>';
                }
            },
            {
                data: null,
                render: function(row) {
                    return `
                        <button class="btn btn-primary btn-sm action-edit" data-id="${row.id}">Editar</button>
                        <button class="btn btn-danger btn-sm action-delete" data-id="${row.id}">Eliminar</button>
                        <button class="btn btn-warning btn-sm action-status" data-id="${row.id}">
                            ${row.estado === 1 ? 'Desactivar' : 'Activar'}
                        </button>
                    `;
                }
            }
        ],
        language: {
            url: "//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
        }
    });

    // Handlers
    $('#tablaPerfiles tbody').on('click', '.action-edit', function() {
        const id = $(this).data('id');
        fetch(ENDPOINTS.get(id))
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    $('#id').val(data.data.id);
                    $('#nombre').val(data.data.nombre);
                    $('#descripcion').val(data.data.descripcion);
                    isEditing = true;
                    $('#perfilModal').modal('show');
                }
            });
    });

    $('#tablaPerfiles tbody').on('click', '.action-delete', function() {
        const id = $(this).data('id');
        fetch(ENDPOINTS.delete(id), { method: 'DELETE' })
            .then(res => res.json())
            .then(data => {
                alert(data.message);
                dataTable.ajax.reload();
            });
    });

    $('#tablaPerfiles tbody').on('click', '.action-status', function() {
        const id = $(this).data('id');
        fetch(ENDPOINTS.toggleStatus(id), { method: 'POST' })
            .then(res => res.json())
            .then(data => {
                alert(data.message);
                dataTable.ajax.reload();
            });
    });

    $('#formPerfil').on('submit', function(e) {
        e.preventDefault();
        const perfil = {
            id: $('#id').val() || null,
            nombre: $('#nombre').val(),
            descripcion: $('#descripcion').val(),
            estado: 1
        };
        fetch(ENDPOINTS.save, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(perfil)
        })
            .then(res => res.json())
            .then(data => {
                alert(data.message);
                $('#perfilModal').modal('hide');
                dataTable.ajax.reload();
            });
    });
});