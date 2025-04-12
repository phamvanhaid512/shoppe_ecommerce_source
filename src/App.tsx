import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useRoutesElement from './hooks/useRoutesElement'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8080/'

function App() {
  const element = useRoutesElement()

  return (
    <>
      <ToastContainer />
      {element}
    </>
  )
}

export default App
