import {NavItemConfig} from "@/src/types/nav";
import React from "react";
import {Stack, Typography} from "@mui/material";
import {isNavItemActive} from "@/src/lib/is-nav-item-active";
import {navIcons} from "@/src/components/dashboard/layout/nav-icons";
import Box from "@mui/material/Box";
import RouterLink from "next/link";

export function renderNavItems({items = [], pathname}: { items?: NavItemConfig[]; pathname: string }): React.JSX.Element {
    const children = items.reduce((acc: React.ReactNode[], curr: NavItemConfig): React.ReactNode[] => {
        const {key, ...item} = curr;

        acc.push(<NavItem key={key} pathname={pathname} {...item} />);

        return acc;
    }, []);

    return (
        <Stack component="ul" spacing={1} sx={{listStyle: 'none', m: 0, p: 0}}>
            {children}
        </Stack>
    );
}

interface NavItemProps extends Omit<NavItemConfig, 'items'> {
    pathname: string;
}

function NavItem({disabled, external, href, icon, matcher, pathname, title}: NavItemProps): React.JSX.Element {
    const active = isNavItemActive({disabled, external, href, matcher, pathname});
    const Icon = icon ? navIcons[icon] : null;

    return (
        <li>
            <Box
                {...(href
                    ? {
                        component: external ? 'a' : RouterLink,
                        href,
                        target: external ? '_blank' : undefined,
                        rel: external ? 'noreferrer' : undefined,
                    }
                    : {role: 'button'})}
                sx={{
                    alignItems: 'center',
                    borderRadius: 1,
                    color: 'var(--NavItem-color)',
                    cursor: 'pointer',
                    display: 'flex',
                    flex: '0 0 auto',
                    gap: 1,
                    p: '6px 16px',
                    position: 'relative',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    ...(disabled && {
                        bgcolor: 'var(--NavItem-disabled-background)',
                        color: 'var(--NavItem-disabled-color)',
                        cursor: 'not-allowed',
                    }),
                    ...(active && {bgcolor: 'var(--NavItem-active-background)', color: 'var(--NavItem-active-color)'}),
                }}
            >
                <Box sx={{alignItems: 'center', display: 'flex', justifyContent: 'center', flex: '0 0 auto'}}>
                    {Icon ? (
                        <Icon
                            fill={active ? 'var(--NavItem-icon-active-color)' : 'var(--NavItem-icon-color)'}
                            fontSize="medium"

                            // weight={active ? 'fill' : undefined}
                        />
                    ) : null}
                </Box>
                <Box sx={{flex: '1 1 auto'}}>
                    <Typography
                        component="span"
                        sx={{color: 'inherit', fontSize: '0.875rem', fontWeight: 500, lineHeight: '28px'}}
                    >
                        {title}
                    </Typography>
                </Box>
            </Box>
        </li>
    );

}