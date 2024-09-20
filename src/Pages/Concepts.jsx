import { NavLink, useLocation } from "react-router-dom";
import Create from "../Components/Concepts/Create";
import Modify from "../Components/Concepts/Modify";
import { FaArrowLeft } from "react-icons/fa6";

export default function Concepts() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const content = queryParams.get('content');

  return (
    <div className="flex flex-col w-full relative p-10">
      {content && 
        <NavLink to='/concepts' className='cursor-pointer'>
          <FaArrowLeft className="fixed top-[10px] hover:text-cyan-500 duration-300 left-10"/>
        </NavLink>
      }

      {
        !content ? (
          <ul className="flex flex-wrap gap-5">
            <NavLink 
              to={'/concepts?content=create'} 
              className='hover:scale-105 hover:bg-cyan-500 duration font-bold duration-300 border w-[150px] h-[100px] rounded-xl flex justify-center items-center'
            >
              Crear concepto
            </NavLink>

            <NavLink 
              to={'/concepts?content=modify'} 
              className='hover:scale-105 hover:bg-cyan-500 duration font-bold duration-300 border w-[150px] h-[100px] rounded-xl flex text-center items-center'
            >
              Modificar conceptos
            </NavLink>
          </ul>
        )
          
        : content === 'create' ? <Create/>
        : content === 'modify' ? <Modify/> 
        : ''
      }
    </div>
  )
}