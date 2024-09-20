import { useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { NavLink } from "react-router-dom";

export default function Nav() {
  const [hideNav, setHideNav] = useState(false)

  return (
    <nav className={`${hideNav ? 'border-l-4 w-7' : 'border-r-2 w-[150px] px-5 py-10'} flex justify-center`}>
      <div className="fixed">
        {hideNav 
          ? <FaAngleRight onClick={()=> setHideNav(!hideNav)} className="absolute text-xl cursor-pointer hover:text-cyan-500 duration-300 top-2 -right-3"/> 
          : <FaAngleLeft onClick={()=> setHideNav(!hideNav)} className="absolute text-xl cursor-pointer hover:text-cyan-500 duration-300 -top-8 -right-6"/>
        }

        <ul className={`${hideNav && 'hidden'} flex flex-col gap-10`}>
          <NavLink to='/' className='hover:text-cyan-500 duration font-bold duration-300 border-b hover:border-cyan-500 border-transparent'>
            Home
          </NavLink>
          
          <NavLink to='/concepts' className='hover:text-cyan-500 duration font-bold duration-300 border-b hover:border-cyan-500 border-transparent'>
            Conceptos
          </NavLink>
          
          <NavLink to='/receipts' className='hover:text-cyan-500 duration font-bold duration-300 border-b hover:border-cyan-500 border-transparent'>
            Recibos
          </NavLink>
          
          <NavLink to='/print' className='hover:text-cyan-500 duration font-bold duration-300 border-b hover:border-cyan-500 border-transparent'>
            Imprimir
          </NavLink>
        </ul>
      </div>
    </nav>
  )
}