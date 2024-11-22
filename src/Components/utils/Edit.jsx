import { useState, useEffect } from "react";
import axios from "axios";
import Input from '../utils/Input';
import Button from '../utils/Button';
import Swal from 'sweetalert2';
import '@sweetalert2/theme-bulma/bulma.css';

export default function Edit({ concept, setEditMode }) {
  const [name, setName] = useState(concept.name || '');
  const [number, setNumber] = useState(concept.number || '');
  const [baseIds, setBaseIds] = useState(concept.baseConceptIds || []); // Inicializa baseIds correctamente
  const [formula, setFormula] = useState(concept.formula || '');
  const [type, setType] = useState(concept.type || '');
  const [concepts, setConcepts] = useState([]);
  const [selectedBases, setSelectedBases] = useState([]);
  const [showBaseSelection, setShowBaseSelection] = useState(false);
  const [formulaComponents, setFormulaComponents] = useState(formula.split(' ').filter(Boolean) || []);
  const [manualValue, setManualValue] = useState('');

  useEffect(() => {
    // Cargar todos los conceptos
    axios.get('http://localhost:8080/concepts')
      .then(res => {
        setConcepts(res.data);
        // Inicializar selectedBases con los conceptos que ya están en baseIds
        const initialSelectedBases = res.data.filter(concept => baseIds.includes(concept.id));
        setSelectedBases(initialSelectedBases);
      })
      .catch(e => console.error(e));
  }, [baseIds]); // Dependencia añadida para que se ejecute cuando baseIds cambie

  const toggleBaseSelection = () => setShowBaseSelection(!showBaseSelection);

  const handleSelectBase = (concept) => {
    if (!selectedBases.find(b => b.id === concept.id)) {
      setSelectedBases([...selectedBases, concept]);
      setBaseIds([...baseIds, concept.id]);
    } else {
      setSelectedBases(selectedBases.filter(b => b.id !== concept.id));
      setBaseIds(baseIds.filter(b => b !== concept.id));
    }
  };

  const handleAddToFormula = (value) => {
    setFormulaComponents([...formulaComponents, value]);
    setFormula([...formulaComponents, value].join(' '));
  };

  const handleManualValue = () => {
    if (!isNaN(manualValue) && manualValue.trim() !== '') {
      handleAddToFormula(manualValue);
      setManualValue('');
    } else {
      Swal.fire('Atención', 'Ingrese un valor numérico válido.', 'warning');
    }
  };

  const handleDeleteLast = () => {
    const newFormulaComponents = [...formulaComponents];
    newFormulaComponents.pop();
    setFormulaComponents(newFormulaComponents);
    setFormula(newFormulaComponents.join(' '));
  };

  const handleSubmit = () => {
    if (!name || !number || !formula || !type) {
      Swal.fire('Atención', 'Debe de llenar todos los campos para editar el concepto!', 'warning');
      return;
    }

    const formData = {
      name: name.toUpperCase(),
      number: parseInt(number),
      baseConceptIds: baseIds || '[]',
      formula: formula.toUpperCase(),
      type: parseInt(type),
    };

    axios.patch(`http://localhost:8080/concepts/${concept.id}`, formData)
      .then(response => {
        Swal.fire('Éxito', 'Concepto editado correctamente!', 'success');
        setEditMode(false)
      })
      .catch(error => {
        if (error.response) {
          Swal.fire('Error', error.response.data.error || 'No se pudo editar el concepto.', 'error');
        } else {
          Swal.fire('Error', 'Error de conexión. Intenta nuevamente más tarde.', 'error');
        }
        setEditMode(false)
      });
  };

  return (
    <div className="flex rounded-sm flex-col w-[700px] h-[700px] relative overflow-auto p-10 bg-slate-800 z-10 items-center gap-10">
      <button className="fixed top-[8%] right-[16%] text-xl" onClick={()=> setEditMode(false)}>❌</button>
      <h1 className="w-4/5 text-2xl">Editar concepto</h1>
      <section className="flex p-5 flex-col gap-10 w-4/5 h-full items-center">
        <label className="w-full" htmlFor="conceptNameEdit">
          <h3 className="text-xs">Ingrese nombre de concepto</h3>
          <input
            id='conceptNameEdit'
            placeholder='Ingrese nombre de concepto'
            autoComplete="off"
            onChange={(e)=> setName(e.target.value)}
            value={name}
            className="h-8 w-full border-b border-b-slate-700 bg-transparent p-0 placeholder-transparent focus:border-white outline-none focus:ring-0 sm:text-base dark:text-white"
          />
        </label>

        <label className="w-full" htmlFor="conceptNameEdit">
          <h3 className="text-xs">Ingrese numero de concepto</h3>
          <input
            type="number"
            id='conceptNumberEdit'
            placeholder='Ingrese numero de concepto'
            autoComplete="off"
            onChange={(e)=> setNumber(e.target.value)}
            value={number}
            className="h-8 w-full border-b border-b-slate-700 bg-transparent p-0 placeholder-transparent focus:border-white outline-none focus:ring-0 sm:text-base dark:text-white"
          />
        </label>

        <section className="relative flex flex-col gap-10 items-center justify-center border-b border-slate-700 focus:border-white hover:border-white pb-2 w-full">
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
                          checked={selectedBases.some(b => b.id === concept.id)} // Asegúrate de que se marque correctamente
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

        <section className="flex flex-col gap-2 w-full">
          <label>Visualización de fórmula/valor</label>
          <span className="border p-2 h-10 rounded select-none">
            {formula && formula}
          </span>

          <article className="border w-full rounded p-2 flex flex-col items-center overflow-auto transition-all duration-300 max-h-[300px]">
            <div className="flex flex-col items-center w-4/5 max-md:w-full justify-center gap-5">
              <Input 
                id="concept-value-formula"
                text="Ingrese valor"
                type="number"
                value={manualValue}
                setValue={setManualValue}
              />
              <div className="flex flex-wrap w-full gap-3 border-2 p-2 border-slate-700">
                <h4 className="w-full text-blue-100">Agregar bases:</h4>
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
            className="selects hover:bg-white hover:text-black hover:cursor-pointer" 
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Seleccione una opcion</option>
            <option value="1">Remunerativo</option>
            <option value="2">No Remunerativo</option>
            <option value="3">Descuento</option>
          </select>
        </label>

        <Button text="Modificar" action={handleSubmit} />
      </section>
    </div>
  );
}
