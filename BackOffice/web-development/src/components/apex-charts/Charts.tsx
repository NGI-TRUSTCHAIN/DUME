'use client'

import dynamic from 'next/dynamic';
import { styled } from '@mui/material/styles';


// https://medium.com/@farrel.abyansyah/how-to-use-apexcharts-in-a-next-js-project-96e413bc9b31
const ApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
    loading: () => null
});

export const Chart = styled(ApexChart)``;
