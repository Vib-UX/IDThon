import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AgeVerifier from "./AgeVerifier";
import SalaryVerifier from "./SalaryVerifier";
import ExperienceVerifier from "./ExperienceVerifier";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import { TextField } from "@mui/material";

const steps = [
  "Verfiy your age",
  "Verfiy your experience",
  "Verfiy your income",
];

export default function HorizontalLinearStepper({ setIsVerified }) {
  const [activeStep, setActiveStep] = React.useState(0);
  const { width, height } = useWindowSize();
  const [skipped, setSkipped] = React.useState(new Set());
  const [txState, setTxState] = React.useState({
    isAgeVerified: false,
    isExperienceVerified: false,
    isSalaryVerified: false,
  });

  const isStepOptional = (step) => {
    return step === 1;
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

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        flexDirection: "column",
        maxWidth: "70%",
        margin: "0 auto",
        marginTop: "100px",
        alignItems: "center",
        width: "100%",
      }}
    >
      {activeStep === steps.length && (
        <Confetti width={width} height={height} />
      )}

      <Stepper
        activeStep={activeStep}
        style={{
          width: "100%",
        }}
      >
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step
              key={label}
              {...stepProps}
              sx={{
                "& .MuiStepLabel-root .Mui-completed": {
                  color: "secondary.dark", // circle color (COMPLETED)
                },
                "& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel":
                  {
                    color: "grey.500", // Just text label (COMPLETED)
                  },
                "& .MuiStepLabel-root .Mui-active": {
                  color: "secondary.main", // circle color (ACTIVE)
                },
                "& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel":
                  {
                    color: "common.white", // Just text label (ACTIVE)
                  },
                "& .MuiStepLabel-root .Mui-active .MuiStepIcon-text": {
                  fill: "black", // circle's number (ACTIVE)
                },
              }}
            >
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <div
            style={{
              height: "400px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h1
              style={{
                fontSize: "20px",
              }}
            >
              🎉You are now eligible for the requested loan amount
            </h1>
            <div
              style={{
                height: "20px",
              }}
            />
            <div>Enter your account number</div>
            <TextField
              id="outlined-number"
              placeholder="HDFC: 791500584504"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#8d2cab",
                  marginTop: "20px",
                  fontWeight: "normal",
                  color: "#fff",
                }}
                onClick={() => {
                  setIsVerified(false);
                }}
              >
                Transfer Funds
              </Button>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#8d2cab",
                  marginTop: "20px",
                  fontWeight: "normal",
                  marginLeft: "20px",
                  color: "#fff",
                }}
                onClick={() => {
                  setIsVerified(false);
                }}
              >
                Connect wallet
              </Button>
            </div>
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            {activeStep === 0 && (
              <AgeVerifier
                publicServerURL={
                  process.env.REACT_APP_VERIFICATION_SERVER_PUBLIC_URL
                }
                localServerURL={
                  process.env.REACT_APP_VERIFICATION_SERVER_LOCAL_HOST_URL
                }
                credentialType={"KYCAgeCredential"}
                issuerOrHowToLink={
                  "https://oceans404.notion.site/How-to-get-a-Verifiable-Credential-f3d34e7c98ec4147b6b2fae79066c4f6?pvs=4"
                }
                onVerificationResult={() => {
                  localStorage.setItem("isAgeVerified", true);
                  handleNext();
                }}
              />
            )}
            {activeStep === 1 && (
              <ExperienceVerifier
                publicServerURL={
                  process.env.REACT_APP_VERIFICATION_SERVER_PUBLIC_URL
                }
                localServerURL={
                  process.env.REACT_APP_VERIFICATION_SERVER_LOCAL_HOST_URL
                }
                credentialType={"KYCAgeCredential"}
                issuerOrHowToLink={
                  "https://oceans404.notion.site/How-to-get-a-Verifiable-Credential-f3d34e7c98ec4147b6b2fae79066c4f6?pvs=4"
                }
                onVerificationResult={() => {
                  localStorage.setItem("isExperienceVerified", true);
                  handleNext();
                }}
              />
            )}
            {activeStep === 2 && (
              <SalaryVerifier
                publicServerURL={
                  process.env.REACT_APP_VERIFICATION_SERVER_PUBLIC_URL
                }
                localServerURL={
                  process.env.REACT_APP_VERIFICATION_SERVER_LOCAL_HOST_URL
                }
                credentialType={"KYCAgeCredential"}
                issuerOrHowToLink={
                  "https://oceans404.notion.site/How-to-get-a-Verifiable-Credential-f3d34e7c98ec4147b6b2fae79066c4f6?pvs=4"
                }
                onVerificationResult={() => {
                  localStorage.setItem("isSalaryVerified", true);
                  handleNext();
                }}
              />
            )}
          </Typography>
          {/* <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              disabled={!txState.isAgeVerified}
              style={{
                fontWeight: "normal",
                backgroundColor: "#8d2cab",
                color: "#fff",
              }}
              onClick={handleNext}
            >
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box> */}
        </React.Fragment>
      )}
    </Box>
  );
}
