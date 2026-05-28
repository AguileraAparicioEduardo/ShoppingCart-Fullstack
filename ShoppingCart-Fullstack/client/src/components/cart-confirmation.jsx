import { useCart } from '../context/CartContext'
import { CartButton } from './cart-button'

export const CartConfirmation = ({ onClose }) => {
  const { cart, total, clearCart } = useCart()

  const handleNewOrder = () => {
    clearCart()
    onClose()
  }

  return (
    <dialog
      open
      onClick={onClose}
      className='bg-black/50 w-full fixed h-screen inset-0 grid place-content-center z-50'
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className='w-[327px] md:w-[592px] py-10 px-6 bg-white rounded-xl relative'
      >
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-Rose-400 hover:text-Rose-900 transition-colors text-xl font-bold cursor-pointer'
        >
          ✕
        </button>

        <img src='/assets/images/icon-order-confirmed.svg' alt='order confirmed' className='mb-6' />
        <h2 className='text-[2.5rem] font-bold leading-tight'>Order Confirmed</h2>
        <p className='text-Rose-500 mb-8'>We hope you enjoy your food!</p>

        <div className='bg-Rose-50 rounded-xl px-4 mb-6'>
          {cart.map(item => {
            const numericPrice = parseFloat(item.price)
            return (
              <div key={item.name} className='border-b border-Rose-100 py-4 flex justify-between items-center'>
                <div className='flex gap-4 items-center'>
                  <img className='size-12 rounded-md object-cover' src={item.image.thumbnail} alt={item.name} />
                  <div>
                    <h3 className='font-semibold text-sm'>{item.name}</h3>
                    <div className='flex gap-2 mt-1'>
                      <p className='text-Red font-semibold text-sm'>{item.quantity}x</p>
                      <p className='text-Rose-500 text-sm'>@${numericPrice.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                <p className='font-bold text-Rose-900'>${(numericPrice * item.quantity).toFixed(2)}</p>
              </div>
            )
          })}

          <div className='flex justify-between items-center py-6'>
            <p className='text-sm'>Order Total</p>
            <p className='text-2xl font-bold'>${parseFloat(total).toFixed(2)}</p>
          </div>
        </div>

        <CartButton text='Start New Order' onClick={handleNewOrder} />
      </div>
    </dialog>
  )
}