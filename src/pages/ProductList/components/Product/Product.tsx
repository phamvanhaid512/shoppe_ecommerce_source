import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ProductRating } from 'src/components/ProductRating'
import pagePath from 'src/constants/path'
import { Product as ProductType } from 'src/types/Product.type'
import { formatToCompactValue, formatToLocalizedValue, generateNameId } from 'src/utils/utils'

interface ProductProps {
  product: ProductType
}

const Product = ({ product }: ProductProps) => {
  // const { id } = useParams() // Lấy ID từ URL
  // const [products, setProducts] = useState({})
  // useEffect(() => {
  //   axios
  //     .get(`/blog/details/${id}`)
  //     .then((response) => {
  //       setProducts(response.data)
  //       console.log('Response products:', response)
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching products:', error)
  //     })
  // }, [id])

  return (
    <Link to={`/detail/product/${product.id}`}>
      <div className='overflow-hidden rounded-sm bg-white shadow transition-transform duration-100 hover:translate-y-[-0.1rem] hover:shadow-md'>
        <div className='relative w-full pt-[100%]'>
          <img
            src={product.logo}
            alt={product.name}
            className='absolute left-0 top-0 h-full w-full bg-white object-cover'
          />
        </div>
        <div className='overflow-hidden p-2'>
          <div className='line-clamp-2 min-h-[2rem] text-xs'>{product.name}</div>
          <div className='mt-3 flex items-center'>
            <div className='max-w-[50%] truncate text-gray-500 line-through'>
              <span className='text-xs'>₫</span>
              {/* <span className='text-sm'>{formatToLocalizedValue(product.price_before_discount)}</span> */}
            </div>
            <div className='ml-1 truncate text-orange'>
              <span className='text-xs'>₫</span>
              <span className='text-sm'>{formatToLocalizedValue(product.price)}</span>
            </div>
          </div>
          <div className='mt-3 flex items-center justify-start'>
            <ProductRating productRating={product.rating} />
            <div className='ml-2 text-sm'>
              <span>{formatToCompactValue(product.sold)}</span>
              <span className='ml-1'>sold</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Product
