import BellIcon from '@heroicons/react/24/solid/BellIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import Bars3Icon from '@heroicons/react/24/solid/Bars3Icon';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import {Avatar, Badge, Box, IconButton, Stack, SvgIcon, Tooltip, useMediaQuery, useTheme} from '@mui/material';
import React from "react";


const SIDE_NAV_WIDTH = 280;
const TOP_NAV_HEIGHT = 64;

export type TopNavProps = {
    onNavOpen?: () => void;
}

export const TopNav: React.FC<TopNavProps> = (props) => {

    const {onNavOpen} = props;

    return (
        <>
            <Box
                component="header"
                sx={{
                    backdropFilter: 'blur(6px)',
                    backgroundColor: 'background.default',
                    position: 'sticky',
                    left: {
                        lg: `${SIDE_NAV_WIDTH}px`
                    },
                    top: 0,
                    width: {
                        lg: `calc(100% - ${SIDE_NAV_WIDTH}px)`
                    },
                    zIndex: (theme) => theme.zIndex.appBar
                }}
            >
                <Stack
                    alignItems="center"
                    direction="row"
                    justifyContent="space-between"
                    spacing={2}
                    sx={{
                        minHeight: TOP_NAV_HEIGHT,
                        px: 2
                    }}
                >
                    <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                    >
                        <IconButton color="success" onClick={onNavOpen} sx={{display: {lg: 'none'}}}>
                            <SvgIcon fontSize="small">
                                <Bars3Icon/>
                            </SvgIcon>
                        </IconButton>
                        <Tooltip title="Search">
                            <IconButton>
                                <SvgIcon fontSize="small">
                                    <MagnifyingGlassIcon/>
                                </SvgIcon>
                            </IconButton>
                        </Tooltip>
                    </Stack>
                    <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                    >
                        <Tooltip title="Contacts">
                            <IconButton>
                                <SvgIcon fontSize="small">
                                    <UsersIcon/>
                                </SvgIcon>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Notifications">
                            <IconButton>
                                <Badge
                                    badgeContent={4}
                                    color="success"
                                    variant="dot"
                                >
                                    <SvgIcon fontSize="small">
                                        <BellIcon/>
                                    </SvgIcon>
                                </Badge>
                            </IconButton>
                        </Tooltip>
                        <Avatar
                            // onClick={accountPopover.handleOpen}
                            // ref={accountPopover.anchorRef}
                            sx={{
                                cursor: 'pointer',
                                height: 40,
                                width: 40
                            }}
                            src={"/assets/avatars/avatar-anika-visser.png"}
                        />
                    </Stack>
                </Stack>
            </Box>
            {/*<AccountPopover*/}
            {/*    anchorEl={accountPopover.anchorRef.current}*/}
            {/*    open={accountPopover.open}*/}
            {/*    onClose={accountPopover.handleClose}*/}
            {/*/>*/}
        </>
    );
};

