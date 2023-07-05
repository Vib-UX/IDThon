import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Navigation from "./ui/Home";
import { Button, FormGroup, Paper } from "@mui/material";
import SimpleBackdrop from "./ui/Backdrop";
import axios from "axios";

const API_URL = "https://9d7c-103-183-229-61.ngrok-free.app";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function FormPropsTextFields() {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState({
    did: "",
    age: "",
    workExperience: "",
    salary: "",
  });

  const handleSubmit = async () => {
    try {
      const res = await axios.post(API_URL + "/api/get-vc", {
        id: data.did,
        age: data.age,
        experience: data.workExperience,
        lastYearSalaryINR: data.salary,
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <ThemeProvider theme={darkTheme}>
      <SimpleBackdrop open={open} setOpen={setOpen} />

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
