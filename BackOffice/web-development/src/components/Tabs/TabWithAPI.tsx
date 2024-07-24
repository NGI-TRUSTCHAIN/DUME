'use client'

import {Box, Tab} from "@mui/material";
import React, {useState} from "react";
import {TabContext, TabPanel, TabList} from '@mui/lab';

type TabItemProps = {
    value: string,
    label: string,
    content: React.ReactElement
};

type TabApiProps = {
    tabs: TabItemProps[];
};
const TabAPI: React.FC<TabApiProps> = ({tabs}) => {


    const [value, setValue] = useState(tabs[0].value);

    const handleChange = (_event: React.SyntheticEvent, newValue: string) => setValue(newValue);


    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        {tabs.map((tab) => (
                            <Tab key={tab.value} label={tab.label} value={tab.value} />
                        ))}
                    </TabList>
                </Box>
                {tabs.map((tab) => (
                    <TabPanel key={tab.value} value={tab.value}>
                        {tab.content}
                    </TabPanel>
                ))}
            </TabContext>
        </Box>
    );
};

export default TabAPI;