import { useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { CardsContainer } from './components/cards-container'
import { Cart } from './components/cart'
import { CartConfirmation } from './components/cart-confirmation'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Admin } from './pages/Admin'

const PrivateRoute = ({ children }) => {
  const { token } = useAuth()
  return token ? children : <Navigate to='/login' />
}

const AdminRoute = ({ children }) => {
  const { token, user } = useAuth()
  if (!token) return <Navigate to='/login' />
  if (user?.role !== 'admin') return <Navigate to='/' />
  return children
}

function App() {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />

      <Route path='/admin' element={
        <AdminRoute>
          <Admin />
        </AdminRoute>
      } />

      <Route path='/' element={
        <PrivateRoute>
          <main className='flex justify-center'>
            <section className='my-6 px-4 w-full max-w-[1400px]'>

              <div className='flex justify-between items-center mb-6'>
                <h1 className='text-[2.5rem] font-bold text-Rose-900'>Postres</h1>
                <div className='flex items-center gap-4'>
                  <span className='text-Rose-500 text-sm'>
                    Hola, <span className='font-bold text-Rose-900'>{user?.name}</span>
                  </span>
                  {user?.role === 'admin' && (
                    <button
                      onClick={() => navigate('/admin')}
                      className='text-sm bg-Rose-900 text-Rose-50 px-4 py-1.5 rounded-full hover:bg-Rose-800 transition-colors cursor-pointer font-semibold'
                    >
                      ⚙ Admin
                    </button>
                  )}
                  <button
                    onClick={logout}
                    className='text-sm text-Red hover:underline cursor-pointer font-semibold'
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>

              <div className='desktop:flex desktop:gap-8 desktop:items-start'>
                <CardsContainer />
                <Cart onConfirm={() => setShowConfirmation(true)} />
              </div>
            </section>

            {showConfirmation && (
              <CartConfirmation onClose={() => setShowConfirmation(false)} />
            )}
          </main>
        </PrivateRoute>
      } />
    </Routes>
  )
}

export default App