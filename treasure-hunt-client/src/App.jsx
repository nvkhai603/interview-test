import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button, Alert} from '@mui/material'
import { CreateTreasureMap } from './components/CreateTreasureMap'
import { MatrixGrid } from './components/MatrixGrid'
import {useNavigate} from "react-router"

function App() {
  let navigate = useNavigate();
  return (
    <>
      <div className='w-full max-w-5xl mx-auto h-dvh p-4 space-y-4'>
        <h1 className='text-black text-xl font-black'>TreasureHuntProgram</h1>
        <Alert>Chương trình giúp hải tặc tìm đường đi tiết kiệm nhất tới kho báu</Alert>
        <Button onClick={() => {
          navigate("/treasure-hunt")
        }} variant="outlined">Giải bản đồ mới</Button>

        <h2 className='text-black text-lg font-black'>Lịch sử</h2>
      </div>
      {/* <CreateTreasureMap/> */}
      {/* <div className="flex items-center justify-center h-dvh">
      <MatrixGrid row={3} column={3} p={9}/>
      </div> */}
    </>
  )
}

export default App
