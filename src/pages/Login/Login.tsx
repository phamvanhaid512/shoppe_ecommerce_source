import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from 'src/components/Button'
import { FormError, Input } from 'src/components/Input'
import InputSpacer from 'src/components/Input/InputSpacer'
import pagePath from 'src/constants/path'
import useLogin from 'src/hooks/useLogin'
import type { Account as LoginFormData } from 'src/types/Account.type'
import { logInSchema } from 'src/utils/schemaRules'
import axios from 'axios'
import { message } from 'antd'

const Login = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    password: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }
  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    try {
      const response = await axios.post('/auth/login', form)
      console.log('response.status', response.status)
      if (response.status === 201) {
        // Lưu token vào localStorage
        const token = response.data.data.accessToken
        localStorage.setItem('token', token)
        message.success('Bạn đã login thành công')
        navigate(pagePath.home)
      } else {
        message.error('Sai mật khẩu hoặc username')
      }
    } catch (error) {
      message.error('Login thất bại')
    }
  }

  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
    getValues
  } = useForm<LoginFormData>({ resolver: zodResolver(logInSchema) })

  const loginMutation = useLogin()

  return (
    <main className='bg-orange'>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' noValidate>
              <div className='text-2xl capitalize'>login</div>

              <InputSpacer className='mt-8'>
                <Input name='name' type='name' value={form.name} onChange={handleChange} placeholder='Email or Name' />
                <FormError errorMessage={errors.email?.message} />
              </InputSpacer>

              <InputSpacer className='mt-3'>
                <Input
                  name='password'
                  type='password'
                  value={form.password}
                  onChange={handleChange}
                  placeholder='Password'
                  autoComplete='on'
                />
                <FormError errorMessage={errors.password?.message} />
              </InputSpacer>

              <InputSpacer className='mt-3'>
                <Button
                  type='submit'
                  className='flex w-full items-center justify-center bg-red-500 px-2 py-4 text-center text-sm uppercase text-white hover:bg-red-600'
                  isLoading={loginMutation.isLoading}
                  disabled={loginMutation.isLoading}
                  onClick={onSubmit}
                >
                  login
                </Button>
              </InputSpacer>

              <div className='mt-8 flex items-center justify-center'>
                <span className='text-gray-400'>New to Shopee?</span>
                <Link className='ml-1 capitalize text-red-400' to={pagePath.signup}>
                  sign up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Login
