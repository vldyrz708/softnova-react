import './AlbumDetailModal.css'

const fmt = (d) => (d ? String(d).split('T')[0] : '—')

const Field = ({ label, value, pill, full }) => (
  <div className={`pdm-field${pill ? ' pdm-field--pill' : ''}${full ? ' pdm-field--full' : ''}`}>
    <label className="pdm-field-label">{label}</label>
    <span className="pdm-field-value">{value || '—'}</span>
  </div>
)

const AlbumDetailModal = ({ isOpen, album, canEdit, onClose, onEdit, onDelete }) => {
  if (!isOpen || !album) return null

  const imageUrl = album.fotoAlbum
    ? `http://localhost:3000/${album.fotoAlbum}`
    : '/legacy/images/logo.png'

  const stock = Number.isFinite(Number(album.stock)) ? Number(album.stock) : 0
  const inStock = stock > 0

  return (
    <div className="pdm-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="pdm-modal">
        {/* Toolbar: Editar / Eliminar / Cerrar */}
        <div className="pdm-toolbar">
          {canEdit && (
            <>
              <button className="pdm-btn-edit" onClick={() => onEdit(album)}>Editar</button>
              <button className="pdm-btn-delete" onClick={() => onDelete(album)}>Eliminar</button>
            </>
          )}
          <button className="pdm-toolbar-close" onClick={onClose} aria-label="Cerrar">×</button>
        </div>
        {/* X grande flotante */}
        <button className="pdm-exit" onClick={onClose} aria-label="Cerrar">×</button>

        {/* Layout: imagen | info */}
        <div className="pdm-body">
          <div className="pdm-media">
            <div className="pdm-media-frame">
              <img src={imageUrl} alt={album.nombreAlbum} className="pdm-img" />
            </div>
            <p className="pdm-media-note">Explora la ficha completa del producto antes de tomar acciones.</p>
          </div>

          <div className="pdm-info">
            <div className="pdm-grid">
              <Field label="Nombre del álbum" value={album.nombreAlbum} />
              <Field label="Artista / Grupo" value={album.artistaGrupo} />
              <Field label="Versión" value={album.version} />
              <Field label="Fecha de lanzamiento" value={fmt(album.fechaLanzamiento)} />
              <Field label="Idioma" value={Array.isArray(album.idioma) ? album.idioma.join(', ') : album.idioma} />
              <Field label="Duración" value={album.duracion} />
              <Field label="Categoría" value={Array.isArray(album.categoria) ? album.categoria.join(', ') : album.categoria} pill />
              <Field label="Peso" value={album.peso !== undefined && album.peso !== null ? `${album.peso} g` : '—'} />
              <Field label="Precio" value={album.precio !== undefined && album.precio !== null ? `$${album.precio}` : '—'} pill />
              <Field label="Stock" value={inStock ? `${stock} en stock` : 'Sin stock'} pill />
              <Field label="Descripción" value={album.descripcion} full />
              <Field label="Fecha de compra" value={fmt(album.fechaCompra)} />
              <Field label="Fecha límite de venta" value={fmt(album.fechaCaducidad)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlbumDetailModal
