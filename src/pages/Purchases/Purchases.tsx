import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from '../styles/payment.module.css'

const Purchases = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { order_id, sum_total, orderPayment } = location.state || {} // Nhận thông tin từ state
  const [form, setForm] = useState({
    name_customer: '',
    address: '',
    phone: '',
    note_order: '',
    payment_method: 1 // mặc định là "Thanh toán khi nhận hàng"
  })

  return (
    <div className={styles.container}>
      <h2>THANH TOÁN</h2>

      <div className={styles.checkout}>
        <div className={styles.info}>
          <h3>THÔNG TIN THANH TOÁN</h3>
          <label>Tên *</label>
          <input type='text' name='name_customer' value={form.name_customer} placeholder='Họ và tên' />

          <label>Địa chỉ giao sản phẩm *</label>
          <input type='text' name='address' value={form.address} placeholder='Địa chỉ' />

          <label>Số điện thoại *</label>
          <input type='text' name='phone' value={form.phone} placeholder='Số điện thoại' />

          <label>Ghi chú đơn hàng</label>
          <textarea
            name='note_order'
            value={form.note_order}
            placeholder='Ghi chú để có thể dễ dàng giao hàng'
          ></textarea>
        </div>
        <div className={styles['order-summary']}>
          <h3>ĐƠN HÀNG CỦA BẠN</h3>
          {/* Render thông tin đơn hàng */}
          {/* {orderPayment && orderPayment.length > 0 ? (
            orderPayment.map((product) => (
              <p>
                {product.name}
                <strong>
                  X <span>{product.quantity}</span>
                </strong>
                <span>{product.price} VNĐ</span>
              </p>
            ))
          ) : (
            <p>Không có sản phẩm trong đơn hàng.</p>
          )} */}
          <p>
            Phí giao hàng <span>50.000 VND</span>
          </p>
          <p>
            <strong>Tổng tiền</strong> <span className={styles.total}>{sum_total} VNĐ</span>
          </p>
          <div className={styles.payment}>
            <label>
              <input
                type='radio'
                name='payment'
                checked={form.payment_method === 1}
                // onChange={() => handlePaymentChange(1)}
              />
              Thanh toán khi nhận hàng
            </label>
            <label>
              <input
                type='radio'
                name='payment'
                checked={form.payment_method === 2}
                // onChange={() => handlePaymentChange(2)}
              />
              Thanh toán online
            </label>
          </div>

          <button className={styles['checkout-btn']}>THANH TOÁN</button>
        </div>
      </div>
    </div>
  )
}
export default Purchases
