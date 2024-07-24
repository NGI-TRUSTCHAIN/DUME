
import {PeopleOutlined} from '@mui/icons-material';
import {SideMenuOptionsProps} from "@/utils/dashboard/side-menu-options/shared-interface";


export const UserOptions: SideMenuOptionsProps[] = [
    {
        to: '/users',
        icon : <PeopleOutlined/>,
        label: 'Overview'
    },
    {
        to: '/users/account',
        icon : <PeopleOutlined/>,
        label: 'Account'
    },
    {
        to: '/users/videos',
        icon : <PeopleOutlined/>,
        label: 'Videos'
    },
    {
        to: '/users/annotations',
        icon : <PeopleOutlined/>,
        label: 'Annotations List'
    },
    {
        to: '/users/videoImages',
        icon : <PeopleOutlined/>,
        label: 'Video Images'
    },
    {
        to: '/users/invoices',
        icon : <PeopleOutlined/>,
        label: 'Invoices'
    },

]