import { NavLink, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import CreateReceipts from "../Components/Receipts/CreateReceipts";
import ModifyReceipts from "../Components/Receipts/ModifyReceipts";

export default function Receipts() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const content = queryParams.get('content');

  return (
    <div className="flex flex-col w-full relative p-10">
      {content && 
        <NavLink to='/receipts' title="Volver atras" className='fixed top-[10px] cursor-pointer'>
          <FaArrowLeft className="hover:text-cyan-500 duration-300"/>
        </NavLink>
      }

      {
        !content ? (
          <ul className="flex flex-wrap gap-5">
            <NavLink 
              to={'/receipts?content=create_receipts'} 
              className='hover:scale-105 hover:bg-cyan-500 duration font-bold duration-300 border w-[150px] h-[100px] rounded-xl flex justify-center items-center'
            >
              Armar recibos
            </NavLink>

            <NavLink 
              to={'/receipts?content=modify_receipts'} 
              className='hover:scale-105 hover:bg-cyan-500 duration font-bold duration-300 border w-[150px] h-[100px] rounded-xl flex justify-center items-center'
            >
              Modificar recibos
            </NavLink>
          </ul>
        )
          
        : content === 'create_receipts' ? <CreateReceipts/>
        : content === 'modify_receipts' ? <ModifyReceipts/> 
        : ''
      }
    </div>
  )
}