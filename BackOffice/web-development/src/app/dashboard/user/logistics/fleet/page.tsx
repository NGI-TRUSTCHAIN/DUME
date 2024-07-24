'use client'

import {Divider, IconButton, Stack, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import dynamic from "next/dynamic";
import React, {useEffect, useState} from "react";
import {DescriptionStack, DescriptionStackProps} from "@/components/dashboard/logistics/fleet/description-stack";

const DynamicMap = dynamic(() => import('@/components/maps/map'), {
    ssr: false
});

function MapWrapper() {
    useEffect(() => {
        // Initialize map here, make sure it runs only on the client-side
    }, []);

    return <DynamicMap />;
}

const vehicleContent: DescriptionStackProps[] = [
    {
        id: 'VEH-004',
        address: 'Brooklyn, New York, United States',
        temperatureMessage: 'Good',
        temperatureValue: 8
    },
    {
        id: 'VEH-005',
        address: 'Brooklyn, New York, United States',
        temperatureMessage: 'Good',
        temperatureValue: 24
    },
    {
        id: 'VEH-006',
        address: 'Brooklyn, New York, United States',
        temperatureMessage: 'Good',
        temperatureValue: 86
    }
]

export default function Page() {
    const [openId, setOpenId] = useState<string | null>(null);

    const handleStackClick = (id: string) => {
        setOpenId(prevId => (prevId === id ? null : id));
    };
    return (
        <Box display={'flex'} minHeight={0} flex={'1 1 0'}>
            <Box display={'block'} width={320} sx={{flex: '0 0 auto', borderRight: '1px solid grey'}}>
                <Box height={'100%'} flexDirection={'column'}>
                    <Stack gap={1} padding={2} flex={'0 0 auto'}>
                        <Typography variant={'h5'}>Fleet</Typography>
                        <Button variant={'contained'} color={'secondary'} size={'medium'} startIcon={<AddIcon/>}>
                            Add Vehicle
                        </Button>
                    </Stack>
                    <Divider/>
                    <Box flex={'1 1 auto'} overflow-y={'auto'}>
                        <Stack border={'1px solid grey'}>
                            <Stack component={'ul'}>
                                {
                                    vehicleContent.map((content) => (
                                            <DescriptionStack id={content.id} address={content.address}
                                                              temperatureMessage={content.temperatureMessage}
                                                              temperatureValue={content.temperatureValue}
                                                              isOpen={openId === content.id}
                                                              onClick={() => handleStackClick(content.id)}/>
                                        )
                                    )
                                }
                            </Stack>
                        </Stack>
                    </Box>
                </Box>
            </Box>
            <Box display={'flex'} flex={'1 1 auto'} flexDirection={'column'} overflow={'hidden'}>
                <Box display={'flex'} flex={'0 0 auto'} padding={2} sx={{borderBottom: '1px solid grey'}}>
                    <Stack display={'flex'} direction={'row'} gap={1} flex={'1 1 auto'}/>
                    <Stack direction={'row'} gap={1}>
                        <IconButton aria-label="delete">
                            <DeleteIcon/>
                        </IconButton>
                    </Stack>
                </Box>
                <MapWrapper/>
            </Box>
        </Box>
    )
}