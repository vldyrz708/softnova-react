import { useState } from 'react'
import useAuthStore from '@/store/auth.js'

const Account = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    correo: user?.correo || '',
    numeroTelefono: user?.numeroTelefono || '',
    rol: user?.rol || ''
  })
  const clearSession = useAuthStore((state) => state.clearSession)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    // Here you would typically call an API to update the user
    // For now, we'll just update the local state
    alert('Funcionalidad de actualización de perfil próximamente disponible')
    setIsEditing(false)
  }

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      clearSession()
    }
  }

  return (
    <div className="account-container">
      <h2>Mi Cuenta</h2>

      <div className="account-info">
        <div className="user-avatar">
          <div className="avatar-placeholder">
            {user?.nombre?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        </div>

        <div className="user-details">
          {!isEditing ? (
            <div className="info-display">
              <div className="info-item">
                <label>Nombre:</label>
                <span>{user?.nombre || 'No especificado'}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{user?.correo || 'No especificado'}</span>
              </div>
              <div className="info-item">
                <label>ID de cuenta:</label>
                <span>{user?.id || user?._id || 'No especificado'}</span>
              </div>
              <div className="info-item">
                <label>Teléfono:</label>
                <span>{user?.numeroTelefono || 'No especificado'}</span>
              </div>
              <div className="info-item">
                <label>Rol:</label>
                <span>{user?.rol || 'No especificado'}</span>
              </div>
              <div className="info-item">
                <label>Estado:</label>
                <span className="status-active">Activo</span>
              </div>
            </div>
          ) : (
            <div className="info-edit">
              <div className="form-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Teléfono:</label>
                <input
                  type="tel"
                  name="numeroTelefono"
                  value={formData.numeroTelefono}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Rol:</label>
                <select name="rol" value={formData.rol} onChange={handleInputChange}>
                  <option value="Usuario">Usuario (Cajero)</option>
                  <option value="Admin">Admin</option>
                  <option value="Gerente">Gerente</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="account-actions">
        {!isEditing ? (
          <button className="edit-btn" onClick={() => setIsEditing(true)}>
            Editar Perfil
          </button>
        ) : (
          <div className="edit-actions">
            <button className="save-btn" onClick={handleSave}>
              Guardar Cambios
            </button>
            <button className="cancel-btn" onClick={() => setIsEditing(false)}>
              Cancelar
            </button>
          </div>
        )}

        <button className="logout-btn" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>

      <div className="account-stats">
        <h3>Estadísticas</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Ventas realizadas hoy:</span>
            <span className="stat-value">0</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total vendido hoy:</span>
            <span className="stat-value">$0.00</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Productos en carrito:</span>
            <span className="stat-value">0</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Productos favoritos:</span>
            <span className="stat-value">0</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Account
