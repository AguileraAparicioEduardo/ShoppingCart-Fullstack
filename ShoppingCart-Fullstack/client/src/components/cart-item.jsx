import { useCart } from '../context/CartContext'

export const CartItem = ({ name, price, quantity }) => {
  const { removeFromCart } = useCart()
  const numericPrice = parseFloat(price)  // ← convierte a número

  return (
    <div className='border-b border-Rose-100 text-sm py-4'>
      <div className='flex justify-between items-center'>
        <div>
          <h3 className='font-semibold text-Rose-900'>{name}</h3>
          <div className='flex gap-2 mt-1'>
            <p className='text-Red font-semibold'>{quantity}x</p>
            <p className='text-Rose-500'>@${numericPrice.toFixed(2)}</p>
            <p className='font-semibold text-Rose-500'>
              ${(numericPrice * quantity).toFixed(2)}
            </p>
          </div>
        </div>
        <button
          onClick={() => removeFromCart(name)}
          className='border border-Rose-300 rounded-full p-0.5 cursor-pointer hover:border-Rose-900 transition-colors'
        >
          <img
            className='size-[14px]'
            src='/assets/images/icon-remove-item.svg'
            alt='remove item'
          />
        </button>
      </div>
    </div>
  )
}