'use client'

import React from 'react';
import {Cell, Label, Pie, PieChart} from 'recharts';

const data = [
    { name: "Bubble Tea Sold", value: 10 },
    { name: "Bubble Tea Left", value: 4 },
];


export function ConditionChart() {

    return (
        <PieChart width={100} height={100}>
            <Pie
                data={data}
                cx="50%"
                cy="50%"
                dataKey="value" // make sure to map the dataKey to "value"
                innerRadius={40} // the inner and outer radius helps to create the progress look
                outerRadius={50}
            >
                {data.map((entry, index) => {
                    if (index === 1) {
                        return <Cell key={`cell-${index}`} fill="#f3f6f9" />; // make sure to map the index to the colour you want
                    }
                    return <Cell key={`cell-${index}`} fill="green" />;
                })}
            </Pie>
        </PieChart>
    );
}


