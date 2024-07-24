import React from "react";
import {ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import NextLink from 'next/link'
import scss from "./ListItem.module.scss";


type ListItemLinkProps = {
    to: string;
    icon: React.ReactElement;
    label: string;
}

// https://www.slingacademy.com/article/how-to-highlight-currently-active-link-in-next-js/#Using_Pages_Router_Legacy
 export const ListItemsLink = ({ to, icon, label} : ListItemLinkProps) => {

    return (
        <NextLink  className={scss.link} color={'primary'} href={to} >
            <ListItemButton>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={label} />
            </ListItemButton>
        </NextLink>
    )
}
