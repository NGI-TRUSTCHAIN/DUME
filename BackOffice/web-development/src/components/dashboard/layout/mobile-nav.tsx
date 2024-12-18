'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import {usePathname} from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';

import type {NavItemConfig} from '@/src/types/nav';
import {paths} from '@/src/paths';
import {Logo} from '@/src/components/core/logo';

import {navItems} from './config';
import {renderNavItems} from "@/src/components/dashboard/layout/render-nav-items";

export interface MobileNavProps {
    onClose?: () => void;
    open?: boolean;
    items?: NavItemConfig[];
}

export function MobileNav({open, onClose}: MobileNavProps): React.JSX.Element {
    const pathname = usePathname();

    return (
        <Drawer
            PaperProps={{
                sx: {
                    '--MobileNav-background': 'var(--mui-palette-neutral-950)',
                    '--MobileNav-color': 'var(--mui-palette-common-white)',
                    '--NavItem-color': 'var(--mui-palette-neutral-300)',
                    '--NavItem-hover-background': 'rgba(255, 255, 255, 0.04)',
                    '--NavItem-active-background': 'var(--mui-palette-primary-main)',
                    '--NavItem-active-color': 'var(--mui-palette-primary-contrastText)',
                    '--NavItem-disabled-color': 'var(--mui-palette-neutral-500)',
                    '--NavItem-icon-color': 'var(--mui-palette-neutral-400)',
                    '--NavItem-icon-active-color': 'var(--mui-palette-primary-contrastText)',
                    '--NavItem-icon-disabled-color': 'var(--mui-palette-neutral-600)',
                    bgcolor: 'var(--MobileNav-background)',
                    color: 'var(--MobileNav-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    maxWidth: '100%',
                    scrollbarWidth: 'none',
                    width: 'var(--MobileNav-width)',
                    zIndex: 'var(--MobileNav-zIndex)',
                    '&::-webkit-scrollbar': {display: 'none'},
                },
            }}
            onClose={onClose}
            open={open}
        >
            <Stack spacing={2} sx={{p: 3}}>
                <Box component={RouterLink} href={paths.home} sx={{display: 'inline-flex'}}>
                    <Logo color="light" height={32} width={122}/>
                </Box>
                <Box
                    sx={{
                        alignItems: 'center',
                        backgroundColor: 'var(--mui-palette-neutral-950)',
                        border: '1px solid var(--mui-palette-neutral-700)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        p: '4px 12px',
                    }}
                >
                    <Box sx={{flex: '1 1 auto'}}>
                        <Typography color="var(--mui-palette-neutral-400)" variant="body2">
                            Workspace
                        </Typography>
                        <Typography color="inherit" variant="subtitle1">
                            Devias
                        </Typography>
                    </Box>
                    <UnfoldMoreIcon/>
                </Box>
            </Stack>
            <Divider sx={{borderColor: 'var(--mui-palette-neutral-700)'}}/>
            <Box component="nav" sx={{flex: '1 1 auto', p: '12px'}}>
                {renderNavItems({pathname, items: navItems})}
            </Box>
            <Divider sx={{borderColor: 'var(--mui-palette-neutral-700)'}}/>
            <Stack spacing={2} sx={{p: '12px'}}>
                <div>
                    <Typography color="var(--mui-palette-neutral-100)" variant="subtitle2">
                        Need more features?
                    </Typography>
                    <Typography color="var(--mui-palette-neutral-400)" variant="body2">
                        Check out our Pro solution template.
                    </Typography>
                </div>
                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                    <Box
                        component="img"
                        alt="Pro version"
                        src="/assets/devias-kit-pro.png"
                        sx={{height: 'auto', width: '160px'}}
                    />
                </Box>
                <Button
                    component="a"
                    endIcon={<OpenInNewIcon fontSize="medium"/>}
                    fullWidth
                    href="https://material-kit-pro-react.devias.io/"
                    sx={{mt: 2}}
                    target="_blank"
                    variant="contained"
                >
                    Pro version
                </Button>
            </Stack>
        </Drawer>
    );
}
