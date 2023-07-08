import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export default function SimpleBackdrop({ open, setOpen }) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
      onClick={handleClose}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress color="inherit" />
        <p
          style={{
            textAlign: "center",
            marginTop: "10px",
          }}
        >
          Generating your QR code, please wait while we verify your identity...
        </p>
      </div>
    </Backdrop>
  );
}
