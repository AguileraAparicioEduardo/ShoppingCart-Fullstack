import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const API = import.meta.env.VITE_API_URL

export const Admin = () => {
  const { token, user, logout } = useAuth()
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  // Form state
  const [form, setForm] = useState({
    name: '', category: '', price: '', availability: true
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const authHeaders = { Authorization: `Bearer ${token}` }

  // ── Fetch products ──
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API}/api/admin/products`, { headers: authHeaders })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setProducts(data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  // ── Toggle availability ──
  const toggleAvailability = async (id, current) => {
    try {
      const res = await fetch(`${API}/api/admin/products/${id}/availability`, {
        method: 'PATCH',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ availability: !current })
      })
      if (!res.ok) throw new Error('Error al actualizar')
      setProducts(prev => prev.map(p =>
        p.id === id ? { ...p, availability: !current } : p
      ))
    } catch (err) {
      setError(err.message)
    }
  }

  // ── Delete product ──
  const deleteProduct = async (id, name) => {
    if (!confirm(`¿Eliminar "${name}"?`)) return
    try {
      const res = await fetch(`${API}/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: authHeaders
      })
      if (!res.ok) throw new Error('Error al eliminar')
      setProducts(prev => prev.filter(p => p.id !== id))
      showSuccess('Producto eliminado correctamente')
    } catch (err) {
      setError(err.message)
    }
  }

  // ── Handle image selection ──
  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  // ── Submit new product ──
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('category', form.category)
      formData.append('price', form.price)
      formData.append('availability', form.availability)
      if (imageFile) formData.append('image', imageFile)

      const res = await fetch(`${API}/api/admin/products`, {
        method: 'POST',
        headers: authHeaders, // NO Content-Type — multer lo maneja
        body: formData
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      setProducts(prev => [data.data, ...prev])
      setForm({ name: '', category: '', price: '', availability: true })
      setImageFile(null)
      setImagePreview(null)
      showSuccess('Producto creado correctamente')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const showSuccess = (msg) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(null), 3000)
  }

  return (
    <main className='min-h-screen bg-Rose-100'>

      {/* Header */}
      <header className='bg-Rose-900 text-Rose-50 px-6 py-4 flex justify-between items-center'>
        <div className='flex items-center gap-4'>
          <button
            onClick={() => navigate('/')}
            className='text-Rose-300 hover:text-Rose-50 text-sm transition-colors'
          >
            ← Volver a la tienda
          </button>
          <h1 className='text-xl font-bold'>Panel de Administración</h1>
        </div>
        <div className='flex items-center gap-4'>
          <span className='text-Rose-300 text-sm'>
            Admin: <span className='text-Rose-50 font-semibold'>{user?.name}</span>
          </span>
          <button
            onClick={() => { logout(); navigate('/login') }}
            className='text-sm text-Red hover:underline'
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className='max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8'>

        {/* Alerts */}
        {error && (
          <div className='bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 text-sm flex justify-between'>
            {error}
            <button onClick={() => setError(null)} className='font-bold'>✕</button>
          </div>
        )}
        {successMsg && (
          <div className='bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 text-sm'>
            ✓ {successMsg}
          </div>
        )}

        {/* ── Formulario nuevo producto ── */}
        <section className='bg-Rose-50 rounded-2xl p-6 shadow-sm'>
          <h2 className='text-xl font-bold text-Rose-900 mb-6'>Agregar Nuevo Producto</h2>

          <form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-6'>

            {/* Columna izquierda */}
            <div className='flex flex-col gap-4'>
              <div className='flex flex-col gap-1'>
                <label className='text-sm font-semibold text-Rose-900'>Nombre *</label>
                <input
                  type='text'
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder='Ej: Waffle with Berries'
                  required
                  className='border border-Rose-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-Red transition-colors'
                />
              </div>

              <div className='flex flex-col gap-1'>
                <label className='text-sm font-semibold text-Rose-900'>Categoría</label>
                <input
                  type='text'
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  placeholder='Ej: Waffle, Cake, Brownie'
                  className='border border-Rose-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-Red transition-colors'
                />
              </div>

              <div className='flex flex-col gap-1'>
                <label className='text-sm font-semibold text-Rose-900'>Precio (USD) *</label>
                <input
                  type='number'
                  step='0.01'
                  min='0.01'
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  placeholder='0.00'
                  required
                  className='border border-Rose-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-Red transition-colors'
                />
              </div>

              <div className='flex items-center gap-3'>
                <input
                  type='checkbox'
                  id='availability'
                  checked={form.availability}
                  onChange={e => setForm({ ...form, availability: e.target.checked })}
                  className='w-4 h-4 accent-Red'
                />
                <label htmlFor='availability' className='text-sm font-semibold text-Rose-900'>
                  Disponible
                </label>
              </div>
            </div>

            {/* Columna derecha — imagen */}
            <div className='flex flex-col gap-4'>
              <label className='text-sm font-semibold text-Rose-900'>Imagen del producto</label>

              <label className='border-2 border-dashed border-Rose-300 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-Red transition-colors min-h-[180px]'>
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt='Preview'
                    className='max-h-[160px] object-contain rounded-lg'
                  />
                ) : (
                  <div className='flex flex-col items-center gap-2 text-Rose-400'>
                    <span className='text-4xl'>📷</span>
                    <span className='text-sm'>Clic para seleccionar imagen</span>
                    <span className='text-xs'>JPG, PNG, WEBP — máx 5MB</span>
                  </div>
                )}
                <input
                  type='file'
                  accept='image/jpeg,image/png,image/webp'
                  onChange={handleImage}
                  className='hidden'
                />
              </label>

              {imagePreview && (
                <button
                  type='button'
                  onClick={() => { setImageFile(null); setImagePreview(null) }}
                  className='text-xs text-Rose-400 hover:text-red-500 underline self-start'
                >
                  Quitar imagen
                </button>
              )}
            </div>

            {/* Submit */}
            <div className='md:col-span-2'>
              <button
                type='submit'
                disabled={submitting}
                className='bg-Red text-Rose-50 px-8 py-3 rounded-full font-semibold hover:bg-Red/90 transition-colors disabled:opacity-60 cursor-pointer'
              >
                {submitting ? 'Guardando...' : '+ Agregar Producto'}
              </button>
            </div>
          </form>
        </section>

        {/* ── Tabla de productos ── */}
        <section className='bg-Rose-50 rounded-2xl p-6 shadow-sm'>
          <h2 className='text-xl font-bold text-Rose-900 mb-6'>
            Productos existentes
            <span className='ml-2 text-sm font-normal text-Rose-400'>
              ({products.length} total)
            </span>
          </h2>

          {loading ? (
            <p className='text-Rose-400 text-sm'>Cargando productos...</p>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b border-Rose-200'>
                    <th className='text-left py-3 px-2 text-Rose-500 font-semibold'>Imagen</th>
                    <th className='text-left py-3 px-2 text-Rose-500 font-semibold'>Nombre</th>
                    <th className='text-left py-3 px-2 text-Rose-500 font-semibold'>Categoría</th>
                    <th className='text-left py-3 px-2 text-Rose-500 font-semibold'>Precio</th>
                    <th className='text-left py-3 px-2 text-Rose-500 font-semibold'>Disponible</th>
                    <th className='text-left py-3 px-2 text-Rose-500 font-semibold'>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id} className='border-b border-Rose-100 hover:bg-Rose-100/50 transition-colors'>
                      <td className='py-3 px-2'>
                        {product.image?.thumbnail ? (
                          <img
                            src={product.image.thumbnail}
                            alt={product.name}
                            className='w-12 h-12 object-cover rounded-lg'
                          />
                        ) : (
                          <div className='w-12 h-12 bg-Rose-200 rounded-lg flex items-center justify-center text-Rose-400 text-xs'>
                            Sin img
                          </div>
                        )}
                      </td>
                      <td className='py-3 px-2 font-semibold text-Rose-900'>{product.name}</td>
                      <td className='py-3 px-2 text-Rose-500'>{product.category || '—'}</td>
                      <td className='py-3 px-2 text-Rose-900'>${parseFloat(product.price).toFixed(2)}</td>
                      <td className='py-3 px-2'>
                        <button
                          onClick={() => toggleAvailability(product.id, product.availability)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                            product.availability
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-red-100 text-red-600 hover:bg-red-200'
                          }`}
                        >
                          {product.availability ? 'Disponible' : 'No disponible'}
                        </button>
                      </td>
                      <td className='py-3 px-2'>
                        <button
                          onClick={() => deleteProduct(product.id, product.name)}
                          className='text-red-500 hover:text-red-700 font-semibold text-xs transition-colors cursor-pointer'
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {products.length === 0 && (
                <p className='text-center text-Rose-400 py-8'>No hay productos registrados</p>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}