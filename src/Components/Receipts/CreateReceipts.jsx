import useSectors from '../../Hooks/useSectors';
import useConcepts from '../../Hooks/useConcepts';
import { useState } from 'react';

export default function CreateReceipts() {
  const { sectors, sectorLoading } = useSectors();
  const { concepts, conceptLoading } = useConcepts();
  const [selectedSector ,setSelectedSector] = useState('');

  if (sectorLoading || conceptLoading) 
    return <div className="h-screen w-full flex items-center justify-center pb-[250px] text-xl">Cargando datos...</div>;

  return (
    <section className='flex flex-col relative w-4/5 px-10 py-5 h-full gap-10'>
      <div className='w-full'>
        <select className='selects' value={selectedSector} onChange={(e)=> setSelectedSector(e.target.value)}>
          <option value="" disabled>Seleccione un sector</option>
          {sectors && sectors.map((sector) => (<option value={sector.id} key={sector.id}>{sector.name}</option>))}
        </select>
      </div>

      <div>
        <h2>Conceptos desabilitados:</h2>
        {concepts && 
          concepts
          .filter(concept => parseInt(concept.active) === 0)
          .map((concept) => (
            <div key={concept.id}>{concept.name}</div>
          ))
        }
      </div>
    </section>
  );
}
