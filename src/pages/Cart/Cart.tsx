import { message } from 'antd'
import axios from 'axios'
import { produce } from 'immer'
import { keyBy } from 'lodash'
import { SetStateAction, useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'src/components/Button'
import { ProductInCart } from 'src/components/Header/Header'
import { Input } from 'src/components/Input'
import { QuantityController } from 'src/components/QuantityController'
import pagePath from 'src/constants/path'
import { useCount } from 'src/hooks/useCount'
// import usePurchases from 'src/hooks/usePurchases'
import useUpdatePurchase from 'src/hooks/useUpdatePurchase'
import { Purchases } from 'src/types/Purchases.type'
import { formatToCompactValue, formatToLocalizedValue, generateNameId } from 'src/utils/utils'

// interface ExtendPurchases extends Purchases {
//   checked: boolean
//   disabled: boolean
// }
const Cart = () => {
  const [productInCart, setProductInCart] = useState<ProductInCart[]>([])
  const handleQuantityChange = (index: number, newQuantity: number) => {
    setProductInCart((prev) => {
      const newCart = [...prev]
      newCart[index] = {
        ...newCart[index],
        so_luong: newQuantity
      }
      return newCart
    })
  }

  // const [extendPurchases, setExtendPurchases] = useState<Array<ExtendPurchases>>([])
  // const { data: productsInBag, refetch } = usePurchases()
  // const isAllChecked = extendPurchases.every((purchase) => purchase.checked)
  // const updatePurchaseMutation = useUpdatePurchase()

  const fetchPurchases = useCallback(async () => {
    const token = localStorage.getItem('token')

    if (!token) {
      message.error('Token không được cung cấp. Vui lòng đăng nhập!')
      return
    }

    try {
      const response = await axios.get('/orders/order-page', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      console.log('response.data', response.data)

      if (response.status === 200 && response.data) {
        setProductInCart(response.data.data)
      } else {
        message.error('Không thể lấy danh sách giỏ hàng')
      }
    } catch (error) {
      console.error('Fetch error:', error)
      message.error('Lỗi khi lấy giỏ hàng từ server')
    }
  }, [])

  useEffect(() => {
    fetchPurchases()
  }, [fetchPurchases])

  // Hàm xóa item
  const deleteItem = async (purchase: ProductInCart) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        message.error('Bạn cần đăng nhập để thực hiện thao tác này!')
        return
      }

      const response = await axios.delete(`/orders/delete-item-cart/${purchase?.order_product_id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      if (response.status === 200) {
        message.success('Xóa sản phẩm thành công!')
        // Reload lại danh sách giỏ hàng
        await fetchPurchases()
      } else {
        message.error('Không thể xóa sản phẩm khỏi giỏ hàng')
      }
    } catch (error) {
      console.error('Delete error:', error)
      message.error('Đã xảy ra lỗi khi xóa giỏ hàng. Vui lòng thử lại sau.')
    }
  }

  const deleteAllCart = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        message.error('Bạn cần đăng nhập để thực hiện thao tác này!')
        return
      }
      const response = await axios.delete('/orders/delete-all-cart', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      if (response.status == 200) {
        message.success('Xóa sản phẩm thành công')
        await fetchPurchases()
      } else {
        message.error('Không thể xóa sản phẩm khỏi giỏ hàng')
      }
    } catch (error) {
      message.error('Không thể xóa toàn bộ sản phẩm trong giỏ hàng - Server Error')
    }
  }
  const handlerCheckOut = async (orderId: number) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        message.error('Bạn cần đăng nhập để thực hiện thao tác này!')
        return
      }
      const orderDetails = productInCart.map((pr) => ({
        product_id: pr.product_id,
        price: pr.product_price,
        quantity: pr.so_luong
        // sum_total: pr.so_luong * pr.product_price
      }))
      const payload = {
        sum_total: 8080,
        orderDetails
      }
      const response = await axios.put(
        `/orders/save-payment/${orderId}`,
        payload, // body, bạn không gửi gì nên để là {}
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.status == 200) {
        message.success('Lưu thông tin đơn hàng thành công ')
        await fetchPurchases()
      } else {
        message.error('Có lỗi khi lưu đơn hàng.')
      }
    } catch (error) {
      message.error('Không thể lưu đơn hàng! - server Error')
    }
  }
  const { countOrder, fetchCount } = useCount()
  useEffect(() => {
    fetchCount()
  }, [fetchCount])

  const caculator = () => {
    return productInCart.reduce((tong, pr) => tong + pr.product_price * pr.so_luong, 0)
  }
  return (
    <>
      <div className='bg-neutral-100 py-16'>
        <div className='container'>
          <div className='overflow-auto'>
            <div className='min-w-[1000px]'>
              <div className='grid grid-cols-12 rounded-sm bg-white px-9 py-5 text-sm capitalize text-gray-500 shadow'>
                <div className='col-span-6'>
                  <div className='flex items-center'>
                    <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                      <Input
                        type='checkbox'
                        classNameInput='h-5 w-5 accent-orange'
                        // checked={isAllChecked}
                        // onChange={handleSelectAll}
                      />
                    </div>
                    <div className='flex-grow text-black'>product</div>
                  </div>
                </div>
                <div className='col-span-6'>
                  <div className='grid grid-cols-5 text-center'>
                    <div className='col-span-2'>unit price</div>
                    <div className='col-span-1'>quantity</div>
                    <div className='col-span-1'>total price</div>
                    <div className='col-span-1'>actions</div>
                  </div>
                </div>
              </div>
              <div className='my-3 rounded-sm bg-white p-5 shadow'>
                {productInCart?.map((purchase, index) => {
                  const nameId = generateNameId({ name: purchase.product_name, id: purchase.order_product_id })

                  return (
                    <div
                      key={`${purchase.order_id}-${index}`}
                      className='mt-5 grid grid-cols-12 rounded-sm border border-gray-200 bg-white px-4 py-5 text-center text-sm text-gray-500 first:mt-0'
                    >
                      <div className='col-span-6'>
                        <div className='flex items-center'>
                          <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                            <Input
                              type='checkbox'
                              classNameInput='h-5 w-5 accent-orange'
                              // checked={purchase.checked}
                              // onChange={handleChecked(index)}
                            />
                          </div>
                          <div className='flex-grow'>
                            <div className='flex'>
                              <Link to={`${pagePath.home}${nameId}`} className='h-20 w-20 flex-shrink-0'>
                                <div className='relative w-full pt-[100%]'>
                                  <img
                                    src={purchase.product_logo}
                                    alt={purchase.product_name}
                                    className='absolute left-0 top-0 h-full w-full bg-white object-cover'
                                  />
                                </div>
                              </Link>
                              <div className='flex-grow px-2 pb-2 pt-1 text-left'>
                                <Link to={`${pagePath.home}${nameId}`} className='line-clamp-2'>
                                  {purchase.product_name}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='col-span-6'>
                        <div className='grid grid-cols-5 items-center'>
                          <div className='col-span-2'>
                            <div className='flex items-center justify-center'>
                              <span className='text-gray-300 line-through'>
                                ₫{formatToLocalizedValue(purchase.product_price)}
                              </span>
                              <span className='ml-3'>₫{formatToLocalizedValue(purchase.product_price)}</span>
                            </div>
                          </div>
                          <div className='col-span-1'>
                            <QuantityController
                              max={purchase?.product_quantity}
                              value={purchase.so_luong}
                              onIncrease={(val) => handleQuantityChange(index, val)}
                              onDecrease={(val) => handleQuantityChange(index, val)}
                              onTyping={(val) => handleQuantityChange(index, val)}
                            />
                          </div>
                          <div className='col-span-1'>
                            <span className='text-orange'>
                              ₫{formatToLocalizedValue(purchase.product_price * purchase.so_luong)}
                            </span>
                          </div>
                          <div className='col-span-1'>
                            <Button
                              className='bg-none capitalize transition-colors hover:text-orange'
                              onClick={() => deleteItem(purchase)}
                            >
                              {' '}
                              delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <div className='sticky bottom-0 z-10 mt-8 flex flex-col rounded-sm border border-gray-100 bg-white p-5 shadow sm:flex-row sm:items-center'>
            <div className='flex items-center'>
              {/* <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                <Input
                  type='checkbox'
                  classNameInput='h-5 w-5 accent-orange'
                  checked={isAllChecked}
                  onChange={handleSelectAll}
                />
              </div>
              <Button onClick={handleSelectAll} className='mx-3 border-none bg-none capitalize'>
                select all ({extendPurchases.length})
              </Button> */}
              <Button className='mx-3 border-none bg-none capitalize' onClick={() => deleteAllCart()}>
                delete
              </Button>
            </div>
            <div className='mt-5 flex flex-col sm:ml-auto sm:mt-0 sm:flex-row sm:items-center'>
              <div>
                <div className='flex items-center sm:justify-end'>
                  <div className='capitalize'>total: {countOrder?.count ?? 0}</div>
                  <div className='ml-2 text-2xl text-orange'>₫{formatToLocalizedValue(caculator())}</div>
                </div>
                <div className='flex items-center text-sm sm:justify-end'>
                  <div className='capitalize text-gray-500'>saved</div>
                  <div className='ml-6 text-sm text-orange'>₫{formatToCompactValue(90000)}</div>
                </div>
              </div>
              <Button
                className='mt-5 flex h-12 w-44 items-center justify-center bg-red-500 px-2 py-4 text-center text-sm capitalize text-white hover:bg-red-600 sm:ml-4 sm:mt-0'
                onClick={() => handlerCheckOut(productInCart[0].order_id)}
              >
                check out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Cart
