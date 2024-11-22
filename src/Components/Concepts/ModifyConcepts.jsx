import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import Pagination from "../utils/Pagination";
import axios from "axios";
import Swal from "sweetalert2";
import Edit from '../utils/Edit'
import '@sweetalert2/theme-bulma/bulma.css';

export default function Modify() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('default')
  const [concepts, setConcepts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(null); 
  const [concept, setConcept] = useState(0)

  useEffect(() => {
    fetchConcepts();
  }, [])
  
  const fetchConcepts = () => {
    setLoading(true);
    axios.get('http://localhost:8080/concepts?t=' + new Date().getTime())
      .then(res => {
        // Convierte baseConceptIds a array si es necesario
        const updatedConcepts = res.data.map(concept => {
          return {
            ...concept,
            baseConceptIds: Array.isArray(concept.baseConceptIds) 
              ? concept.baseConceptIds 
              : JSON.parse(concept.baseConceptIds || "[]")
          };
        });
        setConcepts(updatedConcepts);
        setLoading(false);
      })
      .catch(e => {
        console.error('Error al traer datos: ', e);
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:8080/concepts/${id}`)
          .then(() => {
            fetchConcepts(); 
            Swal.fire('Eliminado!', 'El concepto ha sido eliminado.', 'success');
          })
          .catch(error => {
            console.error("Error al eliminar el concepto: ", error);
            Swal.fire('Error!', 'No se pudo eliminar el concepto.', 'error');
          });
      }
    });
  };

  const handleEdit = (concept) => {
    setConcept(concept)
    setEditMode(true)
  };

  const getType = (type) => {
    if (type === 1) return 'Remunerativo';
    if (type === 2) return 'No Remunerativo';
    if (type === 3) return 'Descuentos';
  };

  const getParsedFormula = (formula, baseConceptIds = []) => {
    if (!formula) return null;

    const baseNames = baseConceptIds.map(id => {
      const baseConcept = concepts.find(concept => parseInt(concept.id) === parseInt(id));
      return baseConcept ? baseConcept.name : 'BASE';
    });

    baseNames.forEach((name, index) => {
      formula = formula.replace(new RegExp(`base${index + 1}`, 'gi'), name);
    });
    return formula;
  };

  const getConceptValueById = (id) => {
    const concept = concepts.find((concept) => parseInt(concept.id) === parseInt(id));
    return concept ? parseFloat(concept.formula) || 0 : 0;
  };

  const evaluateFormula = (formula, baseConceptIds) => {
    if (!formula) return 0;

    const baseValues = baseConceptIds.map(id => getConceptValueById(id));
    
    baseValues.forEach((value, index) => {
      formula = formula.replace(new RegExp(`base${index + 1}`, 'gi'), value);
    });

    try {
      const result = Function('"use strict";return (' + formula + ')')();
      return result;
    } 
    catch (error) {
      console.error('Error al evaluar la fórmula:', formula);
      return 0;
    }
  };

  const filterConcepts = () => {
    if (filter === 'rem') 
      return concepts.filter(concept => concept.active === 1 && parseInt(concept.type) === 1)

    if (filter === 'norem') 
      return concepts.filter(concept => concept.active === 1 && parseInt(concept.type) === 2)

    if (filter === 'des') 
      return concepts.filter(concept => concept.active === 1 && parseInt(concept.type) === 3)

    return concepts
  }

  const sortConcepts = () => {
    const arr = filterConcepts();

    if (sort === 'asc')
      return arr.sort((a, b) => a.number - b.number);

    if (sort === 'des')
      return arr.sort((a, b) => b.number - a.number);

    if (sort === 'a-z')
      return arr.sort((a, b) => a.name.localeCompare(b.name));
    
    if (sort === 'z-a')
      return arr.sort((a, b) => b.name.localeCompare(a.name));

    return concepts;
  }

  const filteredConcepts = sortConcepts();
  const displayedConcepts = filteredConcepts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading)
    return <div className="h-screen w-full flex items-center justify-center pb-[250px] text-xl">Cargando datos...</div>

  return (
    <div className="flex flex-col relative w-full h-full justify-center gap-10 items-center">
      {editMode && 
        <section className="w-[90%] h-full top-0 fixed flex items-center justify-center bg-opacity-90 z-10">
          <Edit concept={concept} setEditMode={setEditMode}/>
        </section>
      }
      <section className="flex gap-5 items-center">
        <article className="flex flex-col gap-2 items-center font-bold">
          <label>Filtrar por:</label>
          <select className="selects" onChange={(e) => setFilter(e.target.value)} value={filter} title="Seleccione para filtrar">
            <option value="all">Todos</option>
            <option value="rem">Remunerativos</option>
            <option value="norem">No Remunerativos</option>
            <option value="des">Descuentos</option>
          </select>
        </article>

        <article className="flex flex-col gap-2 items-center font-bold">
          <label>Ordenar por:</label>
          <select className="selects" onChange={(e) => setSort(e.target.value)} value={sort} title="Seleccione para ordenar">
            <option value="">Default</option>
            <option value="asc">Nro concepto menor a mayor</option>
            <option value="des">Nro concepto mayor a menor</option>
            <option value="a-z">Nombre A-Z</option>
            <option value="z-a">Nombre Z-A</option>
          </select>
        </article>
      </section>

      <section className="flex flex-wrap gap-2 justify-center w-full">
        {displayedConcepts && displayedConcepts.map((concept) => (
          <section key={concept.id} className="flex flex-col relative rounded-lg justify-center text-sm gap-2 border p-2 w-full py-4 max-w-[400px]">
            <span className="text-cyan-500">
              <b className="text-white">Nro: </b> 
              {concept.number}
            </span>

            <span className="text-cyan-500">
              <b className="text-white">Concepto: </b> 
              {concept.name}
            </span>

            <span className="text-cyan-500">
              <b className="text-white">Tipo: </b>
              {getType(parseInt(concept.type))}
            </span>
            
            {getParsedFormula(concept.formula, concept.baseConceptIds) !== null && (
              <span className="text-cyan-500">
                <b className="text-white">Formula: </b>
                {getParsedFormula(concept.formula, concept.baseConceptIds)}
              </span>
            )}

            <span className="text-cyan-500">
              <b className="text-white">Resultado: </b>
              ${evaluateFormula(concept.formula, concept.baseConceptIds).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>

            {concept.baseConceptIds && concept.baseConceptIds.length > 0 && (
              <span className="text-cyan-500">
                <b className="text-white">Bases: </b>
                {concept.baseConceptIds.map(id => {
                  const baseConcept = concepts.find(concept => parseInt(concept.id) === parseInt(id));
                  return baseConcept ? baseConcept.name : 'N/A';
                }).join(', ')}
              </span>
            )}

            <FaPencilAlt
              className="text-green-500 absolute right-2 top-2 hover:text-green-400 cursor-pointer"
              onClick={() => handleEdit(concept)}
            />
            <FaTrashAlt
              className="text-red-500 absolute right-8 top-2 hover:text-red-400 cursor-pointer"
              onClick={() => handleDelete(concept.id)}
            />
          </section>
        ))}
      </section>

      <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalItems={filteredConcepts.length} itemsPerPage={itemsPerPage} />
    </div>
  );
}
