import { Routes, Route } from "react-router-dom"
import Home from "./Pages/Home"

export default function App() {
  return (
    <main className="flex flex-col m-0 p-0 bg-[#111] min-h-screen w-full">
      <Routes>
        <Route path='/' element={<Home/>}/>
      </Routes>
    </main>
  )
}