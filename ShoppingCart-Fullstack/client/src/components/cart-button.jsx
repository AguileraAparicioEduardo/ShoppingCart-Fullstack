export const CartButton = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className='bg-Red text-Rose-50 p-4 rounded-full w-full cursor-pointer hover:bg-Red/90 transition-colors'
    >
      {text}
    </button>
  )
}