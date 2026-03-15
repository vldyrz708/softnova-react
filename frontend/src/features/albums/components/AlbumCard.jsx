import './AlbumCard.css'

const formatDate = (d) => (d ? String(d).split('T')[0] : '—')

const AlbumCard = ({ album, onViewDetail }) => {
  const imageUrl = album.fotoAlbum
    ? `http://localhost:3000/${album.fotoAlbum}`
    : '/legacy/images/logo.png'

  const stock = Number.isFinite(Number(album.stock)) ? Number(album.stock) : 0
  const inStock = stock > 0

  return (
    <article className="pc-card">
      <div className="pc-img-wrap">
        <img src={imageUrl} alt={album.nombreAlbum || 'Álbum'} loading="lazy" />
      </div>
      <div className="pc-body">
        <h6 className="pc-title">{album.nombreAlbum || 'Sin título'}</h6>
        <p><strong>Artista:</strong> {album.artistaGrupo || '—'}</p>
        <p><strong>Categoría:</strong> {Array.isArray(album.categoria) ? album.categoria.join(', ') : album.categoria || '—'}</p>
        <p><strong>Versión:</strong> {album.version || '—'}</p>
        <p><strong>Lanzamiento:</strong> {formatDate(album.fechaLanzamiento)}</p>
        <div className="pc-stock">
          <span className={`pc-dot ${inStock ? 'pc-dot--in' : 'pc-dot--out'}`} />
          <span className={`pc-stock-label ${inStock ? 'pc-dot--in' : 'pc-dot--out'}`}>
            {inStock ? `${stock} en stock` : 'Sin stock'}
          </span>
        </div>
        <button className="pc-btn" onClick={() => onViewDetail(album)}>Ver detalles</button>
      </div>
    </article>
  )
}

export default AlbumCard