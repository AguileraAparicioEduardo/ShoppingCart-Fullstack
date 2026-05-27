import { useState, useEffect } from 'react'
import { ProductCard } from './product-card'

export const CardsContainer = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`http://localhost:4000/api/products`)
      .then(res => res.json())
      .then(response => {
        setProducts(response.data)
        setLoading(false)
      })
      .catch(err => {
        setError('Error al cargar los productos')
        setLoading(false)
        console.error(err)
      })
  }, [])

  if (loading) return <p>Cargando productos...</p>
  if (error) return <p>{error}</p>

  return (
    <div className='grid md:grid-cols-3 gap-6 mb-6 w-[327px] md:w-[688px]'>
      {products.map(item => <ProductCard key={item.name} {...item} />)}
    </div>
  )
}