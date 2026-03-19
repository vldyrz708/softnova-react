import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useAuthStore from '@/store/auth.js'
import { useAlbums } from '@/features/albums/hooks.js'
import Cart from './cart.jsx'
import Favorites from './favorites.jsx'
import Account from './account.jsx'
import './styles.css'

const CajeroHomePage = () => {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)

  const [activeTab, setActiveTab] = useState('albums')
  const [cart, setCart] = useState([])
  const [favorites, setFavorites] = useState([])

  const userKey = useMemo(() => user?.id || user?._id || 'guest', [user])

  // Persist cart + favorites per user
  useEffect(() => {
    const savedCart = localStorage.getItem(`cart_${userKey}`)
    const savedFavorites = localStorage.getItem(`favorites_${userKey}`)

    if (savedCart) setCart(JSON.parse(savedCart))
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites))
  }, [userKey])

  useEffect(() => {
    if (!userKey) return
    localStorage.setItem(`cart_${userKey}`, JSON.stringify(cart))
    localStorage.setItem(`favorites_${userKey}`, JSON.stringify(favorites))
  }, [cart, favorites, userKey])

  const { data, isLoading, isError } = useAlbums({ limit: 50 })
  const albums = data?.albums || []

  const albumId = (album) => album.id || album._id

  const addToCart = (album) => {
    const id = albumId(album)
    setCart((prev) => {
      const exists = prev.find((item) => item.id === id)
      if (exists) {
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...album, id, quantity: 1 }]
    })
  }

  const removeFromCart = (albumId) => {
    setCart((prev) => prev.filter((item) => item.id !== albumId))
  }

  const clearCart = () => setCart([])

  const updateCartQuantity = (albumId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(albumId)
      return
    }

    setCart((prev) =>
      prev.map((item) =>
        item.id === albumId ? { ...item, quantity } : item
      )
    )
  }

  const addToFavorites = (album) => {
    const id = albumId(album)
    setFavorites((prev) => {
      if (prev.some((item) => item.id === id)) return prev
      return [...prev, { ...album, id }]
    })
  }

  const removeFromFavorites = (albumId) => {
    setFavorites((prev) => prev.filter((item) => item.id !== albumId))
  }

  const isInFavorites = (albumId) => favorites.some((item) => item.id === albumId)

  const getTotalCart = () =>
    cart.reduce((total, item) => total + (Number(item.precio) || 0) * item.quantity, 0)

  if (!user) {
    return (
      <div className="cajero-login-required">
        <h2>Inicia sesión para acceder</h2>
        <p>Tu carrito y favoritos estarán disponibles una vez que inicies sesión.</p>
        <button onClick={() => navigate('/login')}>Iniciar sesión</button>
      </div>
    )
  }

  return (
    <div className="cajero-dashboard">
      <header className="cajero-header">
        <h1>Panel de Cajero - {user.nombre || user.correo}</h1>
        <nav className="cajero-nav">
          <button
            className={activeTab === 'albums' ? 'active' : ''}
            onClick={() => setActiveTab('albums')}
          >
            Productos
          </button>
          <button
            className={activeTab === 'cart' ? 'active' : ''}
            onClick={() => setActiveTab('cart')}
          >
            Carrito ({cart.reduce((sum, item) => sum + item.quantity, 0)})
          </button>
          <button
            className={activeTab === 'favorites' ? 'active' : ''}
            onClick={() => setActiveTab('favorites')}
          >
            Favoritos ({favorites.length})
          </button>
          <button
            className={activeTab === 'account' ? 'active' : ''}
            onClick={() => setActiveTab('account')}
          >
            Mi Cuenta
          </button>
        </nav>
      </header>

      <main className="cajero-main">
        {activeTab === 'albums' && (
          <section className="albums-section">
            <h2>Catálogo</h2>
            <p>Selecciona productos para agregarlos al carrito o a tus favoritos.</p>

            {isLoading && <p>Cargando productos…</p>}
            {isError && <p>Error al cargar productos.</p>}

            <div className="albums-grid">
              {albums.map((album) => {
                const id = albumId(album)
                const inFavorites = isInFavorites(id)

                return (
                  <article key={id} className="album-card">
                    <div className="album-card__media">
                      <img
                        src={album.fotoAlbum ? `http://localhost:3000/${album.fotoAlbum}` : '/legacy/images/logo.png'}
                        alt={album.nombreAlbum || 'Álbum'}
                      />
                    </div>
                    <div className="album-card__body">
                      <h3>{album.nombreAlbum}</h3>
                      <p className="album-artist">{album.artistaGrupo}</p>
                      <p className="album-price">{Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(album.precio)}</p>
                      <div className="album-actions">
                        <button className="btn-secondary" onClick={() => addToCart(album)}>
                          Agregar al carrito
                        </button>
                        <button
                          className={`btn-link ${inFavorites ? 'active' : ''}`}
                          onClick={() => (inFavorites ? removeFromFavorites(id) : addToFavorites(album))}
                        >
                          {inFavorites ? 'Quitar favorito' : 'Agregar favorito'}
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}

              {albums.length === 0 && !isLoading && (
                <div className="empty-state">
                  <p>No hay productos disponibles</p>
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === 'cart' && (
          <Cart
            cartItems={cart}
            onRemove={removeFromCart}
            onUpdateQuantity={updateCartQuantity}
            total={getTotalCart()}
            onClearCart={clearCart}
          />
        )}

        {activeTab === 'favorites' && (
          <Favorites
            favorites={favorites}
            onRemove={removeFromFavorites}
            onAddToCart={addToCart}
          />
        )}

        {activeTab === 'account' && <Account user={user} />}
      </main>
    </div>
  )
}

export default CajeroHomePage
