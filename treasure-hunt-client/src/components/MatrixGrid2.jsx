import {
    DataSheetGrid,
    checkboxColumn,
    textColumn,
    keyColumn,
    intColumn,
    createTextColumn
} from 'react-datasheet-grid'
import { useState, useMemo } from "react"
import { Button } from "@mui/material"
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// Import the style only once in your app!
import 'react-datasheet-grid/dist/style.css'
import { pink } from '@mui/material/colors';
import axios from "axios"

const arrayToObject = (list) => {
    let oj = {}
    list.forEach((item, index) => {
        oj[`col-${index}`] = item
    });
    return oj
}

const ERROR_MESSAGES = {
    "NOT_FULL_INPUT": "Bạn phải nhập tất cả các ô trong ma trận",
    "P_BIG_THAN_1": "Số [P_BIG_THAN_1] chỉ được xuất hiện duy nhất 1 lần trên ma trận",
    "NOT_SEQUENCE": "Tất cả các số từ [NOT_SEQUENCE] phải xuất hiện trên ma trận"
}

export const MatrixGrid2 = ({ column = 3, row = 3, p = 9, onNext }) => {

    const [matrix, setMatrix] = useState(() =>
        Array(row).fill().map(() => arrayToObject(Array(column).fill(null)))
    );

    const errors = useMemo(() => {
        let errors = [];
        let sheetValues = []
        for (let i = 0; i < matrix.length; i++) {
            const row = matrix[i];
            for (let j = 0; j < Object.keys(row).length; j++) {
                const col = row[`col-${j}`];
                sheetValues.push(col);
                if (!col && errors.indexOf("NOT_FULL_INPUT") == -1) {
                    errors.push("NOT_FULL_INPUT")
                }
            }
        }

        const pCount = sheetValues.filter(x => x === p).length;
        if (pCount > 1) {
            errors.push("P_BIG_THAN_1")
        }

        for (let i = 1; i <= p; i++) {
            if (sheetValues.indexOf(i) == -1 && errors.indexOf("NOT_SEQUENCE") == -1) {
                errors.push("NOT_SEQUENCE");
                break;
            }
        }

        return errors;

    }, [matrix])

    const customIntColumn = createTextColumn({
        alignRight: true,
        formatBlurredInput: (value) =>
            typeof value === 'number' ? new Intl.NumberFormat().format(value) : '',
        parseUserInput: (value) => {
            const number = parseFloat(value)
            if (number < 1) {
                return 1
            }
            if (number > p) {
                return null
            }
            return !isNaN(number) ? Math.round(number) : null
        },
        parsePastedValue: (value) => {
            const number = parseFloat(value)
            if (number < 1) {
                return 1
            }
            if (number > p) {
                return null
            }
            return !isNaN(number) ? Math.round(number) : null
        },
    })

    const columns = Array(column).fill().map((item, index) => {
        return { ...keyColumn(`col-${index}`, customIntColumn), title: `${index + 1}` }
    });

    const renderErrorMessage = useMemo(() => {
        if (errors.length > 0) {
            return <div className="p-4 bg-red-100 border border-red-500">
                <div className="flex space-x-2 items-center mb-2">
                    <NewReleasesIcon className="text-red-500" />
                    <div className="font-bold text-red-500 text-md">Ma trận của bạn chưa hợp lệ</div>
                </div>
                <ul className="list-disc list-inside">
                    {
                        errors.map((errorCode, index) => {
                            return <li key={index}>{ERROR_MESSAGES[errorCode]
                                .replace("P_BIG_THAN_1", p)
                                .replace("NOT_SEQUENCE", `1-${p}`)}</li>
                        })
                    }
                </ul>
            </div>
        }

        return <div className="p-4 bg-green-100 border border-green-500">
            <div className="flex space-x-2 items-center mb-2">
                <CheckCircleIcon className="text-green-500" />
                <div className="font-bold text-green-500 text-md">Ma trận của bạn hợp lệ</div>
            </div>
            <div>
                Hãy nhấn "Giải bản đồ" để xem kết quả
            </div>
            </div>
    }, [errors])

    const resolveMatrix = async () => {
        let input = {
            n: row,
            m: column,
            p: p,
            matrixMap: matrix.map(item => Object.values(item))
        }
        const {data, status} = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/TreasureHunt`, input );
        if (status == 200) {
            onNext(data)  
        }
    }
    return (
        <div className="space-y-6">
            <DataSheetGrid
                value={matrix}
                onChange={(e, operations) => {
                    setMatrix(e)
                }}
                columns={columns}
                lockRows={true}
            />
            {renderErrorMessage}
           <div className="flex justify-between">
           <Button color="secondary">Quay lại</Button> 
           <Button onClick={resolveMatrix} disabled={errors.length > 0} variant="contained">Giải bản đồ</Button>
           </div>
        </div>
    )
}