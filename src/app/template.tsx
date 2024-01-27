"use client";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ReactNode } from "react";

export type TemplateProps = {
  children: ReactNode
};

export default function Template({ children }: TemplateProps) {
  const theme = createTheme({
    palette: {
      mode: "light"
    },
    typography: {
      fontFamily: [
        "'kiwi maru'",
      ].join(",")
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
