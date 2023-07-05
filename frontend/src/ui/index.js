import React, { useState } from "react";
import Navigation from "./Home";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import HorizontalLinearStepper from "./Steps";
import SimplePaper from "./HomeCard";
import { theme } from "@chakra-ui/react";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function Main() {
  const [isVerified, setIsVerified] = useState(false);
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Navigation />

      {!isVerified && (
        <SimplePaper isVerified={isVerified} setIsVerified={setIsVerified} />
      )}
      {isVerified && (
        <HorizontalLinearStepper
          isVerified={isVerified}
          setIsVerified={setIsVerified}
        />
      )}
    </ThemeProvider>
  );
}

export default Main;
