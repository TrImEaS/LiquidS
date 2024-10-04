import { NavLink, useLocation } from "react-router-dom";
import CreateConcepts from "../Components/Concepts/CreateConcepts";
import ModifyConcepts from "../Components/Concepts/ModifyConcepts";
import { FaArrowLeft } from "react-icons/fa6";

export default function Concepts() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const content = queryParams.get('content');

  return (
    <div className="flex flex-col w-full relative p-10">
      {content && 
        <NavLink to='/concepts' title="Volver atras" className='fixed top-[10px] cursor-pointer'>
          <FaArrowLeft className="hover:text-cyan-500 duration-300"/>
        </NavLink>
      }

      {
        !content ? (
          <ul className="flex flex-wrap gap-5">
            <NavLink 
              to={'/concepts?content=create_concepts'} 
              className='hover:scale-105 hover:bg-cyan-500 duration font-bold duration-300 border w-[150px] h-[100px] rounded-xl flex justify-center items-center'
            >
              Crear concepto
            </NavLink>

            <NavLink 
              to={'/concepts?content=modify_concepts'} 
              className='hover:scale-105 hover:bg-cyan-500 duration font-bold duration-300 border w-[150px] h-[100px] rounded-xl flex text-center items-center'
            >
              Modificar conceptos
            </NavLink>
          </ul>
        )
          
        : content === 'create_concepts' ? <CreateConcepts/>
        : content === 'modify_concepts' ? <ModifyConcepts/> 
        : ''
      }
    </div>
  )
}