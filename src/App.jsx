import { Routes, Route } from "react-router-dom"
import Home from './Pages/Home'
import Nav from "./Components/Nav"
import Concepts from "./Pages/Concepts"
import Receipts from "./Pages/Receipts"
import Print from "./Pages/Print"

export default function App() {
  return (
    <main className="flex bg-[#222] text-white m-0 p-0 font-body min-h-screen w-full">
      <Nav/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/concepts' element={<Concepts/>}/>
        <Route path='/receipts' element={<Receipts/>}/>
        <Route path='/print' element={<Print/>}/>
      </Routes>
    </main>
  )
}