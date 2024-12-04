import { Button } from "@mui/material"
export const TreasureHuntResult = ({ value }) => {
    let pathPoint = [];
    try {
        pathPoint = JSON.parse(value.path)
    } catch (e) {
        return console.error(e);
    }
    return <div className="space-y-6">
        <div className="p-4 bg-green-100 font-bold text-md border border-green-500">
            Lượng nhiên liệu nhỏ nhất tới kho báu: <span className="text-red-500">{value.distance}</span>
        </div>
        <div className="space-y-2">
            <div className="font-bold">Đường đi</div>
            <div className="p-3 bg-zinc-100 border overflow-auto flex space-x-3 items-center">
                {
                    pathPoint.map((point, index) => {
                        return <>
                            <div className={"w-10 flex items-center justify-center font-semibold rounded-full h-10 bg-green-600 text-white"} key={index}>
                                {`[${point[0]};${point[1]}]`}
                            </div>
                            {
                                index < pathPoint.length - 1  && <div>{"=>"}</div>
                            }
                        </>
                    })
                }
            </div>
        </div>
        <div className="space-y-2">
            <div className="font-bold">RawResponse</div>
            <pre className="p-3 bg-zinc-100 border overflow-auto">
                {JSON.stringify(value, null, 2)}
            </pre>
        </div>
        <div className="flex justify-between">
            <Button variant="contained">Trang chủ</Button>
        </div>
    </div>
}