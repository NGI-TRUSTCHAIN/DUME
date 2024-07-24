import React from "react";
import {
    Avatar,
    Card,
    CardHeader,
    Chip,
    Divider,
    LinearProgress,
    Stack,
    Table,
    TableHead,
    Typography
} from "@mui/material";
import Box from "@mui/material/Box";
import {red} from "@mui/material/colors";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";

const tableHeads: string[] = [
    'Vehicle',
    'Starting Route',
    'Ending Route',
    'Warning',
    'Temperature'
]

type ContentProps = {
    id: string,
    startingRoute: string,
    endingRoute: string,
    warning: string,
    color: string,
    temperatureValue: number,
    temperatureMessage: string
}
const tableContent: ContentProps[] = [
    {
        id: 'VEH-004',
        startingRoute: 'Liden, Netherlands',
        endingRoute: 'Dordrecht, Netherlands',
        warning: 'No warnings',
        color: 'success',
        temperatureValue: 8,
        temperatureMessage: 'Very Good'
    },
    {
        id: 'VEH-004',
        startingRoute: 'Liden, Netherlands',
        endingRoute: 'Dordrecht, Netherlands',
        warning: 'No warnings',
        color: 'success',
        temperatureValue: 8,
        temperatureMessage: 'Very Good'
    },
    {
        id: 'VEH-004',
        startingRoute: 'Liden, Netherlands',
        endingRoute: 'Dordrecht, Netherlands',
        warning: 'No warnings',
        color: 'success',
        temperatureValue: 8,
        temperatureMessage: 'Very Good'
    },
    {
        id: 'VEH-004',
        startingRoute: 'Liden, Netherlands',
        endingRoute: 'Dordrecht, Netherlands',
        warning: 'No warnings',
        color: 'success',
        temperatureValue: 8,
        temperatureMessage: 'Very Good'
    }
]

export function VehiclesTable(): React.JSX.Element {

    return (
        <Card>
            <CardHeader avatar={
                <Avatar sx={{bgcolor: red[500]}} aria-label="recipe">
                    h
                </Avatar>
            } title={'On route vehicles'} sx={{padding: '4 3 2'}}/>
            <Divider/>
            <Box>
                <Table>
                    <TableHead>
                        <TableRow sx={{backgroundColor: '#f1f1f4'}}>
                            {
                                tableHeads.map((row, index) => (
                                    <TableCell  key={index} align={index === tableHeads.length - 1 ? 'right' : 'left'}>
                                        {row}
                                    </TableCell>
                                ))
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            tableContent.map((content) => (
                                    <TableRow
                                        key={content.id}
                                        hover
                                    >
                                        <TableCell component="td" scope="row" align={'left'}>
                                            <Stack gap={2} direction={'row'} alignItems={'center'}>
                                                <Avatar>
                                                    H
                                                </Avatar>

                                                <Typography variant={'subtitle2'}>
                                                    {content.id}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell align={'left'}>{content.startingRoute}</TableCell>
                                        <TableCell align={'left'}>{content.endingRoute}</TableCell>
                                        <TableCell align={'left'}>
                                            <Chip color={"success"} label={content.warning}/>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Stack gap={2}>
                                                <LinearProgress variant="determinate" value={content.temperatureValue} />
                                                <Stack direction={'row'} gap={2} alignItems={'center'} justifyContent={'space-between'}>
                                                    <Typography variant={'subtitle2'}>
                                                        {content.temperatureMessage}
                                                    </Typography>
                                                    <Typography variant={'body2'}>
                                                        {content.temperatureValue} ºC
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                )
                            )
                        }
                    </TableBody>
                </Table>
            </Box>
        </Card>
    )

}