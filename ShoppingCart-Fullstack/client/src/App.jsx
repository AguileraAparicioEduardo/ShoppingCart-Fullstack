import { useState } from 'react'
import { CardsContainer } from './components/cards-container'
import { Cart } from './components/cart'
import { CartConfirmation } from './components/cart-confirmation'

function App() {
  const [showConfirmation, setShowConfirmation] = useState(false)

  return (
    <main className='flex justify-center'>
      <section className='my-6 px-4'>
        <h1 className='text-[2.5rem] font-bold mb-[30px]'>Desserts</h1>
        <div className='desktop:flex desktop:gap-8 desktop:items-start'>
          <CardsContainer />
          <Cart onConfirm={() => setShowConfirmation(true)} />
        </div>
      </section>

      {showConfirmation && (
        <CartConfirmation onClose={() => setShowConfirmation(false)} />
      )}
    </main>
  )
}

export default App