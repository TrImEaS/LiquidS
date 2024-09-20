import { NavLink } from "react-router-dom";

export default function Home() {
  return( 
    <section className="flex flex-col w-full p-10">
      <ul className="flex flex-wrap gap-5">
        <NavLink 
          to={'/concepts'} 
          className='hover:scale-105 hover:bg-cyan-500 duration font-bold duration-300 border w-[150px] h-[100px] rounded-xl flex justify-center items-center'>
          Conceptos
        </NavLink>

        <NavLink 
          to={'/receipts'} 
          className='hover:scale-105 hover:bg-cyan-500 duration font-bold duration-300 border w-[150px] h-[100px] rounded-xl flex justify-center items-center'>
          Recibos
        </NavLink>
        
        <NavLink 
          to={'/print'} 
          className='hover:scale-105 hover:bg-cyan-500 duration font-bold duration-300 border w-[150px] h-[100px] rounded-xl flex justify-center items-center'>
          Imprimir
        </NavLink>
      </ul>
    </section>
  )
}