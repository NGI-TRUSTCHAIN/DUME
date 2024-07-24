import PieChartIcon from '@mui/icons-material/PieChart';
import SettingsIcon from '@mui/icons-material/Settings';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupIcon from '@mui/icons-material/Group';
import CloseIcon from '@mui/icons-material/Close';

export const navIcons = {
    'chart-pie': PieChartIcon,
    'gear-six': SettingsIcon,
    'plugs-connected': ElectricalServicesIcon,
    'x-square': CloseIcon,
    user: AccountCircleIcon,
    users: GroupIcon,
} as Record<string, typeof PieChartIcon>;  // Assuming the type needed is similar to the imported component type
