import { backdropClasses, Box, Button, Divider, Drawer, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, selectClasses, styled, SvgIconProps, useMediaQuery, useTheme } from "@mui/material";
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import React, { useState } from "react";
import UnfoldMoreSharpIcon from '@mui/icons-material/UnfoldMoreSharp';
import Row from "./Row";
import CourseSearch from "./CourseSearch";

const drawerWidth = 300;

export default function Menu() {
    const theme = useTheme();

    const MyDrawer = styled(MuiDrawer)({
        width: drawerWidth,
        flexShrink: 0,
        boxSizing: 'border-box',
        [`& .${drawerClasses.paper}`]: {
            width: drawerWidth,
            backgroundColor: `${theme.palette.divider}`
        },
    });

    const [schedule, setSchedule] = useState(0);
    const [lastScheduleIndex, setLastScheduleIndex] = useState(0);
    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
      setOpen(newOpen);
    };

    const handleChange = (event: SelectChangeEvent) => {
      if(event.target.value === undefined) return;

      setSchedule(Number(event.target.value));
    };

    const query = useMediaQuery('(min-width:800px)');


    if(!query) return <></>;
    else return (
        <MyDrawer variant="permanent">
            <Box sx={{p: '10px', backgroundColor: `${theme.palette.background.default}` }}>
                <Row>
                <Select fullWidth value={`${schedule}`} onChange={handleChange}
                IconComponent={React.forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => (<UnfoldMoreSharpIcon fontSize="small" sx={{fill: 'white'}} {...props} ref={ref}/>))}
                inputProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        backgroundColor: theme.palette.background.default
                      }
                    }
                  }
                }}
                sx={{
                  border: '2px solid',
                  textAlign: 'center',
                  width: 100,
                  color: theme.palette.text.primary,
                  borderColor: theme.palette.divider,
                  maxHeight: 45,
                  '&.MuiList-root': {
                    p: '8px',
                  },
                  [`& .${selectClasses.select}`]: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    p: '16px',
                  },
                }}
                >
                  {Array.from({length: lastScheduleIndex + 1}).map((_, index) => <MenuItem key={index} value={index}>Schedule {index + 1}</MenuItem>)}                  
                  <Divider></Divider>
                  <MenuItem key="add-schedule-menu-item" onClick={() => {setLastScheduleIndex(lastScheduleIndex + 1);}}>Add schedule</MenuItem>
                </Select>
                <CourseSearch />
                </Row>
            </Box>
        </MyDrawer>
    );
};
