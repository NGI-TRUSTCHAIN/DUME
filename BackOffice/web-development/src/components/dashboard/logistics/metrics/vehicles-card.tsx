import {Avatar, Card, CardHeader, Stack} from "@mui/material";
import React from "react";
import {red} from "@mui/material/colors";

export type VehiclesCardProps = {
    icon: React.ReactElement,
    title: string,
    component: React.ReactElement,
}

export function LogisticsVehicleCard(props: VehiclesCardProps): React.JSX.Element {
    return (
        <Card>
            <CardHeader avatar={
                <Avatar sx={{bgcolor: red[500]}} aria-label="recipe">
                    {props.icon}
                </Avatar>
            } title={props.title} sx={{padding:'4 3 2'}}/>

            {props.component}
        </Card>
    )
}