import * as React from 'react';
import {
    Timeline,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineSeparator,
    timelineItemClasses
} from "@mui/lab";
import {List, ListItem, ListItemIcon, ListItemText, Typography} from "@mui/material";
import {LinearProgressWithLabel} from "@/components/linear-progress";
import RoomIcon from '@mui/icons-material/Room';

export default function BasicTimeline() {
    return (
        <Timeline
            sx={{
                [`& .${timelineItemClasses.root}:before`]: {
                    flex: 0,
                    padding: 0,
                },
            }}>
            <TimelineItem>
                <TimelineSeparator>
                    <TimelineDot color="primary"/>
                    <TimelineConnector/>
                </TimelineSeparator>
                <TimelineContent>
                    <Typography variant={'body2'}>
                        <div>
                            <Typography component={'p'} variant={'body2'}>
                                Recorded at
                            </Typography>
                            <Typography component={'span'}>
                                Sep 01, 8:02 AM
                            </Typography>
                        </div>
                    </Typography>
                </TimelineContent>
            </TimelineItem>

            <TimelineItem>
                <TimelineSeparator>
                    <TimelineDot color="primary"/>
                    <TimelineConnector/>
                </TimelineSeparator>
                <TimelineContent>
                    <Typography variant={'body2'}>
                        <div>
                            <Typography component={'p'} variant={'body2'}>
                                Coordinates
                            </Typography>
                            <Typography component={'span'}>
                                41,6 / 56.3
                            </Typography>
                        </div>
                    </Typography>
                </TimelineContent>
            </TimelineItem>

            <TimelineItem>
                <TimelineSeparator>
                    <TimelineDot color="primary"/>
                    <TimelineConnector/>
                </TimelineSeparator>
                <TimelineContent>
                    <Typography variant={'body2'}>
                        <div>
                            <Typography component={'p'} variant={'body2'}>
                                Upload Status
                            </Typography>
                            <LinearProgressWithLabel value={50}/>
                        </div>
                    </Typography>
                </TimelineContent>
            </TimelineItem>

            <TimelineItem>
                <TimelineSeparator>
                    <TimelineDot color="primary"/>
                    <TimelineConnector/>
                </TimelineSeparator>
                <TimelineContent>
                    <Typography variant={'body2'}>
                        <div>
                            <Typography component={'p'} variant={'body2'}>
                                Video Duration
                            </Typography>
                            <Typography component={'span'}>
                                00:50 s
                            </Typography>
                        </div>
                    </Typography>
                </TimelineContent>
            </TimelineItem>

            <TimelineItem>
                <TimelineSeparator>
                    <TimelineDot color="primary"/>
                    <TimelineConnector/>
                </TimelineSeparator>
                <TimelineContent>
                    <Typography variant={'body2'}>
                        <div>
                            <Typography component={'p'} variant={'body2'}>
                                Images Collected
                            </Typography>
                            <Typography component={'span'}>
                                450
                            </Typography>
                        </div>
                    </Typography>
                </TimelineContent>
            </TimelineItem>

            <TimelineItem>
                <TimelineSeparator>
                    <TimelineDot color="primary"/>
                </TimelineSeparator>
                <TimelineContent>
                    <Typography variant={'body2'}>
                        <div>
                            <Typography component={'p'} variant={'body2'}>
                                Events Detected
                            </Typography>
                            <List>
                                <ListItem>
                                    <ListItemIcon>
                                        <RoomIcon />
                                    </ListItemIcon>
                                    <ListItemText>Trash</ListItemText>
                                </ListItem>

                                <ListItem>
                                    <ListItemIcon>
                                        <RoomIcon />
                                    </ListItemIcon>
                                    <ListItemText>Graffiti</ListItemText>
                                </ListItem>

                                <ListItem>
                                    <ListItemIcon>
                                        <RoomIcon />
                                    </ListItemIcon>
                                    <ListItemText>Cardboard</ListItemText>
                                </ListItem>

                            </List>
                        </div>
                    </Typography>
                </TimelineContent>
            </TimelineItem>
        </Timeline>
    );
}