import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Navigation from "./ui/Home";
import { Button, FormGroup, Paper } from "@mui/material";
import SimpleBackdrop from "./ui/Backdrop";
import axios from "axios";
import QRCodeModel from "./ui/QrCodeModel";

const API_URL = process.env.REACT_APP_VERIFICATION_SERVER_PUBLIC_URL;

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
const _data = {
  body: {
    credentials: [
      {
        description:
          "https://raw.githubusercontent.com/Vib-UX/IDThon/main/schemas/jsonld/bank-loan-credential-v1.jsonld#BankLoanVerificationCredential",
        id: "9fea8357-1b54-11ee-9bfb-0242ac120006",
      },
    ],
    url: "https://1243-2405-201-4024-504b-4961-d423-8480-7335.ngrok-free.app/v1/agent",
  },
  from: "did:polygonid:polygon:mumbai:2qPHzNFJBcpXvobxHphC1jP67BwsSC7PMUsKpXFdvA",
  id: "2dbc7a99-6c9a-4a2b-ae64-03ba8fd94d88",
  thid: "2dbc7a99-6c9a-4a2b-ae64-03ba8fd94d88",
  to: "did:polygonid:polygon:mumbai:2qPuCSnY8DQ6QENGL9Ht8uWKXaWBoKrpc5duATVwkQ",
  typ: "application/iden3comm-plain-json",
  type: "https://iden3-communication.io/credentials/1.0/offer",
};
export default function FormPropsTextFields() {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isQrOpen, setIsQrOpen] = React.useState(false);
  const [qrCode, setQrCode] = React.useState("");
  const [data, setData] = React.useState({
    did: "",
    age: "",
    workExperience: "",
    salary: "",
  });

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const res = await axios.post(API_URL + "/api/get-vc", {
        id: data.did,
        age: data.age,
        experience: data.workExperience,
        lastYearSalaryINR: data.salary,
      });
      const axiosdata = res.data;
      setIsLoading(false);
      setQrCode(axiosdata);
      setIsQrOpen(true);
    } catch (error) {
      setIsLoading(false);
      setQrCode(null);
      console.log(error);
    }
  };
  return (
    <ThemeProvider theme={darkTheme}>
      <SimpleBackdrop open={isLoading} setOpen={setIsLoading} />
      <QRCodeModel open={isQrOpen} qrCodeData={qrCode} />
      <CssBaseline />
      <Navigation />
      <Box
        component="form"
        sx={{
          display: "flex",
          marginTop: "100px",
          "& .MuiTextField-root": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <FormGroup
          style={{
            margin: "auto",
          }}
        >
          <Paper
            style={{
              borderRadius: "10px",
              padding: "20px",
              margin: "auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <TextField
              id="outlined-number"
              label="Enter DID"
              value={data.did}
              onChange={(e) => setData({ ...data, did: e.target.value })}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <div
              style={{
                height: "20px",
              }}
            />
            <TextField
              id="outlined-number"
              label="Enter age"
              type="number"
              value={data.age}
              onChange={(e) => setData({ ...data, age: e.target.value })}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <div
              style={{
                height: "20px",
              }}
            />
            <TextField
              id="outlined-number"
              label="Enter no of work experience"
              value={data.workExperience}
              onChange={(e) =>
                setData({ ...data, workExperience: e.target.value })
              }
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <div
              style={{
                height: "20px",
              }}
            />
            <TextField
              id="outlined-number"
              label="Enter salary in USD"
              type="number"
              value={data.salary}
              onChange={(e) => setData({ ...data, salary: e.target.value })}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <div
              style={{
                height: "20px",
              }}
            />
            <Button
              variant="contained"
              style={{
                backgroundColor: "#8d2cab",
                fontWeight: "normal",
                color: "#fff",
              }}
              onClick={() => {
                handleSubmit();
              }}
            >
              Submit
            </Button>
          </Paper>
        </FormGroup>
      </Box>
    </ThemeProvider>
  );
}
