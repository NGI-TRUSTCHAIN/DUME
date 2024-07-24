'use client'

import React, {useState} from "react";
import {Box, Chip, Tab} from "@mui/material";
import {TabContext, TabList} from "@mui/lab";


type TabItemProps = {
    id: string,
    name: string,
    value: number
    // content: React.ReactElement
};

type TabListProps = {
    tabs: TabItemProps[];
};

export const CustomTabs: React.FC<TabListProps> = ({tabs}) => {
    const [value, setValue] = useState('1');

    const handleChange = (_event: React.SyntheticEvent, newValue: string) => setValue(newValue);


    return (
        <Box sx={{borderBottom: 1, borderColor: 'divider', m: 1, typography: 'subtitle2'}}>
            <TabContext value={value}>
                <TabList onChange={handleChange}  textColor="secondary"
                         indicatorColor="secondary">
                    {
                        tabs.map(tab => (
                                <Tab value={tab.id} icon={<Chip label={tab.value} sx={{marginLeft:2, borderRadius:3, height:24}}/>}
                                     iconPosition="end" label={tab.name}/>
                            )
                        )
                    }
                </TabList>
            </TabContext>
        </Box>
    )
}