// hooks/useCart.ts
import { useCallback, useState } from 'react'
import axios from 'axios'
import { message } from 'antd'

export const useCart = () => {
    const [productInCart, setProductInCart] = useState([])

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

    return { productInCart, fetchPurchases }
}
