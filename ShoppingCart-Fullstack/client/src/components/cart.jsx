import { useCart } from '../context/CartContext'
import { CartItem } from './cart-item'
import { CartButton } from './cart-button'

export const Cart = ({ onConfirm }) => {
  const { cart, total, totalItems } = useCart()

  return (
    <div className='bg-Rose-50 p-6 rounded-xl w-[327px] md:w-[380px]'>
      <h2 className='text-Red font-bold text-2xl mb-6'>Your Cart ({totalItems})</h2>

      {cart.length === 0 ? (
        <div className='flex flex-col items-center py-8 gap-4'>
          <img src='/assets/images/illustration-empty-cart.svg' alt='' />
          <p className='text-Rose-500 text-sm font-semibold'>Your added items will appear here</p>
        </div>
      ) : (
        <>
          {cart.map(item => <CartItem key={item.name} {...item} />)}
          <div className='flex justify-between items-center my-6'>
            <p className='text-sm'>Order Total</p>
            <p className='text-2xl font-bold'>${total.toFixed(2)}</p>
          </div>
          <div className='bg-Rose-100 rounded-lg flex justify-center gap-1 p-4 mb-6'>
            <img src='/assets/images/icon-carbon-neutral.svg' alt='' />
            <p className='text-sm'>This is a <span className='font-bold'>carbon-neutral</span> delivery</p>
          </div>
          <CartButton text='Confirm Order' onClick={onConfirm} />
        </>
      )}
    </div>
  )
}