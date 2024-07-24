import Grid from "@mui/material/Unstable_Grid2";
import {Box, Stack, SvgIcon, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import {PencilIcon} from "@heroicons/react/24/solid";
import React from "react";
import {LogisticsMainCard, MainCardsProps} from "@/components/dashboard/logistics/metrics/main-card";
import ChecklistRoundedIcon from "@mui/icons-material/ChecklistRounded";
import {LogisticsVehicleCard, VehiclesCardProps} from "@/components/dashboard/logistics/metrics/vehicles-card";
import {VehicleOverview} from "@/components/dashboard/logistics/metrics/vehicles-overview";
import {VehiclesCondition} from "@/components/dashboard/logistics/metrics/vehicles-condition";
import {VehiclesTable} from "@/components/dashboard/logistics/metrics/vehicles-table";


const cardsContent: MainCardsProps[] = [
    {
        icon: <ChecklistRoundedIcon/>,
        message: 'On route vehicles',
        value: 31,
    },
    {
        icon: <ChecklistRoundedIcon/>,
        message: 'Vehicles with errors',
        value: 31,
    },
    {
        icon: <ChecklistRoundedIcon/>,
        message: 'Vehicles deviated from route',
        value: 31,
    },
    {
        icon: <ChecklistRoundedIcon/>,
        message: 'Late vehicles',
        value: 31,
    },
]

const vehiclesContent: VehiclesCardProps[] = [
    {
        icon: <ChecklistRoundedIcon/>,
        title: 'Vehicles Overview',
        component: <VehicleOverview/>
    },
    {
        icon: <ChecklistRoundedIcon/>,
        title: 'Vehicles Condition',
        component: <VehiclesCondition/>
    }
]

export default function Page() {

    return (
        <>
            <Stack direction="column" gap={4}>
                <Stack direction="row" gap={3}>
                    <Box flex="1 1 auto">
                        <Typography noWrap variant="h4">Logistics</Typography>
                    </Box>
                    <div>
                        <Button
                            startIcon={(
                                <SvgIcon fontSize="small">
                                    <PencilIcon/>
                                </SvgIcon>
                            )}
                            variant="contained"
                        >
                            Add vehicle
                        </Button>
                    </div>
                </Stack>

                <Grid container spacing={3}>
                    {
                        cardsContent.map((card, index) =>
                            <Grid xs={12} md={3} key={index}>
                                <LogisticsMainCard icon={card.icon} message={card.message} value={card.value}/>
                            </Grid>
                        )
                    }

                    {
                        vehiclesContent.map((card, index) =>
                            <Grid xs={12} lg={6} key={index}>
                                <LogisticsVehicleCard icon={card.icon} title={card.title} component={card.component}/>
                            </Grid>
                        )
                    }

                    <Grid xs={12}>
                        <VehiclesTable/>
                    </Grid>
                </Grid>
            </Stack>
        </>
    )
}