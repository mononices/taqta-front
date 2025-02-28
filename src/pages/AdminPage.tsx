import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { API_URL } from "../config";
import { Box, Card, CardActionArea, CardContent, CircularProgress, Divider, Drawer, Grid2 as Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, useTheme } from "@mui/material";
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { MyDrawer } from "../components/CustomDrawer";
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import { useNavigate } from "react-router";

const drawerWidth = 300;

const CoursesTab = () => {
    const [courseData, setCourseData] = useState([]);
    useEffect(() => {
        axios.get(API_URL + "course", {
           'headers': {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            } 
        })
        .then(res => {
            setCourseData(res.data);
        })
        .catch(err => console.log(err));
    }, []);

    const theme = useTheme();

    return ( 
    <Box >
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {courseData.map((course: any) => {
                return (<Grid key={course._id}>
                    <Card sx={{
                        backgroundColor: theme.palette.secondary.main,
                        border: '1px solid', 
                        borderColor: theme.palette.divider,
                    }}>
                        <CardActionArea>
                            <CardContent>
                                <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                                {course.abbreviation}
                                </Typography>    
                                <Typography sx={{mb: '10px'}}>
                                {course.title}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>);
            })}
        </Grid>
    </Box>
    );
}

const UsersTab = () => {
    return <></>
}

const AdminPanel = () => {
    const theme = useTheme();

    const tabs = useMemo(() => {
        return [
            {
                'text': 'Users',
                'icon': <PersonOutlineIcon sx={{color: 'white'}}/>
            },
            {
                'text': 'Courses',
                'icon': <HistoryEduIcon sx={{color: 'white'}}/>
            },
        ];
    }, []);

    const [selectedTab, setSelectedTab] = useState("Users");    
    const view = useMemo(() => {
        switch(selectedTab){
            case 'Courses':
                return <CoursesTab/>
            case 'Users':
                return <UsersTab/>
        }
    }, [selectedTab]);

    return (
    <Box>
    <Box component="main" sx={{width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
    <MyDrawer variant="temporary" hideBackdrop ModalProps={{ disableScrollLock: true }} 
        open={true}
        sx={{
        display: { xs: 'none', sm: 'block' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
    > 
    <Box sx={{p: '10px', flexDirection: 'column', backgroundColor: `${theme.palette.background.default}` }}>
      <Toolbar disableGutters sx={{display: 'flex', justifyContent: 'center'}}>
          <SpaceDashboardIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                <Typography
                    variant="h6"
                    noWrap
                    component="a"
                    href="#"
                    sx={{
                    mr: 2,
                    display: { xs: 'none', md: 'flex' },
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    color: 'inherit',
                    textDecoration: 'none',
                    }}
                >
                   TAQTA
                </Typography>
      </Toolbar>
      <Divider />
      <List>
        {tabs.map((tab) => {
          return <ListItem key={tab.text} disablePadding>
            <ListItemButton onClick={() => setSelectedTab(tab.text)}>
              <ListItemIcon>
                {tab.icon}
              </ListItemIcon>
              <ListItemText primary={tab.text} />
            </ListItemButton>
          </ListItem>
        })}
      </List>
    </Box>
    </MyDrawer>
    </Box>
    <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth + 60}px)`}, pl: { sm: `${drawerWidth + 24}px` }}}>
        {view}
    </Box>
    </Box>
  );
}

const RedirectPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/");
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (<Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant="h4">You are not authorized, please log in!</Typography>
        </Box>);
}

export const AdminPage = () => {
    const [isAdmin, setAdmin] = useState<boolean | null>(null);

    useEffect(() => {
        axios.get(API_URL + "user/me/role", {
           'headers': {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            } 
        })
        .then(res => {
            if(res.data === "admin") setAdmin(true);
            else setAdmin(false);
        })
        .catch(err => setAdmin(false));
    }, []);

    if(!localStorage.getItem("token")){ 
        return (
            <RedirectPage></RedirectPage>
        );
    }

    if(isAdmin == null){
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress sx={{color: "white"}}/>
            </Box>
        );
    }
    
    if(isAdmin){
        return <AdminPanel/>;
    }

    return (<Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant="h4">You are not administrator</Typography>
        </Box>);
}