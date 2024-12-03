import { FixedSizeGrid, FixedSizeList, areEqual } from 'react-window';
import { useState, useCallback, memo, useRef, useEffect } from 'react';
import { Button, TextField } from "@mui/material"

const Cell = memo(({ rowIndex, columnIndex, style, value, onChange }) => {
  const [initialValue, setInitialValue] = useState(value)
  return (
    <div style={style} className="p-1">
      <input
        id={`cell-${rowIndex}-${columnIndex}`}
        name={`cell-${rowIndex}-${columnIndex}`}
        type="number"
        value={initialValue ?? ""}
        onChange={(e) => {
          console.log(e.target.value)
          const num = Number(e.target.value);
          if (!Number.isNaN(num)) {
            setInitialValue(num)
            onChange(rowIndex, columnIndex,num)
          }
          // onChange(rowIndex, columnIndex, e.target.value)
        }}
        onFocus={(e) => e.target.select()}
        className="w-full h-full border border-gray-300 text-center focus:outline-none focus:border-blue-600 text-xs rounded"
        min={1}
        max={500}
      />
    </div>
  );
}, areEqual);

const HeaderCell = memo(({ style, value }) => {
  return (
    <div style={style} className="bg-gray-100 flex items-center justify-center font-black text-xs text-blue-500">
      {value}
    </div>
  );
});

export const MatrixGrid = memo(({ column = 3, row = 3, p = 9, onNext }) => {
  console.log("Render Matrix Grid")
  const CELL_SIZE = 50;
  const GRID_SIZE = column;
  const SCROLLBAR_SIZE = 17;
  const HEADER_SIZE = CELL_SIZE;

  const [matrix, setMatrix] = useState(() =>
    Array(row).fill().map(() => Array(column).fill(null))
  );

  const columnHeaderRef = useRef(null);
  const rowHeaderRef = useRef(null);

  const validateInput = useCallback((value) => {
    // if (value === '') return true;
    // const num = Number(value);
    // return !isNaN(num) && num >= 1 && num <= 500;
    return true
  }, []);

  const updateMatrix = (row, col, value) => {
    if (validateInput(value)) {
      setMatrix(prev => {
        const newMatrix = [...prev];
        newMatrix[row] = [...newMatrix[row]];
        newMatrix[row][col] = value === '' ? '' : Number(value);
        return newMatrix;
      });
    }
  };

  const onScroll = useCallback(({ scrollLeft, scrollTop }) => {
    if (columnHeaderRef.current) {
      columnHeaderRef.current.scrollTo(scrollLeft);
    }
    if (rowHeaderRef.current) {
      rowHeaderRef.current.scrollTo(scrollTop);
    }
  }, []);

  return (
    <div className="flex flex-col space-y-8">
      <div className="flex space-x-4">
        <div className="relative bg-gray-100" style={{ width: (column > 10 ? CELL_SIZE * 11 + SCROLLBAR_SIZE : CELL_SIZE * (column + 1)), height: row > 10 ? CELL_SIZE * 11 + SCROLLBAR_SIZE : CELL_SIZE * (row + 1) }}>
          {/* Corner */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: HEADER_SIZE,
              height: HEADER_SIZE,
              zIndex: 3,
              backgroundColor: '#f3f4f6'
            }}
          />

          {/* Column Headers */}
          <div style={{ position: 'absolute', left: HEADER_SIZE, top: 0, height: HEADER_SIZE, zIndex: 2 }}>
            <FixedSizeList
              ref={columnHeaderRef}
              height={HEADER_SIZE}
              itemCount={column}
              itemSize={CELL_SIZE}
              width={column > 10 ? CELL_SIZE * 10 : CELL_SIZE * column}
              layout="horizontal"
              style={{ overflow: 'hidden' }}
            >
              {({ index, style }) => (
                <HeaderCell style={style} value={index + 1} />
              )}
            </FixedSizeList>
          </div>

          {/* Row Headers */}
          <div style={{ position: 'absolute', top: HEADER_SIZE, left: 0, width: HEADER_SIZE, zIndex: 2 }}>
            <FixedSizeList
              ref={rowHeaderRef}
              height={row > 10 ? CELL_SIZE * 10 : CELL_SIZE * row}
              itemCount={row}
              itemSize={CELL_SIZE}
              width={HEADER_SIZE}
              style={{ overflow: 'hidden' }}
            >
              {({ index, style }) => (
                <HeaderCell style={style} value={index + 1} />
              )}
            </FixedSizeList>
          </div>

          {/* Main Grid */}
          <div style={{ position: 'absolute', top: HEADER_SIZE, left: HEADER_SIZE }} className='bg-blue-100'>
            <FixedSizeGrid
              columnCount={column}
              rowCount={row}
              rowHeight={CELL_SIZE}
              columnWidth={CELL_SIZE}
              width={column > 10 ? CELL_SIZE * 10 + SCROLLBAR_SIZE : CELL_SIZE * column}
              height={row > 10 ? CELL_SIZE * 10 + SCROLLBAR_SIZE : CELL_SIZE * row}
              onScroll={onScroll}
            >
              {({ columnIndex, rowIndex, style }) => (
                <Cell
                  rowIndex={rowIndex}
                  columnIndex={columnIndex}
                  style={style}
                  value={""}
                  onChange={updateMatrix}
                />
              )}
            </FixedSizeGrid>
          </div>
        </div>

        <div className="grow bg-blue-50 p-4">
          <div className="text-blue-600 font-black">
            Rules
          </div>

          <div className="text-red-600 font-black">
            Validate 
          </div>
          ABC
        </div>
      </div>
      <div>
        <div className="flex justify-between">
          <Button color="secondary" onClick={() => {
            onNext(matrix);
          }}>Quay lại</Button>
          <Button variant="contained"
            color="primary" onClick={() => {
              onNext(matrix);
            }}>Giải bản đồ</Button>
        </div>
      </div>
    </div>
  );
}); 