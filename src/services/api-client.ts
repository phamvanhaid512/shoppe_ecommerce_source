import axios, { AxiosError, AxiosRequestConfig, HttpStatusCode } from 'axios'
import { toast } from 'react-toastify'
import pagePath from 'src/constants/path'
import { AuthResponse } from 'src/types/AuthResponse.type'
import { FetchSuccessResponse } from 'src/types/utils.type'
import { getAccessToken, removeAccessTokenAndUser, setAccessToken, setUser } from 'src/utils/auth'

const axiosInstance = axios.create({
  baseURL: 'https://api-ecom.duthanhduoc.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

class APIClient<T, P> {
  endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
  }

  getAll = (config?: AxiosRequestConfig) =>
    axiosInstance.get<FetchSuccessResponse<T>>(this.endpoint, config).then((res) => res.data)

  get = (id?: string | number) => axiosInstance.get<T>(`${this.endpoint}/${id}`).then((res) => res.data)

  post = (data?: P) => axiosInstance.post<T>(this.endpoint, data).then((res) => res.data)
}

let access_token = getAccessToken()

axiosInstance.interceptors.request.use(
  (config) => {
    if (access_token) {
      config.headers.Authorization = access_token
      return config
    }
    return config
  },
  (err) => Promise.reject(err)
)

axiosInstance.interceptors.response.use(
  (res) => {
    const { url } = res.config
    if ([pagePath.login, pagePath.register].some((state) => state === url)) {
      const data = res.data as AuthResponse
      access_token = data.data.access_token

      setAccessToken(access_token)
      setUser(data.data.user)
    } else if (url === pagePath.logout) {
      access_token = ''

      removeAccessTokenAndUser()
    }
    return res
  },
  (err: AxiosError) => {
    // * Showing toast for general errors
    if (err.response?.status !== HttpStatusCode.UnprocessableEntity) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any | undefined = err.response?.data
      const message = data.message || err.message
      toast.error(message)
    }
    return Promise.reject(err)
  }
)

export default APIClient
