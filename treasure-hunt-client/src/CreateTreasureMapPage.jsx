import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Alert } from '@mui/material';
import { MatrixInput } from './components/MatrixInput';
import { MatrixGrid } from './components/MatrixGrid';
import { TreasureHuntResult } from './components/TreasureHuntResult';
import { useState, useEffect } from "react"
import { useLocation, useSearchParams, useNavigate} from 'react-router';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import axios from "axios"
import SecondHeader from './components/SecondHeader';

const steps = ['Cấu trúc bản đồ', 'Chi tiết bản đồ', 'Kết quả giải bản đồ'];

function CreateTreasureMapPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const from = searchParams.get("from");

    const navigate = useNavigate()

    const [matrixInput, setMatrixInput] = useState({
        n: "",
        m: "",
        p: ""
    })

    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());
    const [result, setResult] = useState(null)

    const getOldTreasureHuntData = async () => {
        if (!from) {
            return
        }
        const { data, status } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/TreasureHunt/log/${from}`);
        if (status == 200) {
            let oldMatrix = null;
            try {
                oldMatrix = JSON.parse(data.matrixMap)
            } catch (error) {
            }
            setMatrixInput({
                n: data.n,
                m: data.m,
                p: data.p,
                matrixMap: oldMatrix
            })
            setActiveStep(1);
        }
    }

    useEffect(() => {
        getOldTreasureHuntData();
    }, [from])

    const renderActiveStepContent = () => {
        if (activeStep == 0) {
            return <MatrixInput m={matrixInput.m} n={matrixInput.n} p={matrixInput.p} onNext={(value) => {
                setMatrixInput(value);
                setActiveStep(1);
            }} />
        } else if (activeStep == 1) {
            return <MatrixGrid column={matrixInput.m} row={matrixInput.n} p={matrixInput.p} oldMatrix={matrixInput.matrixMap} onBack={() =>
                setActiveStep(0)
            } onNext={(value) => {
                setResult(value)
                setActiveStep(2);
            }} />
        } else if (activeStep == 2) {
            return <TreasureHuntResult value={result.treasureHuntLog}>
            </TreasureHuntResult>
        }
    }


    return (
        <div className='w-full h-dvh p-4 space-y-4'>
            <SecondHeader text={"Giải bản đồ"}/>
            <hr />
            <div className="space-y-6">
                <Stepper activeStep={activeStep}>
                    {steps.map((label, index) => {
                        const stepProps = {};
                        const labelProps = {};
                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                {renderActiveStepContent()}
            </div>
        </div>
    )
}

export default CreateTreasureMapPage
