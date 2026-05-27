export const CartConfirmItem = () => {
  return (
    <div className='border-1 border-transparent border-b-Rose-300 text-sm py-4'>
      <div className='flex justify-between items-center px-4'>
        <div className='flex gap-4'>
          <img className='size-12' src="/assets/images/image-baklava-thumbnail.jpg" alt="" />
          <div>
            <h3 className='font-bold'>Vanilla Panna</h3>
            <div className='flex gap-2'>
              <p className='text-Red font-semibold'>1x</p>
              <p className='text-Rose-500'>@$6.50</p>
            </div>
          </div>
        </div>
        <p className='font-bold text-Rose-900'>$13</p>
      </div>
    </div>
  )
}
