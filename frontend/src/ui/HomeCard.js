import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Button, TextField, Typography } from "@mui/material";
import CheckboxList from "./List";
import SendIcon from "@mui/icons-material/Send";

export default function SimplePaper({ setIsVerified }) {
  const isVerified =
    localStorage.getItem("isAgeVerified") === "true" &&
    localStorage.getItem("isSalaryVerified") === "true" &&
    localStorage.getItem("isExperienceVerified") === "true";
  return (
    <Box
      sx={{
        display: "flex",
        height: "70vh",
        justifyContent: "center",
        alignItems: "center",
        "& > :not(style)": {
          m: 1,
        },
      }}
    >
      <div
        style={{
          borderRadius: "20px",
          height: 400,
          width: 600,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "30px",
        }}
      >
        {isVerified ? (
          <Typography
            variant="h5"
            sx={{
              color: "#fff",
              textAlign: "center",
            }}
          >
            🎉You are now eligible for the requested loan amount
          </Typography>
        ) : (
          <Typography
            variant="h5"
            sx={{
              color: "#fff",
              textAlign: "center",
            }}
          >
            Follow this to verify yourself to get a loan
          </Typography>
        )}

        <CheckboxList />
        {isVerified ? (
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                marginTop: "20px",
              }}
            >
              <div>Enter your account number</div>
              <TextField
                id="outlined-number"
                placeholder="HDFC: 791500584504"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
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
        ) : (
          <Button
            variant="contained"
            style={{
              backgroundColor: "#8d2cab",
              width: "60%",
              fontWeight: "normal",
              color: "#fff",
              padding: "10px",
            }}
            onClick={() => setIsVerified(true)}
          >
            Start verfication
          </Button>
        )}
      </div>
    </Box>
  );
}
