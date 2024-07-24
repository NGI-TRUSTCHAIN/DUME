'use client'

import { Box } from '@mui/material';
import React, { PureComponent } from 'react';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from 'recharts';

const data = [
    {
        name: '18-24',
        uv: 31.47,
        pv: 2400,
        fill: '#8884d8',
    },
    {
        name: '25-29',
        uv: 26.69,
        pv: 4567,
        fill: '#83a6ed',
    },
    {
        name: '30-34',
        uv: 15.69,
        pv: 1398,
        fill: '#8dd1e1',
    },
];

const style = {
    top: '50%',
    right: 0,
    transform: 'translate(0, -50%)',
    lineHeight: '24px',
};

export function  OverviewChart()  {

        return (
            // <ResponsiveContainer width={"100%"} aspect={1}>
            //     <RadialBarChart style={{width:'260px', height:'260px', position:'relative'}} cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" barSize={10} data={data}>
            <Box>
                <RadialBarChart width={260} height={260} cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" barSize={10} data={data}>
                <RadialBar
                    // label={{ position: 'insideStart', fill: '#fff' }}
                    background
                    dataKey="uv"
                />
                {/*<Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={style} />*/}
                </RadialBarChart>
            </Box>

                //
            // </ResponsiveContainer>
        );
}
