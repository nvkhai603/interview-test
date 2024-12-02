import { FixedSizeGrid, FixedSizeList } from 'react-window';
import { useState, useCallback, memo, useRef } from 'react';

const Cell = memo(({ style, value, onChange }) => {
  return (
    <div style={style} className="p-1">
      <input
        type="number"
        value={value || ''}
        onChange={onChange}
        className="w-full h-full border border-gray-300 text-center focus:outline-none focus:border-blue-500"
        min={1}
        max={9}
      />
    </div>
  );
});

const HeaderCell = memo(({ style, value }) => {
  return (
    <div style={style} className="bg-gray-100 flex items-center justify-center font-semibold">
      {value}
    </div>
  );
});

export const MatrixGrid = ({column = 15, row = 15}) => {
  const CELL_SIZE = 50;
  const GRID_SIZE = column;
  const SCROLLBAR_SIZE = 17;
  const HEADER_SIZE = CELL_SIZE;
  
  const [matrix, setMatrix] = useState(() => 
    Array(row).fill().map(() => Array(column).fill(''))
  );

  const columnHeaderRef = useRef(null);
  const rowHeaderRef = useRef(null);
  
  const validateInput = useCallback((value) => {
    if (value === '') return true;
    const num = Number(value);
    return !isNaN(num) && num >= 1 && num <= 9;
  }, []);

  const updateMatrix = useCallback((row, col, value) => {
    if (validateInput(value)) {
      setMatrix(prev => {s
        const newMatrix = [...prev];
        newMatrix[row] = [...newMatrix[row]];
        newMatrix[row][col] = value === '' ? '' : Number(value);
        return newMatrix;
      });
    }
  }, [validateInput]);

  const onScroll = useCallback(({ scrollLeft, scrollTop }) => {
    if (columnHeaderRef.current) {
      columnHeaderRef.current.scrollTo(scrollLeft);
    }
    if (rowHeaderRef.current) {
      rowHeaderRef.current.scrollTo(scrollTop);
    }
  }, []);

  return (
    <div className="relative bg-gray-100" style={{ width: (column > 10 ? CELL_SIZE * 10 + SCROLLBAR_SIZE: CELL_SIZE * (column + 1)) , height: row > 10 ? CELL_SIZE * 10 + SCROLLBAR_SIZE: CELL_SIZE * (row + 1)  }}>
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
          width={column > 10 ? CELL_SIZE * 10: CELL_SIZE * column + SCROLLBAR_SIZE}
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
          height={row > 10 ? CELL_SIZE * 10: CELL_SIZE * row}
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
          width={column > 10 ? CELL_SIZE * 10 : CELL_SIZE * column}
          height={row > 10 ? CELL_SIZE * 10: CELL_SIZE * row}
          onScroll={onScroll}
        >
          {({ columnIndex, rowIndex, style }) => (
            <Cell
              style={style}
              value={matrix[rowIndex][columnIndex]}
              onChange={(e) => updateMatrix(rowIndex, columnIndex, e.target.value)}
            />
          )}
        </FixedSizeGrid>
      </div>
    </div>
  );
}; 