import { Pagination } from 'src/components/Pagination'
import useProducts from 'src/hooks/useProducts'
import useProductsQuery, { ProductsQuery } from 'src/hooks/useProductsQuery'
import { AsideFilter } from './components/AsideFilter'
import { Product } from './components/Product'
import { SortProductList } from './components/SortProductList'
import { useEffect, useState } from 'react'
import axios from 'axios'
const ProductList = () => {
  const productsQuery: ProductsQuery = useProductsQuery()
  const [products, setProducts] = useState([])
  // const { data } = useProducts(productsQuery)
  useEffect(() => {
    axios
      .get('/product/listProduct')
      .then((response) => {
        setProducts(Array.isArray(response.data?.data) ? response.data.data : [])
        console.log('Response Products:', response)
      })
      .catch((error) => {
        console.error('Error fetching products:', error)
      })
  }, [])
  return (
    <main className='bg-gray-200 py-6'>
      <div className='container'>
        <div className='grid grid-cols-12 gap-6'>
          <div className='col-span-3'>
            <AsideFilter productsQuery={productsQuery} />
          </div>
          <div className='col-span-9'>
            <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
              {Array.isArray(products) && products.length > 0 ? (
                products.map((product) => (
                  <div className='col-span-1'>
                    <Product product={product} />
                  </div>
                ))
              ) : (
                <p className='col-span-full text-center'>Không có sản phẩm nào.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ProductList
