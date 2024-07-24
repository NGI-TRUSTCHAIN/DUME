import { Alert } from "@mui/material";
import React from "react";

type AlertProps = {
    sx: object
    children: React.ReactNode
}
const BasicAlert = ({children} : AlertProps ) => {

    return (
        <Alert variant="filled" severity="error">{children}</Alert>
    )
}

export {BasicAlert}