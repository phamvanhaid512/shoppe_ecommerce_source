import { useCallback, useState } from "react";
import axios from "axios";
import { message } from "antd";

export const useCount = () => {
    const [countOrder, setCountOrder] = useState<{ count?: number }>({})

    const fetchCount = useCallback(async () => {
        const token = localStorage.getItem('token')

        if (!token) {
            message.error('Token không được cung cấp. Vui lòng đăng nhập!')
            return
        }

        try {
            const response = await axios.get(`/orders/get-count-cart`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })

            if (response.status === 200) { // ✅ kiểm tra đúng
                const data = response.data.data
                console.log('setCountCart', data)

                setCountOrder({ count: data.count }) // ✅ gán đúng
                message.success('Lấy số lượng trong giỏ hàng thành công')
            } else {
                message.error('Lỗi khi lấy số lượng giỏ hàng')
            }
        } catch (error) {
            console.error(error) // ✅ nên log lỗi
            message.error('Lấy số lượng giỏ hàng thất bại - serverError')
        }
    }, [])

    return { countOrder, fetchCount }
}
