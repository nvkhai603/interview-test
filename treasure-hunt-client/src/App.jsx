import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button, Alert } from '@mui/material'
import { CreateTreasureMap } from './components/CreateTreasureMap'
import { MatrixGrid } from './components/MatrixGrid'
import { useNavigate } from "react-router"
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios"

const formatDate = (dateString) => {
console.log(dateString)
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return `${seconds} giây trước`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày ${hours % 24} giờ trước`;
};

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'n',
    headerName: 'N',
    type: 'number',
    width: 50,
    editable: false,
    renderCell: (params) => (
      <div style={{ textAlign: 'center' }}>{params.value}</div>
    ),
  },
  {
    field: 'm',
    headerName: 'M',
    type: 'number',
    width: 64,
    editable: false,
    renderCell: (params) => (
      <div style={{ textAlign: 'center' }}>{params.value}</div>
    ),
  },
  {
    field: 'p',
    headerName: 'P',
    type: 'number',
    width: 64,
    editable: false,
    renderCell: (params) => (
      <div style={{ textAlign: 'center' }}>{params.value}</div>
    ),
  },
  {
    field: 'distance',
    headerName: 'Nhiên liệu',
    type: 'number',
    width: 128,
    editable: false,
    renderCell: (params) => (
      <div style={{ textAlign: 'center' }}>{params.value}</div>
    ),
  },
  {
    field: 'createdDate',
    headerName: 'Thời gian tạo',
    width: 200,
    editable: false,
    valueGetter: (value, row) => {
      return formatDate(value);
    },
  }
];

function App() {
  let navigate = useNavigate();

  const [treasureHuntLogs, setTreasureHuntLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalRows, setTotalRows] = useState(0);

  const fetchData = async (page, pageSize) => {
    const { data, status, headers } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/TreasureHunt/log`, {
      params: { page, pageSize }
    });
    if (status === 200) {
      setTreasureHuntLogs(data);
      setTotalRows(parseInt(headers['x-total-count'], 10));
    }
  }

  useEffect(() => {
    fetchData(page, pageSize);
  }, [page, pageSize]);

  return (
    <>
      <div className='w-full max-w-3xl mx-auto h-dvh p-4 space-y-4'>
        <h1 className='text-black text-xl font-black'>TreasureHuntProgram</h1>
        <div className="p-4 bg-green-100 font-bold border-dotted border-2 border-green-500">Chương trình giúp hải tặc tìm đường đi tiết kiệm nhất tới kho báu</div>
        <Button onClick={() => {
          navigate("/treasure-hunt")
        }} variant="outlined">Giải bản đồ mới</Button>

        <h2 className='text-black text-lg font-black'>Lịch sử</h2>
        <div>
          <DataGrid
            rows={treasureHuntLogs}
            columns={columns}
            rowHeight={38}
            pagination
            paginationMode="server"
            rowCount={totalRows}
            pageSize={pageSize}
            onPaginationModelChange={(model) => {
              setPage(model.page);
              setPageSize(model.pageSize);
            }}
            disableRowSelectionOnClick
          />
        </div>
      </div>
    </>
  )
}

export default App
