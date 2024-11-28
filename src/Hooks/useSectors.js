import { useState, useEffect } from "react"
import axios from "axios"

export default function useSectors() {
  const [sectors, setSectors] = useState([])
  const [sectorLoading, setSectorLoading] = useState(true)

  const getSectors = () => {
    setSectorLoading(true) 
    return axios
      .get('http://localhost:8080/employees/sectors?t=' + new Date().getTime())
      .then(res => setSectors(res.data))
      .catch(error => console.error('Error al traer datos: ', error))
      .finally(() => setSectorLoading(false))
  }

  useEffect(() => {
    getSectors()
  }, [])

  return { sectors, sectorLoading, getSectors }
}
