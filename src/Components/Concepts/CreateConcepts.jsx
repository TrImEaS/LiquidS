import { useState, useEffect } from "react"
import axios from "axios"
import Input from '../utils/Input';
import Button from '../utils/Button';
import Swal from 'sweetalert2';
import '@sweetalert2/theme-bulma/bulma.css';

export default function Create() {
  const [name, setName] = useState('')
  const [number, setNumber] = useState('')
  const [baseIds, setBaseIds] = useState([])
  const [formula, setFormula] = useState('')
  const [type, setType] = useState('')
  const [concepts, setConcepts] = useState([])
  const [selectedBases, setSelectedBases] = useState([])
  const [showBaseSelection, setShowBaseSelection] = useState(false)
  const [formulaComponents, setFormulaComponents] = useState([])
  const [manualValue, setManualValue] = useState('') // Nuevo estado para el valor manual

  useEffect(() => {
    axios.get('http://localhost:8080/concepts')
      .then(res => setConcepts(res.data))
      .catch(e => console.error(e))
  }, [])

  const toggleBaseSelection = () => setShowBaseSelection(!showBaseSelection)

  const handleSelectBase = (concept) => {
    if (!selectedBases.find(b => b.id === concept.id)) {
      setSelectedBases([...selectedBases, concept])
      setBaseIds([...baseIds, concept.id])
    } else {
      setSelectedBases(selectedBases.filter(b => b.id !== concept.id))
      setBaseIds(baseIds.filter(b => b !== concept.id))
    }
  }

  const handleAddToFormula = (value) => {
    setFormulaComponents([...formulaComponents, value])
    setFormula(formulaComponents.join(' ') + ' ' + value)
  }

  const handleManualValue = () => {
    if (!isNaN(manualValue) && manualValue.trim() !== '') {
      handleAddToFormula(manualValue)
      setManualValue('') // Limpiar el input después de agregar
    } else {
      Swal.fire('Atención', 'Ingrese un valor numérico válido.', 'warning')
    }
  }

  const handleDeleteLast = () => {
    const newFormulaComponents = [...formulaComponents]
    newFormulaComponents.pop()
    setFormulaComponents(newFormulaComponents)
    setFormula(newFormulaComponents.join(' '))
  }

  const handleSubmit = () => {
    if (!name || !number || !formula || !type) {
      Swal.fire('Atención', 'Debe de llenar todos los campos para crear concepto!', 'warning')
      return
    }

    const formData = {
      name: name.toUpperCase(),
      number: parseInt(number),
      baseConceptIds: baseIds || '[]',
      formula: formula.toUpperCase(),
      type: parseInt(type)
    }

    axios.post('http://localhost:8080/concepts', formData)
      .then(response => {
        Swal.fire('Éxito', 'Concepto creado correctamente!', 'success');
      })
      .catch(error => {
        if (error.response) {
          Swal.fire('Error', error.response.data.error || 'No se pudo crear el concepto.', 'error');
        } 
        else {
          Swal.fire('Error', 'Error de conexión. Intenta nuevamente más tarde.', 'error');
        }
      });
  }

  return (
    <div className="flex flex-col w-full h-full items-center gap-10">
      <h1 className="w-3/4 text-2xl">Crear concepto</h1>
      <section className="flex p-5 flex-col gap-10 w-3/4 h-full items-center">
        <Input 
          id='conceptName' 
          text='Ingrese nombre de concepto' 
          value={name} 
          setValue={setName}
        />

        <Input 
          id='conceptNumber' 
          text='Ingrese numero de concepto' 
          value={number} 
          setValue={setNumber}
          type="number"
        />

        {/* Botón para mostrar/ocultar selección de bases */}
        <section className="relative flex flex-col gap-10 items-center justify-center border-b border-slate-700 pb-2 w-full">
          <button onClick={toggleBaseSelection} className="border p-2 rounded">Seleccionar Base/s</button>
          {showBaseSelection && (
            <article className="border w-[400px] rounded p-2 overflow-auto transition-all duration-300 max-h-[400px] absolute top-0 z-10 bg-[#111]">
              <button onClick={toggleBaseSelection} className="absolute top-2 right-2 text-white">❌</button>

              <article>
                <div className="flex flex-col gap-2 w-full">
                  {concepts.map(concept => (
                    <label key={concept.id} className="flex cursor-pointer items-start gap-4">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          className="size-4 rounded border-gray-300"
                          checked={selectedBases.some(b => b.id === concept.id)}
                          onChange={() => handleSelectBase(concept)}
                        />
                      </div>
                      <div>
                        <strong className="font-medium text-white">{concept.number} - {concept.name}</strong>
                      </div>
                    </label>
                  ))}
                </div>
              </article>
            </article>
          )}
          <div className="flex flex-wrap w-full">
            {selectedBases.map(base => (
              <div key={base.id} className="border p-2 flex justify-between">
                {base.name}
                <span className="cursor-pointer" onClick={() => handleSelectBase(base)}>❌</span>
              </div>
            ))}
          </div>
        </section>

        {/* Cuadro de fórmula */}
        <section className="flex flex-col gap-2 w-full">
          <label>Visualizacion de formula/valor</label>
          <span className="border p-2 h-10 rounded select-none">
            {formula && formula}
          </span>

          <article className="border w-full rounded p-2 flex flex-col items-center overflow-auto transition-all duration-300 max-h-[300px]">
            <div className="flex flex-col items-center w-4/5 max-md:w-full justify-center gap-5">
              {/* Valor manual */}
              <Input 
                id="concept-value-formula"
                text="Ingrese valor"
                type="number"
                value={manualValue}
                setValue={setManualValue}
              />
              <div className="flex flex-wrap w-full gap-3 border-2 p-2  border-slate-700">
                <h4 className="w-full text-blue-100">Agregar bases:</h4>
                {/* Bases elegidas */}
                {selectedBases.map((base, index) => (
                  <button key={base.id} className="text-blue-400 flex gap-3" onClick={() => handleAddToFormula(`base${index + 1}`)}>
                    <p className="flex gap-1">
                      {`(base${index + 1}):`}
                      <span className="text-blue-100">{base.name}</span>
                    </p>
                    <span className="text-blue-100">|</span>
                  </button>
                ))}
              </div>

              {/* Operadores */}
              <div className="flex flex-wrap w-full gap-5 justify-center">
                {["+", "-", "*", "/", "(", ")"].map((operator) => (
                  <button
                    key={operator}
                    onClick={() => handleAddToFormula(operator)}
                    className="border text-center px-2 rounded-xl hover:bg-white hover:text-black duration-300">
                    {operator}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <button onClick={handleManualValue} className="border px-2 py-1 rounded-xl text-white bg-blue-500 hover:bg-blue-700">Agregar</button>
                <button onClick={handleDeleteLast} className="border px-2 py-1 rounded-xl text-white bg-red-500 hover:bg-red-700">Borrar último</button>
              </div>
            </div>
          </article>
        </section>

        <label className="w-full flex flex-col gap-1">
          <span className="text-sm">Seleccione tipo de concepto</span>
          <select 
            className="selects" 
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Seleccione una opcion</option>
            <option value="1">Remunerativo</option>
            <option value="2">No Remunerativo</option>
            <option value="3">Descuento</option>
          </select>
        </label>

        <Button text='crear' action={handleSubmit}/>
      </section>
    </div>
  )
}
