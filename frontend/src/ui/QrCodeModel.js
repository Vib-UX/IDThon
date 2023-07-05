import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import QRCode from "react-qr-code";
import { Button } from "@mui/material";
import { Link, Navigate } from "react-router-dom";

export default function QRCodeModel({ open, qrCodeData }) {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
      onClick={() => null}
    >
      <div style={{}}>
        <h1
          style={{
            textAlign: "center",
            fontSize: "1.2rem",
          }}
        >
          Scan this Qr code to add credential
        </h1>
        <QRCode
          size={400}
          value={JSON.stringify(qrCodeData)}
          style={{
            backgroundColor: "white",
            marginTop: "1rem",
            paddingTop: "2rem",
            borderRadius: "20px",
            paddingBottom: "2rem",
          }}
        />
        <Link
          to={"/"}
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Button
            variant="contained"
            style={{
              backgroundColor: "#8d2cab",
              fontWeight: "normal",
              padding: "15px",
              color: "#fff",
              width: "70%",
            }}
          >
            Back to home
          </Button>
        </Link>
      </div>
    </Backdrop>
  );
}
