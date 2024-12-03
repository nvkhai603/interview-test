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

    const isStepOptional = (step) => {
        return false;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const onSubmit = (input) => {
        console.log(input)
    }

    const renderActiveStepContent = () => {
        if (activeStep == 0) {
            return <CreateTreasureMapStep1 onNext={(values) => {
                setMatrixInput(values);
                setActiveStep(1);
            }} />
        } else if (activeStep == 1) {
            return <MatrixGrid column={matrixInput.m} row={matrixInput.n} p={matrixInput.p} onNext={(matrixMap) => {
                let i = { ...matrixInput, matrixMap: matrixMap };
                setMatrixInput(i)
                onSubmit(i)
            }} />
        }
    }

    return (
        <div className='w-full max-w-5xl mx-auto h-dvh p-4 space-y-4'>
            <h1 className='text-black text-xl font-black'>Giải bản đồ</h1>
            <div className="space-y-6">
                <Stepper activeStep={activeStep}>
                    {steps.map((label, index) => {
                        const stepProps = {};
                        const labelProps = {};
                        if (isStepOptional(index)) {
                            labelProps.optional = (
                                <Typography variant="caption">Optional</Typography>
                            );
                        }
                        if (isStepSkipped(index)) {
                            stepProps.completed = false;
                        }
                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                {activeStep === steps.length ? (
                    <React.Fragment>
                        <Typography sx={{ mt: 2, mb: 1 }}>
                            All steps completed - you&apos;re finished
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button onClick={handleReset}>Reset</Button>
                        </Box>
                    </React.Fragment>

                ) : (
                    renderActiveStepContent()
                )}
            </div>
        </div>
    )
}

export default CreateTreasureMap
