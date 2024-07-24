import NextLink from 'next/link';
import {usePathname} from 'next/navigation';
import {
    Box,
    Collapse,
    Divider,
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    SvgIcon,
    Typography,
    useMediaQuery
} from '@mui/material';
import React from "react";
import {useTheme} from "@mui/material/styles";

import {ListItemsLink} from '../list-items';
import {ExpandLess, ExpandMore} from '@mui/icons-material';
import Image from "next/image";
import {ChevronUpDownIcon} from '@heroicons/react/24/solid';
import {SideMenuProps} from "@/src/components/side-menu/types";
import { AdminOptions, UserOptions } from '@/src/utils/dashboard/side-menu-options';


export const SideNav: React.FC<SideMenuProps> = (props) => {
    const {open, onClose} = props;
    const _pathname = usePathname();
    const theme = useTheme()
    const lgUp = useMediaQuery(theme.breakpoints.up('lg'));

    const [openListAdmin, setOpen] = React.useState(true);

    const handleClick = () => {
        setOpen(!openListAdmin);
    };

    const [openListUser, setOpenUser] = React.useState(true);

    const handleClickUser = () => {
        setOpenUser(!openListUser);
    };

    const content = (
        // <Scrollbar
        //     sx={{
        //         height: '100%',
        //         '& .simplebar-content': {
        //             height: '100%'
        //         },
        //         '& .simplebar-scrollbar:before': {
        //             background: 'neutral.400'
        //         }
        //     }}
        // >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    backgroundColor: 'background.default'
                }}
            >
                <Box sx={{p: 3}}>
                    <Box
                        component={NextLink}
                        href="/"
                        sx={{
                            display: 'inline-flex',
                            height: 32,
                            width: 32
                        }}
                    >
                        {/*<Logo/>*/}

                        <Image src={'/names/name.svg'} alt={'logo'} loading={'eager'} height={80} width={80}/>

                    </Box>
                    <Box
                        sx={{
                            alignItems: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.04)',
                            borderRadius: 1,
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            mt: 2,
                            p: '12px'
                        }}
                    >
                        <div>
                            <Typography
                                color="inherit"
                                variant="subtitle1"
                            >
                                TheiaVision
                            </Typography>
                            <Typography
                                color="neutral.400"
                                variant="body2"
                            >
                                Dev - v1.0
                            </Typography>
                        </div>
                        <SvgIcon
                            fontSize="small"
                            sx={{color: 'neutral.500'}}
                        >
                            <ChevronUpDownIcon/>
                        </SvgIcon>
                    </Box>
                </Box>
                <Divider sx={{borderColor: 'neutral.700'}}/>
                <Box flex={1}>
                    <nav aria-label="main mailbox folders">
                        <List>
                            <ListItemButton onClick={handleClick}>
                                <ListItemText primary="Admin"/>
                                {openListAdmin ? <ExpandLess/> : <ExpandMore/>}
                            </ListItemButton>
                            <Collapse in={openListAdmin} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {
                                        AdminOptions.map(option => (

                                                <ListItemsLink key={option.to} to={option.to} icon={option.icon}
                                                               label={option.label}/>
                                            )
                                        )
                                    }
                                </List>
                            </Collapse>

                            <ListItemButton onClick={handleClickUser}>
                                <ListItemText primary="User"/>
                                {openListUser ? <ExpandLess/> : <ExpandMore/>}
                            </ListItemButton>
                            <Collapse in={openListUser} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {
                                        UserOptions.map(option => (

                                                <ListItemsLink key={option.to} to={option.to} icon={option.icon}
                                                               label={option.label}/>

                                            )
                                        )
                                    }
                                </List>
                            </Collapse>

                            {/*<ListItemButton onClick={handleClickUser}>*/}
                            {/*    <ListItemText primary="Authentication"/>*/}
                            {/*    {openListUser ? <ExpandLess/> : <ExpandMore/>}*/}
                            {/*</ListItemButton>*/}
                            {/*<Collapse in={openListUser} timeout="auto" unmountOnExit>*/}
                            {/*    <List component="div" disablePadding>*/}
                            {/*        {*/}
                            {/*            AdminOptions.map(option => (*/}

                            {/*                    <ListItemsLink key={option.to} to={option.to} icon={option.icon}*/}
                            {/*                                   label={option.label}/>*/}

                            {/*                )*/}
                            {/*            )*/}
                            {/*        }*/}
                            {/*    </List>*/}
                            {/*</Collapse>*/}

                        </List>
                    </nav>

                </Box>
                <Divider sx={{borderColor: 'neutral.700'}}/>
                <Box
                    sx={{
                        px: 2,
                        py: 3
                    }}
                >
                </Box>
            </Box>
        // </Scrollbar>
    );

    if (lgUp) {
        return (
            <Drawer
                anchor="left"
                open
                PaperProps={{
                    sx: {
                        backgroundColor: 'background.paper',
                        color: 'common.white',
                        width: 280
                    }
                }}
                variant="permanent"
            >
                {content}
            </Drawer>
        );
    }

    return (
        <Drawer
            anchor="left"
            onClose={onClose}
            open={open}
            PaperProps={{
                sx: {
                    backgroundColor: 'background.default',
                    color: 'common.black',
                    width: 280
                }
            }}
            sx={{zIndex: (theme) => theme.zIndex.appBar + 100}}
            variant="temporary"
        >
            {content}
        </Drawer>
    );
};
