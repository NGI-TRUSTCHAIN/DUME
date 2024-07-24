'use client'


import {createTheme} from '@mui/material/styles';
import {createPalette} from "./palette/create-palette";
import {typography} from "./typography";
import {shadows} from "./shadows";
import {components} from "./components/components";


const palette = createPalette();


export const customTheme = createTheme({
    breakpoints: {values: {xs: 0, sm: 600, md: 900, lg: 1200, xl: 1440}},
    typography,
    shadows,
    shape: {borderRadius: 8},
    palette: palette,
    components: components
})
