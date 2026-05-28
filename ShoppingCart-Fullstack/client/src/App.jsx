import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { CardsContainer } from './components/cards-container'
import { Cart } from './components/cart'
import { CartConfirmation } from './components/cart-confirmation'
import { Login } from './pages/Login'
import { Register } from './pages/Register'

const PrivateRoute = ({ children }) => {
  const { token } = useAuth()
  return token ? children : <Navigate to='/login' />
}

function App() {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const { user, logout } = useAuth()

  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/' element={
        <PrivateRoute>
          <main className='flex justify-center'>
            <section className='my-6 px-4 w-full max-w-[1400px]'>

              <div className='flex justify-between items-center mb-6'>
                <h1 className='text-[2.5rem] font-bold text-Rose-900'>
                  Postres
                </h1>
                <div className='flex items-center gap-4'>
                  <span className='text-Rose-500 text-sm'>
                    Hola, <span className='font-bold text-Rose-900'>{user?.name}</span>
                  </span>
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