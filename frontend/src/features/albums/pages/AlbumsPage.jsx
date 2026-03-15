import { useMemo, useState } from 'react'

import './AlbumsPage.css'
import ConfirmDialog from '@/components/ui/ConfirmDialog.jsx'
import ErrorState from '@/components/ui/ErrorState.jsx'
import Loader from '@/components/ui/Loader.jsx'
import PageHeader from '@/components/ui/PageHeader.jsx'
import AlbumCard from '../components/AlbumCard.jsx'
import AlbumDetailModal from '../components/AlbumDetailModal.jsx'
import AlbumFormModal from '../components/AlbumFormModal.jsx'
import { useAlbums, useCreateAlbum, useDeleteAlbum, useUpdateAlbum } from '../hooks.js'
import useAuthStore, { selectAuthUser } from '@/features/auth/store.js'

const AlbumsPage = () => {
  const user = useAuthStore(selectAuthUser)
  const canEdit = user?.rol === 'Admin'

  const [search, setSearch] = useState('')
  const [detailAlbum, setDetailAlbum] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editAlbum, setEditAlbum] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const { data, isLoading, isError, refetch } = useAlbums()
  const albums = data?.albums || []

  const createMut = useCreateAlbum()
  const updateMut = useUpdateAlbum()
  const deleteMut = useDeleteAlbum()
  const isSubmitting = createMut.isPending || updateMut.isPending

  const filtered = useMemo(() => {
    if (!search.trim()) return albums
    const term = search.toLowerCase()
    return albums.filter(
      (a) =>
        (a.nombreAlbum || '').toLowerCase().includes(term) ||
        (a.artistaGrupo || '').toLowerCase().includes(term) ||
        (Array.isArray(a.categoria) ? a.categoria.join(' ') : a.categoria || '').toLowerCase().includes(term) ||
        (a.version || '').toLowerCase().includes(term),
    )
  }, [albums, search])

  function openAdd() {
    setEditAlbum(null)
    setFormOpen(true)
  }
  function openEdit(album) {
    setDetailAlbum(null)
    setEditAlbum(album)
    setFormOpen(true)
  }
  function openDeleteConfirm(album) {
    setDetailAlbum(null)
    setConfirmDelete(album)
  }

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
        title="Catálogo de álbumes"
        description={canEdit ? 'Gestiona existencias, precios y vigencias.' : 'Consulta el catálogo disponible.'}
        actions={
          <div className="al-actions">
            <input
              className="al-search"
              placeholder="Buscar por nombre, artista, categoría…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {canEdit && (
              <button className="al-add-btn" onClick={openAdd}>+ Agregar producto</button>
            )}
          </div>
        }
      />

      {isLoading && <Loader />}
      {isError && <ErrorState onRetry={refetch} />}

      {!isLoading && !isError && (
        filtered.length === 0 ? (
          <p className="al-empty-text">
            {search ? `No se encontraron resultados para "${search}"` : 'No hay productos registrados.'}
          </p>
        ) : (
          <div className="al-grid">
            {filtered.map((album) => (
              <AlbumCard key={album._id} album={album} onViewDetail={setDetailAlbum} />
            ))}
          </div>
        )
      )}

      <AlbumDetailModal
        isOpen={Boolean(detailAlbum)}
        album={detailAlbum}
        canEdit={canEdit}
        onClose={() => setDetailAlbum(null)}
        onEdit={openEdit}
        onDelete={openDeleteConfirm}
      />

      <AlbumFormModal
        isOpen={formOpen}
        album={editAlbum}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

      <ConfirmDialog
        isOpen={Boolean(confirmDelete)}
        title="¿Eliminar producto?"
        message={`Se eliminará "${confirmDelete?.nombreAlbum}". Esta acción no se puede deshacer.`}
        confirmLabel="Sí, eliminar"
        danger
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />

    </section>
  )
}

export default AlbumsPage
