import React from 'react';
import { useParams, useLocation } from 'react-router';
import { TreasureHuntResult } from './components/TreasureHuntResult';
import SecondHeader from './components/SecondHeader';

const TreasureHuntDetailPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const rowData = location.state?.rowData; // Lấy dữ liệu dòng từ state

    return (
        <div className="h-dvh p-4 space-y-6">
            <SecondHeader text={`Chi tiết giải bản đồ #${id}`}/>
            <hr />
            {rowData ? (
                <TreasureHuntResult value={rowData}/>
            ) : (
                <p>Không có dữ liệu để hiển thị.</p>
            )}
        </div>
    );
};

export default TreasureHuntDetailPage; 