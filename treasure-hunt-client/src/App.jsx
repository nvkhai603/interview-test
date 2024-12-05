import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button, Alert } from '@mui/material'
import { useNavigate } from "react-router"
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios"

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = Date.now();
  const seconds = Math.floor((now - 7 * 60 * 60 * 1000 - date) / 1000);

  if (seconds < 60) return `${seconds} giây trước`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày ${hours % 24} giờ trước`;
};

const columns = [
  { field: 'id', headerName: 'ID', width: 5, headerAlign: "center", align: "center" },
  {
    field: 'n',
    headerName: 'N',
    headerAlign: "center",
    type: 'number',
    width: 64,
    editable: false,
    align: "center"
  },
  {
    field: 'm',
    headerName: 'M',
    width: 64,
    type: 'number',
    headerAlign: "center",
    editable: false,
    align: "center"
  },
  {
    field: 'p',
    headerName: 'P',
    type: 'number',
    width: 64,
    headerAlign: "center",
    editable: false,
    align: "center"
  },
  {
    field: 'distance',
    headerName: 'Nhiên liệu',
    type: 'string',
    headerAlign: "left",
    align: "left",
    width: 200,
    editable: false
  },
  {
    field: 'createdDate',
    headerName: 'Tạo lúc',
    headerAlign: "left",
    width: 200,
    editable: false,
    valueGetter: (value, row) => {
      return formatDate(value);
    },
  }
];

const author = {
  Author: "Nguyễn Văn Khải",
  Phone: "0778580934",
  Email: "khai.prod.svc@gmail.com"
}

function App() {
  let navigate = useNavigate();

  const [treasureHuntLogs, setTreasureHuntLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [totalRows, setTotalRows] = useState(0);
  const [sortModel, setSortModel] = useState([]);

  const fetchData = async (page, pageSize, sortModel) => {
    const sortBy = sortModel.length > 0 ? sortModel[0].field : null;
    const ascending = sortModel.length > 0 ? (sortModel[0].sort == "asc" ? true : false) : null;

    const { data, status, headers } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/TreasureHunt/log`, {
      params: { page, pageSize, sortBy, ascending }
    });
    if (status === 200) {
      setTreasureHuntLogs(data.data);
      setTotalRows(data.totalCount);
    }
  }

  useEffect(() => {
    fetchData(page, pageSize, sortModel);
  }, [page, pageSize, sortModel]);

  return (
    <>
      <div className='w-full h-dvh p-4 space-y-4 flex flex-col'>
        <div className="space-y-6">
          <h1 className='text-black text-xl font-black text-blue-500'>TreasureHuntProgram</h1>
          <div className="p-6 bg-zinc-50 border space-y-4 text-center">
            <div className="font-bold">Chơng trình giúp hải tặc tìm đường đi tiết kiệm nhất tới kho báu</div>
            <pre className="text-xs text-red-500">
              {`${author.Author} | ${author.Phone} | ${author.Email}`}
            </pre>
            <Button onClick={() => {
              navigate("/treasure-hunt")
            }} variant="contained">Giải bản đồ mới</Button>
          </div>
          <h2 className='text-black text-lg font-black text-blue-500'>Lịch sử giải bản đồ</h2>
        </div>
        <DataGrid
          className="grow"
          rows={treasureHuntLogs}
          columns={columns}
          density="compact"
          pagination
          paginationMode="server"
          rowSpacingType="border"
          showCellVerticalBorder
          rowCount={totalRows}
          pageSize={pageSize}
          sortingMode="server"
          columnMenu={false}
          disableColumnMenu={true}
          headerAlign="center"
          sortModel={sortModel}
          onSortModelChange={(model) => {
            console.log(model);
            setSortModel(model);
          }}
          onPaginationModelChange={(model) => {
            setPage(model.page + 1);
            setPageSize(model.pageSize);
          }}
          disableRowSelectionOnClick
          onRowDoubleClick={(params) => {
            navigate(`/treasure-hunt/${params.row.id}`, { state: { rowData: params.row } });
          }}
        />
      </div>
    </>
  )
}

export default App
