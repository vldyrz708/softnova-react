import { formatCurrency } from '@/utils/format.js'

const Favorites = ({ favorites, onRemove, onAddToCart }) => {
  if (!favorites || favorites.length === 0) {
    return (
      <div className="favorites-container">
        <h2>Mis Favoritos</h2>
        <div className="empty-favorites">
          <p>No tienes favoritos aún</p>
          <p>Marca productos como favorito desde el catálogo para encontrarlos aquí.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="favorites-container">
      <h2>Mis Favoritos</h2>
      <div className="favorites-grid">
        {favorites.map((item) => {
          const id = item.id || item._id
          return (
            <div key={id} className="favorite-item">
              <div className="item-image">
                {item.fotoAlbum ? (
                  <img src={`http://localhost:3000/${item.fotoAlbum}`} alt={item.nombreAlbum || 'Álbum'} />
                ) : (
                  <div className="image-placeholder">🎵</div>
                )}
              </div>
              <div className="item-details">
                <h3>{item.nombreAlbum || item.nombre || 'Sin título'}</h3>
                <p className="price">{formatCurrency(item.precio)}</p>
                <p className="stock">{item.stock ? `${item.stock} en stock` : 'Sin stock'}</p>
              </div>
              <div className="item-actions">
                <button
                  className="add-to-cart-btn"
                  onClick={() => onAddToCart(item)}
                  disabled={item.stock <= 0}
                >
                  Agregar al carrito
                </button>
                <button className="remove-favorite-btn" onClick={() => onRemove(id)}>
                  Quitar favorito
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="favorites-summary">
        <p>
          Total favoritos: <strong>{favorites.length}</strong>
        </p>
      </div>
    </div>
  )
}

export default Favorites
