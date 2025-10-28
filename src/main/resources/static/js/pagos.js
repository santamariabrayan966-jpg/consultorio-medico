/**
 * Script para la gestión de pagos
 * Archivo: src/main/resources/static/js/pagos.js
 */
$(document).ready(function () {
    let dataTable;
    let pagoModal = new bootstrap.Modal(document.getElementById('pagoModal'));

    const API_BASE = '/pagos/api';
    const ENDPOINTS = {
        list: `${API_BASE}/listar`,
        save: `${API_BASE}/guardar`,
        get: (id) => `${API_BASE}/${id}`,
        delete: (id) => `${API_BASE}/eliminar/${id}`
    };

    // Inicializar DataTable
    dataTable = $('#tablaPagos').DataTable({
        responsive: true,
        ajax: { url: ENDPOINTS.list, dataSrc: 'data' },
        columns: [
            { data: 'id' },
            { data: 'usuario' },
            { data: 'servicio' },
            { data: 'monto' },
            { data: 'metodo' },
            { data: 'fecha' },
            {
                data: null,
                orderable: false,
                render: (row) => `
                    <button class="btn btn-sm btn-primary action-edit" data-id="${row.id}">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-sm btn-danger action-delete" data-id="${row.id}">
                        <i class="bi bi-trash3-fill"></i>
                    </button>
                `
            }
        ],
        language: { url: "//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json" }
    });

    // Botón nuevo pago
    $('#btnNuevoPago').on('click', function () {
        $('#formPago')[0].reset();
        $('#id').val('');
        pagoModal.show();
    });

    // Guardar pago
    $('#formPago').on('submit', function (e) {
        e.preventDefault();
        const formData = {
            id: $('#id').val(),
            usuario: $('#usuario').val(),
            servicio: $('#servicio').val(),
            monto: $('#monto').val(),
            metodo: $('#metodo').val(),
            fecha: $('#fecha').val()
        };

        fetch(ENDPOINTS.save, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    Swal.fire('Éxito', data.message, 'success');
                    pagoModal.hide();
                    dataTable.ajax.reload();
                } else {
                    Swal.fire('Error', data.message, 'error');
                }
            });
    });

    // Editar
    $('#tablaPagos tbody').on('click', '.action-edit', function () {
        const id = $(this).data('id');
        fetch(ENDPOINTS.get(id))
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    let p = data.data;
                    $('#id').val(p.id);
                    $('#usuario').val(p.usuario);
                    $('#servicio').val(p.servicio);
                    $('#monto').val(p.monto);
                    $('#metodo').val(p.metodo);
                    $('#fecha').val(p.fecha);
                    pagoModal.show();
                } else {
                    Swal.fire('Error', data.message, 'error');
                }
            });
    });

    // Eliminar
    $('#tablaPagos tbody').on('click', '.action-delete', function () {
        const id = $(this).data('id');
        Swal.fire({
            title: '¿Eliminar pago?',
            text: "No podrás revertir esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(result => {
            if (result.isConfirmed) {
                fetch(ENDPOINTS.delete(id), { method: 'DELETE' })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            Swal.fire('Eliminado', data.message, 'success');
                            dataTable.ajax.reload();
                        } else {
                            Swal.fire('Error', data.message, 'error');
                        }
                    });
            }
        });
    });
});
