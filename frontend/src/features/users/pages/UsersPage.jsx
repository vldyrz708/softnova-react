import { useState } from 'react'
import './UsersPage.css'

import ConfirmDialog from '@/components/ui/ConfirmDialog.jsx'
import ErrorState from '@/components/ui/ErrorState.jsx'
import Loader from '@/components/ui/Loader.jsx'
import PageHeader from '@/components/ui/PageHeader.jsx'
import UserFormModal from '../components/UserFormModal.jsx'
import { useCreateUser, useDeleteUser, useUpdateUser, useUsers } from '../hooks.js'
import useAuthStore, { selectAuthUser } from '@/store/auth.js'

const ROL_BADGE = {
  Admin: { bg: '#ede9fe', color: '#5b21b6' },
  Gerente: { bg: '#fef3c7', color: '#92400e' },
  Usuario: { bg: '#d1fae5', color: '#065f46' },
}

const UsersPage = () => {
  const authUser = useAuthStore(selectAuthUser)
  const role = authUser?.rol
  const canCreate = role === 'Admin' || role === 'Gerente'
  const canEdit = role === 'Admin' || role === 'Gerente'
  const canDelete = role === 'Admin'

  const [formOpen, setFormOpen] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const { data, isLoading, isError, refetch } = useUsers()
  const users = data?.users || []

  const createMut = useCreateUser()
  const updateMut = useUpdateUser()
  const deleteMut = useDeleteUser()
  const isSubmitting = createMut.isPending || updateMut.isPending

  function openAdd() { setEditUser(null); setFormOpen(true) }
  function openEdit(user) { setEditUser(user); setFormOpen(true) }

  function handleFormSubmit({ id, payload }) {
    if (id) {
      updateMut.mutate({ id, payload }, { onSuccess: () => setFormOpen(false) })
    } else {
      createMut.mutate(payload, { onSuccess: () => setFormOpen(false) })
    }
  }

  function handleDelete() {
    if (!confirmDelete) return
    deleteMut.mutate(confirmDelete._id, { onSuccess: () => setConfirmDelete(null) })
  }

  return (
    <section>
      <PageHeader
        title="Usuarios"
        description="Gestiona roles y accesos del sistema."
        actions={canCreate && (
          <button className="up-add-btn" onClick={openAdd}>+ Agregar usuario</button>
        )}
      />

      {isLoading && <Loader />}
      {isError && <ErrorState onRetry={refetch} />}

      {!isLoading && !isError && (
        <div className="up-table-wrap">
          <table className="up-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Edad</th>
                <th>Teléfono</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Contraseña</th>
                {(canEdit || canDelete) && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={8} className="up-empty-cell">No hay usuarios registrados.</td></tr>
              ) : (
                users.map((u) => {
                  const badge = ROL_BADGE[u.rol] || { bg: '#f3f4f6', color: '#374151' }
                  return (
                    <tr key={u._id}>
                      <td>{u.nombre || '—'}</td>
                      <td>{u.apellido || '—'}</td>
                      <td>{u.edad ?? '—'}</td>
                      <td>{u.numeroTelefono || '—'}</td>
                      <td>{u.correo || '—'}</td>
                      <td>
                        <span className="up-role-badge" style={{ background: badge.bg, color: badge.color }}>
                          {u.rol}
                        </span>
                      </td>
                      <td className="up-pass">••••••</td>
                      {(canEdit || canDelete) && (
                        <td>
                          <div className="up-actions">
                            {canEdit && (
                              <button className="up-btn-edit" onClick={() => openEdit(u)} title="Editar">✏️</button>
                            )}
                            {canDelete && u._id !== authUser?._id && (
                              <button className="up-btn-delete" onClick={() => setConfirmDelete(u)} title="Eliminar">🗑️</button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      <UserFormModal
        isOpen={formOpen}
        user={editUser}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

      <ConfirmDialog
        isOpen={Boolean(confirmDelete)}
        title="¿Eliminar usuario?"
        message={`Se eliminará a "${confirmDelete?.nombre} ${confirmDelete?.apellido}". Esta acción no se puede deshacer.`}
        confirmLabel="Sí, eliminar"
        danger
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />

    </section>
  )
}

export default UsersPage
