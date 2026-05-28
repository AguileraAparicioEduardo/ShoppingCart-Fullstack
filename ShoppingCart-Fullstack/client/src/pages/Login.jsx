import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='min-h-screen bg-Rose-100 flex items-center justify-center px-4'>
      <div className='bg-Rose-50 rounded-2xl p-8 w-full max-w-md shadow-sm'>

        <h1 className='text-3xl font-bold text-Rose-900 mb-2'>Bienvenido</h1>
        <p className='text-Rose-500 mb-8'>Inicia sesión para continuar</p>

        {error && (
          <div className='bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 mb-6 text-sm'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div className='flex flex-col gap-1'>
            <label className='text-sm font-semibold text-Rose-900'>
              Correo electrónico
            </label>
            <input
              type='email'
              name='email'
              value={form.email}
              onChange={handleChange}
              placeholder='tu@correo.com'
              required
              className='border border-Rose-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-Red transition-colors'
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-sm font-semibold text-Rose-900'>
              Contraseña
            </label>
            <input
              type='password'
              name='password'
              value={form.password}
              onChange={handleChange}
              placeholder='••••••••'
              required
              className='border border-Rose-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-Red transition-colors'
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='bg-Red text-Rose-50 py-3 rounded-full font-semibold mt-2 cursor-pointer hover:bg-Red/90 transition-colors disabled:opacity-60'
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className='text-center text-sm text-Rose-500 mt-6'>
          ¿No tienes cuenta?{' '}
          <Link to='/register' className='text-Red font-semibold hover:underline'>
            Regístrate
          </Link>
        </p>
      </div>
    </main>
  )
}