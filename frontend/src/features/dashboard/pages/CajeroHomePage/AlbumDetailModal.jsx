import './styles.css'

const AlbumDetailModal = ({ isOpen, album, onClose, onAddToCart, onToggleFavorite, inFavorites }) => {
  if (!isOpen || !album) return null

  const imageUrl = album.fotoAlbum ? `http://localhost:3000/${album.fotoAlbum}` : '/legacy/images/logo.png'
  const stock = Number.isFinite(Number(album.stock)) ? Number(album.stock) : 0

  return (
    <div
      className="cajero-modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="cajero-modal">
        <header className="cajero-modal__header">
          <h2>Detalle del producto</h2>
          <button className="cajero-modal__close" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </header>

        <div className="cajero-modal__content">
          <div className="cajero-modal__media">
            <img src={imageUrl} alt={album.nombreAlbum || 'Producto'} />
          </div>
          <div className="cajero-modal__info">
            <h3>{album.nombreAlbum || 'Sin título'}</h3>
            <p className="cajero-modal__artist">{album.artistaGrupo || 'Sin artista'}</p>
            <p className="cajero-modal__price">
              {Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(album.precio)}
            </p>
            <p className="cajero-modal__stock">
              {stock > 0 ? `${stock} en stock` : 'Sin stock'}
            </p>
            <p className="cajero-modal__description">{album.descripcion || 'Sin descripción'}</p>

            <div className="cajero-modal__actions">
              <button
                className="btn-secondary"
                onClick={() => onAddToCart(album)}
                disabled={stock <= 0}
              >
                Agregar al carrito
              </button>

              <button
                className={`btn-link ${inFavorites ? 'active' : ''}`}
                onClick={() => onToggleFavorite(album)}
              >
                {inFavorites ? 'Quitar favorito' : 'Agregar favorito'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlbumDetailModal
