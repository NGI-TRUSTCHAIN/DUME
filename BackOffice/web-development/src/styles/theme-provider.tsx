'use client'

import {ReactNode} from "react";
import {ThemeProvider} from "@mui/material/styles";
import {customTheme} from "@/src/styles/theme";


type Props = {
    children?: ReactNode
}

export const StyleProvider = ({children}: Props) => {
    return (
        <ThemeProvider theme={customTheme}>
            {children}
        </ThemeProvider>
    )
}