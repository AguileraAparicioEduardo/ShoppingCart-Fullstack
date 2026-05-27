import { useCart } from '../context/CartContext'

export const ProductCard = ({ image, name, category, price }) => {
  const { cart, addToCart, increment, decrement } = useCart()
  const item = cart.find(i => i.name === name)
  const quantity = item ? item.quantity : 0

  return (
    <div className='relative'>
      <picture>
        <source media="(min-width: 1440px)" srcSet={image.desktop} />
        <source media="(min-width: 768px)" srcSet={image.tablet} />
        <img
          className={`rounded-lg mb-[38px] ${quantity > 0 ? 'border-2 border-Red' : ''}`}
          src={image.mobile}
          alt={name}
        />
      </picture>

      {quantity === 0 ? (
        <button
          onClick={() => addToCart({ name, category, price, image })}
          className='bg-Rose-50 border-2 border-Rose-300 w-40 rounded-full flex justify-center gap-2 p-3 absolute inset-x-0 mx-auto top-[190px] cursor-pointer hover:border-Red transition-colors'
        >
          <img src='/assets/images/icon-add-to-cart.svg' alt='' />
          <span>Add to Cart</span>
        </button>
      ) : (
        <div className='bg-Red w-40 rounded-full flex justify-between items-center p-3 absolute inset-x-0 mx-auto top-[190px]'>
          <img onClick={() => decrement(name)} className='border border-Rose-50 size-[18px] rounded-full p-1 cursor-pointer' src='/assets/images/icon-decrement-quantity.svg' alt='' />
          <p className='text-Rose-50'>{quantity}</p>
          <img onClick={() => increment(name)} className='border border-Rose-50 size-[18px] rounded-full p-1 cursor-pointer' src='/assets/images/icon-increment-quantity.svg' alt='' />
        </div>
      )}

      <p className='text-Rose-500 text-sm'>{category}</p>
      <h2 className='font-bold'>{name}</h2>
      <p className='text-Red font-semibold'>${price}</p>
    </div>
  )
}