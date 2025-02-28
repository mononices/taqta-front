import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { API_URL } from "../config";
import { AppBar, Box, Button, Card, CardActionArea, CardContent, CircularProgress, Divider, Drawer, Grid2 as Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Modal, Toolbar, Typography, useTheme } from "@mui/material";
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { MyDrawer } from "../components/CustomDrawer";
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import { useNavigate } from "react-router";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
const drawerWidth = 300;

import { DataGrid, GridColDef, GridCellEditStopParams } from "@mui/x-data-grid";
import { TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { ThemeContext } from "@emotion/react";
import { Handshake, Save } from "@mui/icons-material";

interface Course {
  _id: string;
  school: string;
  level: string;
  abbreviation: string;
  title: string;
  ec_cr: number;
  us_cr: number;
  start_date: dayjs.Dayjs;
  end_date: dayjs.Dayjs;
}

export const EditableTable = ({course} : {course: Course}) => {
    const [rows, setRows] = useState([{...course, id: 0}]);
  
    const handleEditCellChange = (params) => {
      const { id, field, value } = params;
      setRows((prevRows) =>
        prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
      );
      console.log(rows);

    };
    
    const theme = useTheme();

    const columns = [
      { field: "school", headerName: "School", width: 150, editable: true },
      { field: "level", headerName: "Level", width: 100, editable: true },
      { field: "abbreviation", headerName: "Abbreviation", width: 120, editable: true },
      { field: "title", headerName: "Title", width: 300, editable: true },
      { field: "ec_cr", headerName: "CR (EC)", width: 100, type: "number", editable: true },
      { field: "us_cr", headerName: "CR (US)", width: 100, type: "number", editable: true },
      {
        field: "start_date",
        headerName: "Start Date",
        width: 180,
        renderCell: (params) => (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={params.value}
              onChange={(newValue) => handleEditCellChange({
                id: params.id,
                field: "start_date",
                value: newValue,
              })}
              renderInput={(params) => <TextField {...params} size="small" />}
            />
          </LocalizationProvider>
        ),
      },
      {
        field: "end_date",
        headerName: "End Date",
        width: 180,
        renderCell: (params) => (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              sx={{border: '0px'}}
              value={params.value}
              onChange={(newValue) => handleEditCellChange({
                id: params.id,
                field: "end_date",
                value: newValue,
              })}
              renderInput={(params) => <TextField {...params} size="small" />}
            />
          </LocalizationProvider>
        ),
      },
    ];
    
    const saveCourse = () => {
        const revision = rows[0];
        axios.patch(API_URL + "course/" + revision._id, {
            school: revision.school,
            level: revision.level,
            abbreviation: revision.abbreviation,
            title: revision.title,
            ec_cr: revision.ec_cr,
            us_cr: revision.us_cr,
            start_date: revision.start_date.format("DD-MM-YY"),
            end_date: revision.end_date.format("DD-MM-YY")
        }).then(res => console.log(res));
    }

    const deleteCourse = () => {
        const revision = rows[0];
        axios.delete(API_URL + "course/" + revision._id).then(res => console.log(res));
    }

    return (
        <>  
        <DataGrid
          sx={{flexGrow: '0 !important', 
            '.MuiDataGrid-cell.MuiDataGrid-cell--editing':{
                backgroundColor: 'action.hover'
            },
            '.MuiDataGrid-cell': {
                backgroundColor: theme.palette.background.default
            }
          }}
          processRowUpdate={(newRow) => {
            setRows((prevRows) =>
              prevRows.map((row) => (row.id === newRow.id ? newRow : row))
            );
            return newRow;
          }}
          rows={rows}
          columns={columns}
          onCellEditCommit={handleEditCellChange}
          hideFooterPagination
          hideFooter
          disableColumnMenu
          disableColumnSorting
          disableColumnSelector
        />
        <Box display="flex" flexDirection="row" sx={{mt: '15px'}}>
            <Button variant="contained" disableElevation onClick={saveCourse} sx={{mr: '10px', fontSize: '14px', height: 32, textTransform: 'none', backgroundColor: theme.palette.secondary.main, borderColor: `${theme.palette.divider} !important`, border: "1px solid"}} endIcon={<Save />}>
                Save 
            </Button>
            <Button variant="contained" onClick={deleteCourse}disableElevation sx={{fontSize: '14px', height: 32, textTransform: 'none', backgroundColor: theme.palette.secondary.main, borderColor: `${theme.palette.divider} !important`, border: "1px solid"}} endIcon={<DeleteOutlineIcon />}>
                Delete
            </Button>
        </Box>
        
        </>
    );
  }
  

const CoursesTab = () => {
    const [courseData, setCourseData] = useState([]);
    const theme = useTheme();
    const [modalOpen, setModalOpen] = useState(false);
    const [picked, setPicked] = useState<Course | null>(null);

    const handleClick = (index: number) => {
        const selected: any = courseData[index];
        selected.start_date = dayjs(selected.start_date, "DD-MM-YY");
        selected.end_date = dayjs(selected.end_date, "DD-MM-YY");
        
        setPicked(selected);
        setModalOpen(true);
    }

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
    }, [modalOpen]);

    return ( 
    <Box>
        {
        /*
        <Toolbar sx={{padding: '0px !important'}}>
        <Button variant="contained" disableElevation sx={{fontSize: '14px', height: 32, textTransform: 'none', backgroundColor: theme.palette.secondary.main, borderColor: `${theme.palette.divider} !important`, border: "1px solid"}} endIcon={<AddCircleOutlineIcon />}>
            Add
        </Button>
        </Toolbar>
        */
        }
        <Modal open={modalOpen} onClose={() => {setModalOpen(false)}}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80%',
                bgcolor: theme.palette.background.default,
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
            }}>
                
                <EditableTable course={picked as Course}/>
            </Box>
        </Modal>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {courseData.map((course: any, index: number) => {
                return (<Grid key={course._id}>
                    <Card sx={{
                        backgroundColor: theme.palette.secondary.main,
                        border: '1px solid', 
                        borderColor: theme.palette.divider,
                    }}>
                        <CardActionArea onClick={() => {
                            handleClick(index);
                        }}>
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
            /*{
                'text': 'Users',
                'icon': <PersonOutlineIcon sx={{color: 'white'}}/>
            },*/
            {
                'text': 'Courses',
                'icon': <HistoryEduIcon sx={{color: 'white'}}/>
            },
        ];
    }, []);

    const [selectedTab, setSelectedTab] = useState("Courses");    
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