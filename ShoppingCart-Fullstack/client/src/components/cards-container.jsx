import { ProductCard } from './product-card'
import data from '../../data.json'

export const CardsContainer = () => {
  return (
    <div className='grid md:grid-cols-3 gap-6 mb-6 w-[327px] md:w-[688px]'>
      
      {
        data.map(item => <ProductCard key={item.name} {...item} />)
      }
    </div>
  )
}
