import { Button } from "@mui/material"
import { useNavigate } from "react-router"

export const TreasureHuntResult = ({ value }) => {
    const navigate = useNavigate();
    let pathPoint = [];
    try {
        pathPoint = JSON.parse(value.path)
    } catch (e) {
        return console.error(e);
    }

    const handleRetry = () => {
        navigate(`/treasure-hunt?from=${value.id}`);
    };

    return <div className="space-y-4">
        <div className="p-4 bg-green-100 font-semibold">
            Lượng nhiên liệu nhỏ nhất để lấy được kho báu: <span className="text-red-500">{value.distance}</span>
        </div>
        <div className="space-y-2">
            <div className="font-semibold text-red-500">Đường đi</div>
            <div className="p-3 bg-zinc-100 border overflow-auto flex space-x-3 items-center">
                {
                    pathPoint.map((point, index) => {
                        return <>
                            <div className={"w-10 min-w-10 text-xs flex items-center justify-center font-semibold rounded-full h-10 bg-green-600 text-white"} key={index}>
                                {`[${point[0]};${point[1]}]`}
                            </div>
                            {
                                index < pathPoint.length - 1 && <div>{"=>"}</div>
                            }
                        </>
                    })
                }
            </div>
        </div>
        <div className="space-y-2">
            <div className="font-semibold text-red-500">Raw</div>
            <pre className="p-3 bg-zinc-100 border overflow-auto">
                {JSON.stringify(value, null, 2)}
            </pre>
        </div>
        <div className="flex justify-between p-4 border-t">
            <Button variant="contained" color="secondary" onClick={handleRetry}>Giải lại</Button>
            <Button variant="contained" onClick={() => navigate("/")}>Trang chủ</Button>
        </div>
    </div>
}