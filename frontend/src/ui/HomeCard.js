import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Button, Typography } from "@mui/material";
import CheckboxList from "./List";
import SendIcon from "@mui/icons-material/Send";

export default function SimplePaper({ isVerified, setIsVerified }) {
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
        <Typography
          variant="h5"
          sx={{
            color: "#fff",
            textAlign: "center",
          }}
        >
          Follow this to verify yourself to get a loan
        </Typography>
        <CheckboxList />
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
      </div>
    </Box>
  );
}
