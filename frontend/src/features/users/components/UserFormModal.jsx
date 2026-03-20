import { useEffect, useState } from 'react'
import '../css/UserFormModal.css'

const ROLES = ['Usuario', 'Gerente', 'Admin']

function FormField({ label, error, children }) {
  return (
    <div className="uf-field">
      <label className="uf-label">{label}</label>
      {children}
      {error && <span className="uf-error">{error}</span>}
    </div>
  )
}

const EMPTY = {
  nombre: '', apellido: '', edad: '', numeroTelefono: '',
  correo: '', rol: 'Usuario', contrasena: '',
}

function getInitial(user) {
  if (!user) return EMPTY
  return {
    nombre: user.nombre || '',
    apellido: user.apellido || '',
    edad: user.edad !== undefined && user.edad !== null ? String(user.edad) : '',
    numeroTelefono: user.numeroTelefono || '',
    correo: user.correo || '',
    rol: user.rol || 'Usuario',
    contrasena: '',
  }
}

const UserFormModal = ({ isOpen, user, onClose, onSubmit, isSubmitting }) => {
  const isEdit = Boolean(user?._id)
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!isOpen) return
    const t = setTimeout(() => {
      setForm(getInitial(user))
      setErrors({})
    }, 0)
    return () => clearTimeout(t)
  }, [isOpen, user])

  if (!isOpen) return null

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  function validate() {
    const err = {}
    if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{2,}$/.test(form.nombre.trim())) err.nombre = 'Solo letras, mínimo 2 caracteres'
    if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{2,}$/.test(form.apellido.trim())) err.apellido = 'Solo letras, mínimo 2 caracteres'
    const edadN = Number(form.edad)
    if (!Number.isInteger(edadN) || edadN < 16 || edadN > 99) err.edad = 'Entre 16 y 99 años'
    if (!/^[0-9]{7,15}$/.test(form.numeroTelefono.trim())) err.numeroTelefono = '7 a 15 dígitos'
    if (!/.+@.+\..+/.test(form.correo)) err.correo = 'Correo inválido'
    if (!form.rol) err.rol = 'Selecciona un rol'
    if (!isEdit && form.contrasena.length < 6) err.contrasena = 'Mínimo 6 caracteres'
    if (isEdit && form.contrasena && form.contrasena.length < 6) err.contrasena = 'Mínimo 6 caracteres'
    return err
  }

  function handleSubmit(e) {
    e.preventDefault()
    const err = validate()
    setErrors(err)
    if (Object.keys(err).length > 0) return

    const payload = {
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      edad: Number(form.edad),
      numeroTelefono: form.numeroTelefono.trim(),
      correo: form.correo.trim(),
      rol: form.rol,
    }
    if (form.contrasena) payload.contrasena = form.contrasena

    onSubmit({ id: user?._id, payload })
  }

  return (
    <div className="uf-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="uf-modal">
        <div className="uf-header">
          <h2>{isEdit ? 'Editar usuario' : 'Agregar usuario'}</h2>
          <button className="uf-close" onClick={onClose} type="button">×</button>
        </div>
        <form className="uf-form" onSubmit={handleSubmit} noValidate>
          <FormField label="Nombre *" error={errors.nombre}>
            <input className={errors.nombre ? 'err' : ''} value={form.nombre} onChange={set('nombre')} placeholder="Ej: María" />
          </FormField>
          <FormField label="Apellidos *" error={errors.apellido}>
            <input className={errors.apellido ? 'err' : ''} value={form.apellido} onChange={set('apellido')} placeholder="Ej: Pérez" />
          </FormField>
          <div className="uf-row">
            <FormField label="Edad *" error={errors.edad}>
              <input type="number" className={errors.edad ? 'err' : ''} value={form.edad} onChange={set('edad')} min={16} max={99} placeholder="Ej: 25" inputMode="numeric" />
            </FormField>
            <FormField label="Teléfono *" error={errors.numeroTelefono}>
              <input type="tel" className={errors.numeroTelefono ? 'err' : ''} value={form.numeroTelefono} onChange={set('numeroTelefono')} placeholder="Ej: 5512345678" inputMode="numeric" />
            </FormField>
          </div>
          <FormField label="Correo *" error={errors.correo}>
            <input type="email" className={errors.correo ? 'err' : ''} value={form.correo} onChange={set('correo')} placeholder="usuario@dominio.com" />
          </FormField>
          <FormField label="Rol *" error={errors.rol}>
            <select className={errors.rol ? 'err' : ''} value={form.rol} onChange={set('rol')}>
              {ROLES.map((r) => (
                <option key={r} value={r}>{r === 'Usuario' ? 'Usuario (Cajero)' : r}</option>
              ))}
            </select>
          </FormField>
          <FormField label={isEdit ? 'Contraseña (dejar vacío para no cambiar)' : 'Contraseña *'} error={errors.contrasena}>
            <input
              type="password"
              className={errors.contrasena ? 'err' : ''}
              value={form.contrasena}
              onChange={set('contrasena')}
              placeholder="Mínimo 6 caracteres"
              minLength={6}
            />
          </FormField>
          <div className="uf-footer">
            <button type="button" className="uf-cancel" onClick={onClose} disabled={isSubmitting}>Cancelar</button>
            <button type="submit" className="uf-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserFormModal
