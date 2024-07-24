import {useTheme} from '@mui/material/styles';

export const InvoicesPending = () => {
    const theme = useTheme();
    const fillColor = theme.palette.warning.main;


    return (
        <svg
            fill="none"
            width={24}
            height={24}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill={'fff'}
                fillOpacity={0.01}
                d="M12 20c4.9706 0 9-4.0294 9-9s-4.0294-9-9-9-9 4.0294-9 9 4.0294 9 9 9Z"
            />
            <path
                fill={'fff'}
                fillOpacity={0.01}
                d="M12 5.6V11l3.6 1.8"
            />

            <path
                stroke={'currentColor'}
                strokeLinecap={'round'}
                strokeLinejoin={'round'}
                strokeWidth={2}
                d="M12 5.6V11l3.6 1.8M21 11c0 4.9706-4.0294 9-9 9s-9-4.0294-9-9 4.0294-9 9-9 9 4.0294 9 9Z"

            />
        </svg>
    )
}