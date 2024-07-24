import React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import {Box, Card, CardContent, Stack, Typography} from "@mui/material";
import {ConditionChart} from "@/components/dashboard/logistics/metrics/vehicles-condition-chart";

type ConditionsProps = {
    title: string,
    color: string,
    value: number,
    message: string
}

const conditions: ConditionsProps[] = [
    {
        title: 'Excellent',
        color: 'green',
        value: 181,
        message: 'No issues'
    },
    {
        title: 'Good',
        color: 'yellow',
        value: 24,
        message: 'Minor issues'
    },
    {
        title: 'Bad',
        color: 'red',
        value: 12,
        message: 'Needs attention'
    }
]

export function VehiclesCondition(): React.JSX.Element {
    return (
        <CardContent sx={{paddingBottom:4}}>
            <Grid container spacing={3}>
                {
                    conditions.map((content) =>
                        <Grid xs={12} md={4}>
                            <Card>
                                <Stack gap={3} paddingY={3} paddingX={2} alignItems={'center'}>
                                    <Typography variant={'subtitle1'}>
                                        {content.title}
                                    </Typography>
                                    <ConditionChart/>
                                    <Box textAlign={'center'}>
                                        <Typography variant={'h6'}>
                                            {content.value}
                                        </Typography>
                                        <Typography variant={'body1'}>
                                            {content.message}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Card>
                        </Grid>
                    )
                }

            </Grid>
        </CardContent>

    )
}
