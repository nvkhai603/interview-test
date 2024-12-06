import {
    DataSheetGrid,
    checkboxColumn,
    textColumn,
    keyColumn,
    intColumn,
    createTextColumn
} from 'react-datasheet-grid'
import { useState, useMemo } from "react"
import { Button, Modal, Box } from "@mui/material"
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// Import the style only once in your app!
import 'react-datasheet-grid/dist/style.css'
import { pink } from '@mui/material/colors';
import axios from "axios"
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';

const modalLoadingStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};
function createMatrix(m, n, p) {
    // Kiểm tra xem m*n có đủ chỗ để chứa p số không
    if (m * n < p) {
        return null;
    }

    // Tạo mảng chứa các số từ 1 đến p
    let numbers = [];
    for (let i = 1; i <= p; i++) {
        numbers.push(i);
    }

    // Tạo mảng chứa các số còn lại để điền vào matrix
    let remainingNumbers = [];
    for (let i = 1; i < p; i++) {
        // Số cuối (p) chỉ xuất hiện 1 lần nên không thêm vào remainingNumbers
        const remainingSpaces = m * n - p;
        const repetitions = Math.floor(remainingSpaces / (p - 1));
        for (let j = 0; j < repetitions; j++) {
            remainingNumbers.push(i);
        }
    }

    // Thêm số vào nếu còn thiếu
    while (numbers.length + remainingNumbers.length < m * n) {
        const randomNum = Math.floor(Math.random() * (p - 1)) + 1;
        remainingNumbers.push(randomNum);
    }

    // Gộp tất cả số lại
    let allNumbers = [...numbers, ...remainingNumbers];

    // Trộn ngẫu nhiên mảng
    for (let i = allNumbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allNumbers[i], allNumbers[j]] = [allNumbers[j], allNumbers[i]];
    }

    // Tạo matrix
    let matrix = [];
    let index = 0;
    for (let i = 0; i < n; i++) {
        let row = [];
        for (let j = 0; j < m; j++) {
            row.push(allNumbers[index]);
            index++;
        }
        matrix.push(row);
    }

    return matrix;
}

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


export const MatrixGrid = ({ column = 3, row = 3, p = 9, oldMatrix = null, onNext, onBack = () => { } }) => {

    const [matrix, setMatrix] = useState(() => {
        if (oldMatrix) {
            return oldMatrix.map((x) => arrayToObject(x))
        }
        return Array(row).fill().map(() => arrayToObject(Array(column).fill(null)))
    }
    );

    const [processing, setProcessing] = useState(false);

    const [generating, setGenerating] = useState(false);

    const [cancelTokenSource, setCancelTokenSource] = useState(null)

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
            return <div className="p-2 bg-red-100 border border-red-500">
                <div className="flex space-x-2 items-center mb-2">
                    <NewReleasesIcon className="text-red-500" />
                    <div className="text-red-500">Ma trận của bạn chưa hợp lệ</div>
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

        return <div className="p-2 bg-green-100 border border-green-500">
            <div className="flex space-x-2 items-center mb-2">
                <CheckCircleIcon className="text-green-500" />
                <div className="text-green-500">Ma trận của bạn hợp lệ</div>
            </div>
            <div>
                Hãy nhấn "Giải bản đồ" để xem kết quả
            </div>
        </div>
    }, [errors])

    const generateSampleMatrix = () => {
        setGenerating(true)
        const sampleMatrix = createMatrix(column, row, p);
        let newMatrix = sampleMatrix.map((x) => arrayToObject(x));
        setMatrix(newMatrix);
        setTimeout(() => {
            setGenerating(false)
        }, 500)
    }

    const handleCancel = () => {
        console.log("OK")
        cancelTokenSource.cancel();
    }

    const renderProcessingModal = () => {
        return <Modal
            open={processing}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        ><Box sx={{ ...modalLoadingStyle, width: 400 }}>
                <div className="space-y-4 p-3 text-center">
                    <h2 id="text-lg font-bold">Đang xử lý, vui lòng đợi </h2>
                    <div>
                        <CircularProgress />
                    </div>
                    <Button variant="contained" color="error" onClick={handleCancel}>Hủy</Button>
                </div>
            </Box>
        </Modal>
    }

    const resolveMatrix = async () => {
        try {
            let source = axios.CancelToken.source()
            setCancelTokenSource(source);
            setProcessing(true)
            let input = {
                n: row,
                m: column,
                p: p,
                matrixMap: matrix.map(item => Object.values(item))
            }
            const { data, status } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/TreasureHunt`, input, { cancelToken: source.token });
            if (status == 200) {
                onNext(data)
            }
            setProcessing(false)
        } catch (error) {
            setProcessing(false)
            if (!axios.isCancel(error)) {
                console.error(error);
            }
        }
    }
    return (
        <div className="space-y-4">
            <div className="px-4 py-2 bg-orange-50 border-orange-500 border flex items-center space-x-4">
                <div>
                    {/* Chi tiết bản đồ bạn cần nhập đủ thông số cho một ma trận có cấu trúc được tạo từ bước trước.
                    Mỗi ô trong ma trận biểu thị cho một hòn đảo, bạn cần điền các số nguyên đại diện cho số thứ tự rương của hòn đảo đó. <br /> */}
                    <span className="text-orange-500 italic">Lưu ý: Hãy nhập và theo dõi trạng thái ma trận hợp lệ và nhấn "Giải bản đồ" để xem kết quả</span>
                </div>
                <div>
                    <LoadingButton loadingIndicator="Đang tạo..." className="w-[264px]" loading={generating} variant="contained" color="secondary" onClick={generateSampleMatrix}>Generate ngẫu nhiên</LoadingButton>
                </div>
            </div>

            <DataSheetGrid
                style={{ "--dsg-border-color": "#a1a1aa" }}
                value={matrix}
                onChange={(e, operations) => {
                    setMatrix(e)
                }}
                columns={columns}
                lockRows={true}
            />
           
            {renderProcessingModal()}
            <div className="flex space-x-1">
                <div className="flex items-center bg-blue-50 rounded-lg px-2">
                <Button onClick={onBack} color="secondary">Quay lại</Button>
                </div>
                <div className="grow">
                {renderErrorMessage}
                </div>
                <div className="flex items-center bg-blue-50 rounded-lg px-2" >
                <LoadingButton loadingIndicator="..." loading={processing} onClick={resolveMatrix} disabled={errors.length > 0} variant="contained">Giải bản đồ</LoadingButton>
                </div>
            </div>
        </div>
    )
}