import * as React from 'react';
import RouterLink from 'next/link';
import {useRouter} from 'next/navigation';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';

import {paths} from '@/src/paths';
import {logger} from '@/src/lib/default-logger';
import {signOut} from 'next-auth/react';

export interface UserPopoverProps {
    anchorEl: Element | null;
    onClose: () => void;
    open: boolean;
}

export function UserPopover({anchorEl, onClose, open}: UserPopoverProps): React.JSX.Element {

    const router = useRouter();

    const handleSignOut = React.useCallback(async (): Promise<void> => {
        try {
            await signOut();

            // UserProvider, for this case, will not refresh the router and we need to do it manually
            router.refresh();
            // After refresh, AuthGuard will handle the redirect
        } catch (err) {
            logger.error('Sign out error', err);
        }
    }, [router]);

    return (
        <Popover
            anchorEl={anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            onClose={onClose}
            open={open}
            slotProps={{paper: {sx: {width: '240px'}}}}
        >
            <Box sx={{p: '16px 20px '}}>
                <Typography variant="subtitle1">Sofia Rivers</Typography>
                <Typography color="text.secondary" variant="body2">
                    sofia.rivers@devias.io
                </Typography>
            </Box>
            <Divider/>
            <MenuList disablePadding sx={{p: '8px', '& .MuiMenuItem-root': {borderRadius: 1}}}>
                <MenuItem component={RouterLink} href={paths.dashboard.admin.settings} onClick={onClose}>
                    <ListItemIcon>
                        <SettingsIcon fontSize="medium"/>
                    </ListItemIcon>
                    Settings
                </MenuItem>
                <MenuItem component={RouterLink} href={paths.dashboard.users.profile} onClick={onClose}>
                    <ListItemIcon>
                        <PeopleAltOutlinedIcon fontSize="medium"/>
                    </ListItemIcon>
                    Profile
                </MenuItem>
                <MenuItem onClick={handleSignOut}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="medium"/>
                    </ListItemIcon>
                    Sign out
                </MenuItem>
            </MenuList>
        </Popover>
    );
}