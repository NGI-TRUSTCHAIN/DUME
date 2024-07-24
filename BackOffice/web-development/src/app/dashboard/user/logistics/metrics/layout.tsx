import {Container} from "@mui/material";
import React from "react";

export default function MetricsLayout({children}: { children: React.ReactNode }) {
    return (
        <Container maxWidth="xl">
            {children}
        </Container>
    )
}