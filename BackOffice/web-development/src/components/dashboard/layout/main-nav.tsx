'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';

import {usePopover} from '@/src/hooks/use-popover';

import {MobileNav} from './mobile-nav';
import {UserPopover} from './user-popover';

export function MainNav(): React.JSX.Element {
    const [openNav, setOpenNav] = React.useState<boolean>(false);

    const userPopover = usePopover<HTMLDivElement>();

    return (
        <React.Fragment>
            <Box
                component="header"
                sx={{
                    borderBottom: '1px solid var(--mui-palette-divider)',
                    backgroundColor: 'var(--mui-palette-background-paper)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 'var(--mui-zIndex-appBar)',
                }}
            >
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', px: 2}}
                >
                    <Stack sx={{alignItems: 'center'}} direction="row" spacing={2}>
                        <IconButton
                            onClick={(): void => {
                                setOpenNav(true);
                            }}
                            sx={{display: {lg: 'none'}}}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Tooltip title="Search">
                            <IconButton>
                                <SearchIcon/>
                            </IconButton>
                        </Tooltip>
                    </Stack>
                    <Stack sx={{alignItems: 'center'}} direction="row" spacing={2}>
                        <Tooltip title="Contacts">
                            <IconButton>
                                <PeopleAltOutlinedIcon/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Notifications">
                            <Badge badgeContent={4} color="success" variant="dot">
                                <IconButton>
                                    <NotificationsNoneOutlinedIcon/>
                                </IconButton>
                            </Badge>
                        </Tooltip>
                        <Avatar
                            onClick={userPopover.handleOpen}
                            ref={userPopover.anchorRef}
                            src="/assets/avatar.png"
                            sx={{cursor: 'pointer'}}
                        />
                    </Stack>
                </Stack>
            </Box>
            <UserPopover anchorEl={userPopover.anchorRef.current} onClose={userPopover.handleClose}
                         open={userPopover.open}/>
            <MobileNav
                onClose={() => {
                    setOpenNav(false);
                }}
                open={openNav}
            />
        </React.Fragment>
    );
}