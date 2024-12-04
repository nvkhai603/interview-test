import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Alert } from '@mui/material';
import { MatrixGrid } from './components/MatrixGrid';
import { CreateTreasureMapStep1 } from './components/CreateTreasureMapStep1';
import { MatrixGrid2 } from './components/MatrixGrid2';
import { TreasureHuntResult } from './components/TreasureHuntResult';
import { useState } from "react"

const steps = ['Cấu trúc bản đồ', 'Chi tiết bản đồ', 'Kết quả giải bản đồ'];

function CreateTreasureMap() {

    const [matrixInput, setMatrixInput] = useState({
        n: "",
        m: "",
        p: ""
    })
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());
    const [result, setResult] = useState(null)

    const renderActiveStepContent = () => {
        if (activeStep == 0) {
            return <CreateTreasureMapStep1 onNext={(value) => {
                setMatrixInput(value);
                setActiveStep(1);
            }} />
        } else if (activeStep == 1) {
            return <MatrixGrid2 column={matrixInput.m} row={matrixInput.n} p={matrixInput.p} onNext={(value) => {
                setResult(value)
                setActiveStep(2);
            }} />
        } else if (activeStep == 2) {
            return <TreasureHuntResult value={result}>
            </TreasureHuntResult>
        }
    }


    return (
        <div className='w-full max-w-3xl mx-auto h-dvh p-4 space-y-4'>
            <h1 className='text-black text-xl font-black'>Giải bản đồ</h1>
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

export default CreateTreasureMap
