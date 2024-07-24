import {HomeOutlined, PeopleOutlined} from "@mui/icons-material";
import React from "react";
import {SideMenuOptionsProps} from "@/utils/dashboard/side-menu-options/shared-interface";


export const AdminOptions: SideMenuOptionsProps[] = [
    {
        to: '/admin/',
        icon: <HomeOutlined/>,
        label: 'Overview'
    },
    {
        to: '/admin/customers',
        icon : <PeopleOutlined/>,
        label: 'Customers List'
    },
    {
        to: '/admin/packageManager',
        icon : <PeopleOutlined/>,
        label: 'Package Manager'
    },
    {
        to: '/admin/packageReport',
        icon : <PeopleOutlined/>,
        label: 'Package Report'
    },
    {
        to: '/admin/crypto',
        icon : <PeopleOutlined/>,
        label: 'Crypto Manager'
    },
    {
        to: '/admin/aiManager',
        icon : <PeopleOutlined/>,
        label: 'Ai Models Manager'
    },
    {
        to: '/admin/users/',
        icon: <HomeOutlined/>,
        label: 'People '
    },
];
