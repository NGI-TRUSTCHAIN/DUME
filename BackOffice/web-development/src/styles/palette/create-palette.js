import {alpha} from '@mui/material/styles';
import {error, info, neutral, primary, success, warning} from './colors';

export function createPalette() {
    return {
        action: {
            active: neutral[500],
            disabled: alpha(neutral[900], 0.38),
            disabledBackground: alpha(neutral[900], 0.12),
            focus: alpha(neutral[900], 0.16),
            hover: alpha(neutral[900], 0.04),
            selected: alpha(neutral[900], 0.12)
        },
        background: {
            paper: '#fff',
            default: '#1e0050',
        },
        divider: '#F2F4F7',
        error,
        info,
        mode: 'light',
        neutral,
        primary,
        success,
        text: {
            primary: neutral[900],
            secondary: neutral[500],
            disabled: alpha(neutral[900], 0.38)
        },
        warning
    };
}