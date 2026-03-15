import { useEffect, useRef, useState } from 'react'

import './AlbumFormModal.css'

const TODAY = new Date().toISOString().split('T')[0]

function FormField({ label, error, children }) {
  return (
    <div className="pf-field">
      <label className="pf-label">{label}</label>
      {children}
      {error && <span className="pf-error">{error}</span>}
    </div>
  )
}

const VERSIONS = ['Standard', 'Deluxe', 'Limited Edition', 'Special Edition', 'Repackage', 'Mini Album', 'Single']
const IDIOMAS = ['Coreano', 'Japonés', 'Inglés', 'Chino', 'Tailandés', 'Español', 'Otro']
const CATEGORIAS = ['K-Pop', 'J-Pop', 'Boy Group', 'Girl Group', 'Solista', 'Ballad', 'Dance', 'R&B', 'Hip-Hop', 'Rock', 'Indie']

const EMPTY_FORM = {
  nombreAlbum: '', artistaGrupo: '', version: '', fechaLanzamiento: '',
  idioma: '', duracion: '', peso: '', precio: '', stock: '',
  categoria: '', descripcion: '', fechaCompra: '', fechaCaducidad: '',
}

function parsePeso(raw) {
  if (!raw) return ''
  return String(raw).replace(/[^\d]/g, '')
}

function parsePrecio(raw) {
  if (raw === undefined || raw === null || raw === '') return ''
  return String(raw).replace('$', '').trim()
}

function getInitialForm(album) {
  if (!album) return EMPTY_FORM
  return {
    nombreAlbum: album.nombreAlbum || '',
    artistaGrupo: album.artistaGrupo || '',
    version: album.version || '',
    fechaLanzamiento: album.fechaLanzamiento ? String(album.fechaLanzamiento).split('T')[0] : '',
    idioma: Array.isArray(album.idioma) ? album.idioma[0] || '' : album.idioma || '',
    duracion: album.duracion ? String(album.duracion).replace(':', '') : '',
    peso: parsePeso(album.peso),
    precio: parsePrecio(album.precio),
    stock: album.stock !== undefined && album.stock !== null ? String(album.stock) : '',
    categoria: Array.isArray(album.categoria) ? album.categoria[0] || '' : album.categoria || '',
    descripcion: album.descripcion || '',
    fechaCompra: album.fechaCompra ? String(album.fechaCompra).split('T')[0] : '',
    fechaCaducidad: album.fechaCaducidad ? String(album.fechaCaducidad).split('T')[0] : '',
  }
}

const AlbumFormModal = ({ isOpen, album, onClose, onSubmit, isSubmitting }) => {
  const isEdit = Boolean(album?._id)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const fileRef = useRef()

  useEffect(() => {
    if (!isOpen) return
    const t = setTimeout(() => {
      setForm(getInitialForm(album))
      setErrors({})
      setImageFile(null)
      setImagePreview(album?.fotoAlbum ? `http://localhost:3000/${album.fotoAlbum}` : null)
    }, 0)
    return () => clearTimeout(t)
  }, [isOpen, album])

  if (!isOpen) return null

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function validate() {
    const err = {}
    if (!form.nombreAlbum.trim() || form.nombreAlbum.trim().length < 2) err.nombreAlbum = 'Mínimo 2 caracteres'
    if (form.nombreAlbum.trim().length > 100) err.nombreAlbum = 'Máximo 100 caracteres'
    if (!form.artistaGrupo.trim() || form.artistaGrupo.trim().length < 2) err.artistaGrupo = 'Mínimo 2 caracteres'
    if (!form.version) err.version = 'Selecciona una versión'
    if (!form.fechaLanzamiento) err.fechaLanzamiento = 'Fecha requerida'
    else if (form.fechaLanzamiento > TODAY) err.fechaLanzamiento = 'Debe ser ≤ hoy'
    if (!form.idioma) err.idioma = 'Selecciona un idioma'
    if (!form.duracion || String(form.duracion).replace(/\D/g, '').length !== 4) err.duracion = 'Ingresa 4 dígitos (MMSS)'
    const pesoN = parseInt(form.peso)
    if (!form.peso || isNaN(pesoN) || pesoN < 1 || pesoN > 2000) err.peso = 'Entre 1 y 2000 gramos'
    const precioN = parseFloat(form.precio)
    if (!form.precio || isNaN(precioN) || precioN <= 0) err.precio = 'Mayor a 0'
    const stockN = parseInt(form.stock)
    if (form.stock === '' || isNaN(stockN) || stockN < 0 || stockN > 10000) err.stock = 'Entre 0 y 10000'
    if (!form.categoria) err.categoria = 'Selecciona una categoría'
    if (!form.descripcion.trim() || form.descripcion.trim().length < 10) err.descripcion = 'Mínimo 10 caracteres'
    if (form.descripcion.trim().length > 500) err.descripcion = 'Máximo 500 caracteres'
    if (!form.fechaCompra) err.fechaCompra = 'Fecha requerida'
    else if (form.fechaLanzamiento && form.fechaCompra < form.fechaLanzamiento) err.fechaCompra = 'Debe ser ≥ fecha lanzamiento'
    else if (form.fechaCompra > TODAY) err.fechaCompra = 'Debe ser ≤ hoy'
    if (!form.fechaCaducidad) err.fechaCaducidad = 'Fecha requerida'
    else if (form.fechaCompra && form.fechaCaducidad <= form.fechaCompra) err.fechaCaducidad = 'Debe ser > fecha compra'
    else if (form.fechaCaducidad <= TODAY) err.fechaCaducidad = 'Debe ser > hoy'
    if (!isEdit && !imageFile) err.imagen = 'Selecciona una imagen'
    if (imageFile && !imageFile.type.startsWith('image/')) err.imagen = 'Solo imágenes (jpg, png, webp, gif)'
    if (imageFile && imageFile.size > 5 * 1024 * 1024) err.imagen = 'Máximo 5 MB'
    return err
  }

  function handleSubmit(e) {
    e.preventDefault()
    const err = validate()
    setErrors(err)
    if (Object.keys(err).length > 0) return

    const digits = String(form.duracion).replace(/\D/g, '').padStart(4, '0').slice(-4)
    const duracionFormatted = `${digits.slice(0, 2)}:${digits.slice(2)}`

    const fd = new FormData()
    fd.append('nombreAlbum', form.nombreAlbum.trim())
    fd.append('artistaGrupo', form.artistaGrupo.trim())
    fd.append('version', form.version)
    fd.append('fechaLanzamiento', form.fechaLanzamiento)
    fd.append('idioma', form.idioma)
    fd.append('duracion', duracionFormatted)
    fd.append('peso', parseInt(form.peso))
    fd.append('precio', parseFloat(form.precio))
    fd.append('stock', parseInt(form.stock))
    fd.append('categoria', form.categoria)
    fd.append('descripcion', form.descripcion.trim())
    fd.append('fechaCompra', form.fechaCompra)
    fd.append('fechaCaducidad', form.fechaCaducidad)
    if (imageFile) fd.append('fotoAlbum', imageFile)

    onSubmit({ id: album?._id, payload: fd })
  }

  return (
    <div className="pf-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="pf-modal">
        <div className="pf-header">
          <h2>{isEdit ? 'Editar producto' : 'Agregar producto'}</h2>
          <button className="pf-close" onClick={onClose} type="button">×</button>
        </div>
        <form className="pf-form" onSubmit={handleSubmit} noValidate>
          <div className="pf-grid">
            <FormField label="Nombre del álbum *" error={errors.nombreAlbum}>
              <input className={errors.nombreAlbum ? 'err' : ''} value={form.nombreAlbum} onChange={set('nombreAlbum')} maxLength={100} placeholder="Ej: BORN PINK" />
            </FormField>
            <FormField label="Artista / Grupo *" error={errors.artistaGrupo}>
              <input className={errors.artistaGrupo ? 'err' : ''} value={form.artistaGrupo} onChange={set('artistaGrupo')} maxLength={80} placeholder="Ej: BLACKPINK" />
            </FormField>
            <FormField label="Versión *" error={errors.version}>
              <select className={errors.version ? 'err' : ''} value={form.version} onChange={set('version')}>
                <option value="">Selecciona...</option>
                {VERSIONS.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </FormField>
            <FormField label="Idioma *" error={errors.idioma}>
              <select className={errors.idioma ? 'err' : ''} value={form.idioma} onChange={set('idioma')}>
                <option value="">Selecciona...</option>
                {IDIOMAS.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </FormField>
            <FormField label="Fecha de lanzamiento *" error={errors.fechaLanzamiento}>
              <input type="date" className={errors.fechaLanzamiento ? 'err' : ''} value={form.fechaLanzamiento} max={TODAY} onChange={set('fechaLanzamiento')} />
            </FormField>
            <FormField label="Duración (MMSS) *" error={errors.duracion}>
              <input
                className={errors.duracion ? 'err' : ''}
                value={form.duracion}
                maxLength={4}
                placeholder="Ej: 0345"
                inputMode="numeric"
                onChange={(e) => setForm((f) => ({ ...f, duracion: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
              />
            </FormField>
            <FormField label="Peso (gramos) *" error={errors.peso}>
              <input type="number" className={errors.peso ? 'err' : ''} value={form.peso} min={1} max={2000} onChange={set('peso')} placeholder="Ej: 350" inputMode="numeric" />
            </FormField>
            <FormField label="Precio ($) *" error={errors.precio}>
              <input type="number" className={errors.precio ? 'err' : ''} value={form.precio} min={0.01} step={0.01} onChange={set('precio')} placeholder="Ej: 299.99" inputMode="decimal" />
            </FormField>
            <FormField label="Stock *" error={errors.stock}>
              <input type="number" className={errors.stock ? 'err' : ''} value={form.stock} min={0} max={10000} onChange={set('stock')} placeholder="Ej: 50" inputMode="numeric" />
            </FormField>
            <FormField label="Categoría *" error={errors.categoria}>
              <select className={errors.categoria ? 'err' : ''} value={form.categoria} onChange={set('categoria')}>
                <option value="">Selecciona...</option>
                {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>
            <FormField label="Descripción *" error={errors.descripcion}>
              <textarea
                className={errors.descripcion ? 'err' : ''}
                value={form.descripcion}
                onChange={set('descripcion')}
                maxLength={500}
                rows={3}
                placeholder="Describe el álbum (mín. 10 caracteres)"
              />
            </FormField>
            <FormField label="Fecha de compra *" error={errors.fechaCompra}>
              <input type="date" className={errors.fechaCompra ? 'err' : ''} value={form.fechaCompra} max={TODAY} min={form.fechaLanzamiento || undefined} onChange={set('fechaCompra')} />
            </FormField>
            <FormField label="Fecha límite de venta *" error={errors.fechaCaducidad}>
              <input type="date" className={errors.fechaCaducidad ? 'err' : ''} value={form.fechaCaducidad} min={form.fechaCompra || undefined} onChange={set('fechaCaducidad')} />
            </FormField>
            <FormField label={isEdit ? 'Imagen del álbum (opcional)' : 'Imagen del álbum *'} error={errors.imagen}>
              <input ref={fileRef} type="file" accept="image/*" className={errors.imagen ? 'err' : ''} onChange={handleImage} />
              {imagePreview && (
                <img src={imagePreview} alt="preview" className="pf-preview-img" />
              )}
            </FormField>
          </div>
          <div className="pf-footer">
            <button type="button" className="pf-btn-cancel" onClick={onClose} disabled={isSubmitting}>Cancelar</button>
            <button type="submit" className="pf-btn-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Registrar producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AlbumFormModal
