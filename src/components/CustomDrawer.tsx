import { styled } from "@mui/material";
import MuiDrawer, { drawerClasses, DrawerProps } from '@mui/material/Drawer';

const drawerWidth = 300;

export const MyDrawer = styled((props: DrawerProps) => {return <MuiDrawer {...props}></MuiDrawer>})
(({theme}) => ({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  [`& .${drawerClasses.paper}`]: {
      width: drawerWidth,
      backgroundColor: `${theme.palette.divider}`
  },
}));

