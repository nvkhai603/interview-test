import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button, Alert} from '@mui/material'
import { CreateTreasureMap } from './components/CreateTreasureMap'
import { MatrixGrid } from './components/MatrixGrid'
function App() {
  return (
    <>
      {/* <div className='w-full max-w-2xl mx-auto h-dvh p-4 space-y-4'>
        <h1 className='text-black text-xl font-black'>Tìm kho báu</h1>
        <Alert>Chương trình giúp hải tặc tìm đường đi tiết kiệm nhất tới kho báu</Alert>
        <Button variant="outlined">Giải bản đồ mới</Button>

        <h2 className='text-black text-lg font-black'>Danh sách lượt giải</h2>
      </div> */}
      <CreateTreasureMap/>
      {/* <MatrixGrid/> */}
    </>
  )
}

export default App
