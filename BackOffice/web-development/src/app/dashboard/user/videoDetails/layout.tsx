import {Container} from "@mui/material";
import React from "react";

export default function VideosLayout({children}: { children: React.ReactNode }) {
    return (
        <Container maxWidth="xl">
            {children}
        </Container>
    )
}