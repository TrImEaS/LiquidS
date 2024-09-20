import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { useState } from "react";
import Pagination from "../../utils/Pagination";
import conceptJson from '../../Json/concepts.Json';

export default function Modify() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('default')
  const [active, setActive] = useState(true)
  const concepts = [...conceptJson];

  const getType = (type) => {
    if (type === 1) {
      return 'Remunerativo';
    }

    if (type === 2) {
      return 'No Remunerativo';
    }

    if (type === 3) {
      return 'Descuentos';
    }
  };

  const getParsedFormula = (formula, baseConceptIds) => {
    if (!formula) return null;
  
    // Obtener nombres de conceptos base
    const baseNames = baseConceptIds.map(id => {
      const baseConcept = concepts.find(concept => parseInt(concept.id) === parseInt(id));
      return baseConcept ? baseConcept.name : 'BASE';
    });
  
    // Reemplazar base1, base2, ... con sus respectivos nombres
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
  
    // Obtener valores base para sustituir en la fórmula
    const baseValues = baseConceptIds.map(id => getConceptValueById(id));
    
    // Reemplazar base1, base2, ... con sus respectivos valores
    baseValues.forEach((value, index) => {
      formula = formula.replace(new RegExp(`base${index + 1}`, 'gi'), value);
    });
  
    // Evaluar la fórmula
    try {
      const result = Function('"use strict";return (' + formula + ')')();
      return result;
    } catch (error) {
      console.error('Error al evaluar la fórmula:', formula);
      return 0;
    }
  };

  const filterConcepts = () =>{
    if(filter === 'rem') {
      return concepts.filter(concept => concept.active === 1 && parseInt(concept.type) === 1)
    }

    if(filter === 'norem') {
      return concepts.filter(concept => concept.active === 1 && parseInt(concept.type) === 2)
    }

    if(filter === 'des') {
      return concepts.filter(concept => concept.active === 1 && parseInt(concept.type) === 3)
    }

    return concepts
  }

  const sortConcepts = () => {
    const arr = filterConcepts()

    if(sort === 'asc') {
      return arr.sort((a,b) => a.number - b.number)
    }

    if(sort === 'des') {
      return arr.sort((a,b) => b.number - a.number)
    }

    if(sort === 'a-z') {
      return arr.sort((a,b) => a.name.localeCompare(b.name))
    }
    
    if(sort === 'z-a') {
      return arr.sort((a,b) => b.name.localeCompare(a.name))
    }

    return concepts
  }

  const filteredConcepts = sortConcepts()
  const displayedConcepts = filteredConcepts.slice( (currentPage - 1) * itemsPerPage, currentPage * itemsPerPage );

  return (
    <div className="flex flex-col w-full h-full justify-center gap-10 items-center">
      <section className="flex gap-5 items-center">
        <article className="flex flex-col gap-2 items-center font-bold">
          <label>Filtrar por:</label>
          <select className="selects" onChange={(e)=> setFilter(e.target.value)} value={filter} title="Seleccione para filtrar">
            <option value="all">Todos</option>
            <option value="rem">Remunerativos</option>
            <option value="norem">No Remunerativos</option>
            <option value="des">Descuentos</option>
          </select>
        </article>

        <article className="flex flex-col gap-2 items-center font-bold">
          <label>Ordenar por:</label>
          <select className="selects" onChange={(e)=> setSort(e.target.value)} value={sort} title="Seleccione para ordenar">
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
            <span className="text-green-500">
              <b className="text-white">Nro: </b> 
              {concept.number}
            </span>

            <span className="text-green-500">
              <b className="text-white">Concepto: </b> 
              {concept.name}
            </span>

            <span className="text-green-500">
              <b className="text-white">Tipo: </b>
              {getType(parseInt(concept.type))}
            </span>
            
            {getParsedFormula(concept.formula, concept.baseConceptIds) !== null && (
              <span className="text-green-500">
                <b className="text-white">Formula: </b>
                {getParsedFormula(concept.formula, concept.baseConceptIds)}
              </span>
            )}

            <span className="text-green-500">
              <b className="text-white">Resultado: </b>
              ${evaluateFormula(concept.formula, concept.baseConceptIds).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>

            {concept.baseConceptIds && concept.baseConceptIds.length > 0 && (
              <span className="text-green-500">
                <b className="text-white">Bases: </b>
                {concept.baseConceptIds.map(id => {
                  const baseConcept = concepts.find(concept => parseInt(concept.id) === parseInt(id));
                  return baseConcept ? baseConcept.name : 'N/A';
                }).join(', ')}
              </span>
            )}

            <FaPencilAlt className="absolute top-2 right-7 cursor-pointer duration-300 hover:text-yellow-300"/>
            <FaTrashAlt className="absolute top-2 right-2 cursor-pointer duration-300 hover:text-red-400"/>
          </section>
        ))}
      </section>

      <Pagination
        items={filteredConcepts}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />
    </div>
  );
}
