import {Box, List, ListItem, Stack, Typography} from "@mui/material";
import {OverviewChart} from "@/components/dashboard/logistics/metrics/vehicles-overview-chart";
import React from "react";

export function VehicleOverview(): React.JSX.Element {

    return (
        <Stack gap={3} alignItems={'center'} padding={3} sx={{display: 'flex', flexFlow: 'wrap'}}>
            <Box>
                <OverviewChart/>
            </Box>
            <Stack gap={3} sx={{flex: '1 1 auto'}}>
                <div>
                    <Typography variant={'body2'}>
                        Total
                    </Typography>
                    <Typography variant={'h5'}>
                        100
                    </Typography>
                </div>

                <List sx={{width: '100%', bgcolor: 'background.paper', gap: 2}}>
                    {['Available', 'Out of service', 'On route'].map((value, index) => (
                        <ListItem>
                            <Stack gap={1} alignItems={'center'} direction={'row'} flex={'1 1 auto'}>
                                <Box sx={{borderRadius: '2px', bgcolor: 'red', height: '4px', width: '16px'}}/>
                                <Typography variant={'body2'}>
                                    {value}
                                </Typography>
                            </Stack>
                            <Typography variant={'h6'}>
                                {index + 1}
                            </Typography>
                        </ListItem>
                    ))}
                </List>
            </Stack>
        </Stack>
    )
}