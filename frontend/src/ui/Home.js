import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SendIcon from "@mui/icons-material/Send";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import SimpleBackdrop from "./Backdrop";

export default function Navigation() {
  const navigate = useNavigate();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        style={{
          height: "80px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Toolbar
          variant="dense"
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            flexDirection: "row",
          }}
        >
          <Typography variant="h6" color="inherit" component="div">
            <Link to={"/"}>Get a Loan Today - Powered by Poygon Id</Link>
          </Typography>
          <Button
            variant="contained"
            style={{
              backgroundColor: "#8d2cab",
              fontWeight: "normal",
              color: "#fff",
            }}
            onClick={() => navigate("/claim")}
          >
            Apply for claim
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
