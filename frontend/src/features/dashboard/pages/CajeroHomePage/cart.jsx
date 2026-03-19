import { useState } from 'react'
import { useCreateSale } from '@/features/sales/hooks.js'
import { formatCurrency } from '@/utils/format.js'

const Cart = ({ cartItems, onRemove, onUpdateQuantity, total, onClearCart }) => {
  const [customerInfo, setCustomerInfo] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    notas: ''
  })
  const createSaleMutation = useCreateSale()

  const handleQuantityChange = (itemId, newQuantity) => {
    const quantity = parseInt(newQuantity) || 0
    onUpdateQuantity(itemId, quantity)
  }

  const handleCheckout = async () => {
    if (cartItems.length === 0) return

    if (!customerInfo.nombre || !customerInfo.correo) {
      alert('Por favor completa la información del cliente')
      return
    }

    try {
      await Promise.all(
        cartItems.map((item) =>
          createSaleMutation.mutateAsync({
            albumId: item.id || item._id,
            cantidad: item.quantity,
            notas: customerInfo.notas || ''
          })
        )
      )

      alert('Venta realizada exitosamente!')
      onClearCart()
      setCustomerInfo({ nombre: '', correo: '', telefono: '', notas: '' })
    } catch (error) {
      alert('Error al procesar la venta: ' + (error?.message || 'Revisa la conexión'))
    }
  }

  return (
    <div className="cart-container">
      <h2>Mi Carrito de Compras</h2>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>No hay productos en el carrito</p>
          <p>Agrega productos desde el catálogo para comenzar.</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id || item._id} className="cart-item">
                <div className="item-info">
                  <h3>{item.nombreAlbum || item.nombre || 'Sin título'}</h3>
                  <p>{item.artistaGrupo || item.artista || '—'}</p>
                  <p className="item-price">{formatCurrency(item.precio)}</p>
                </div>
                <div className="item-controls">
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleQuantityChange(item.id || item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id || item._id, e.target.value)}
                    />
                    <button
                      onClick={() => handleQuantityChange(item.id || item._id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <p className="item-subtotal">
                    Subtotal: {formatCurrency((item.precio || 0) * item.quantity)}
                  </p>
                  <button
                    className="remove-btn"
                    onClick={() => onRemove(item.id || item._id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-total">
            <h3>Total: {formatCurrency(total)}</h3>
          </div>

          <div className="customer-info">
            <h3>Información del Cliente</h3>
            <div className="form-group">
              <label>Nombre *</label>
              <input
                type="text"
                value={customerInfo.nombre}
                onChange={(e) => setCustomerInfo((prev) => ({ ...prev, nombre: e.target.value }))}
                placeholder="Nombre del cliente"
                required
              />
            </div>
            <div className="form-group">
              <label>Correo *</label>
              <input
                type="email"
                value={customerInfo.correo}
                onChange={(e) => setCustomerInfo((prev) => ({ ...prev, correo: e.target.value }))}
                placeholder="email@ejemplo.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="tel"
                value={customerInfo.telefono}
                onChange={(e) => setCustomerInfo((prev) => ({ ...prev, telefono: e.target.value }))}
                placeholder="5512345678"
              />
            </div>
            <div className="form-group">
              <label>Notas (opcional)</label>
              <textarea
                value={customerInfo.notas}
                onChange={(e) => setCustomerInfo((prev) => ({ ...prev, notas: e.target.value }))}
                placeholder="Ej. Cliente prefiere factura"
                rows={3}
              />
            </div>
          </div>

          <div className="checkout-actions">
            <button
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={createSaleMutation.isPending}
            >
              {createSaleMutation.isPending ? 'Procesando...' : 'Realizar Venta'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Cart
