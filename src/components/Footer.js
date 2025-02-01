// src/components/Footer.js
import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box component="footer" sx={{ background: "white", color: "#757575", textAlign: "center", py: 2, mt: "auto" }}>
      <Typography variant="body2">© SIPAKTING 2025</Typography>
    </Box>
  );
};

export default Footer;
