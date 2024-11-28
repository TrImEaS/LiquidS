import { useState, useEffect } from "react"
import axios from "axios"

export default function useConcepts() {
  const [concepts, setConcepts] = useState([])
  const [conceptLoading, setConceptLoading] = useState(true)

  const getConcepts = () => {
    setConceptLoading(true)
    return axios
      .get('http://localhost:8080/concepts?t=' + new Date().getTime())
      .then(res => {
        const updatedConcepts = res.data.map(concept => ({
          ...concept,
          baseConceptIds: Array.isArray(concept.baseConceptIds)
            ? concept.baseConceptIds
            : JSON.parse(concept.baseConceptIds || "[]"),
        }))
        setConcepts(updatedConcepts)
      })
      .catch(error => console.error('Error al traer conceptos: ', error))
      .finally(() => setConceptLoading(false))
  }

  useEffect(() => {
    getConcepts()
  }, [])

  return { concepts, conceptLoading, getConcepts }
}
