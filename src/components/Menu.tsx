import { backdropClasses, Box, Button, Card, CardActionArea, CardContent, Divider, Drawer, FormControl, InputLabel, List, MenuItem, OutlinedInput, Select, SelectChangeEvent, selectClasses, styled, SvgIconProps, Typography, useMediaQuery, useTheme } from "@mui/material";
import MuiDrawer, { drawerClasses, DrawerProps } from '@mui/material/Drawer';
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import UnfoldMoreSharpIcon from '@mui/icons-material/UnfoldMoreSharp';
import Row from "./Row";
import CourseSearch from "./CourseSearch";
import { create } from "zustand";
import { __unsafe_useEmotionCache } from "@emotion/react";

const drawerWidth = 300;
const MemoCourseSearch = React.memo(CourseSearch);

const Weirdo = (props: DrawerProps) => {
  return <MuiDrawer {...props}></MuiDrawer>
}

const MyDrawer = styled(Weirdo)(({theme}) => ({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  [`& .${drawerClasses.paper}`]: {
      width: drawerWidth,
      backgroundColor: `${theme.palette.divider}`
  },
}));

interface CourseListProps {
  scheduleIndex: number
}

type CourseStore = {
  courseLists: any[];
  addItem: (courseList: any) => void;
  setItem: (index: number, courseList: any) => void;
  setItems: (courseLists: any[]) => void;
  clearItems: () => void;
};

export const useCourseStore = create<CourseStore>((set) => ({
  courseLists: [],
  addItem: (courseList: any) => set((state) => ({ courseLists: [...state.courseLists, courseList] })),
  setItem: (index: number, courseList: any) => set((state) => { 
    const courseListsCopy = [...state.courseLists];

    while(courseListsCopy.length <= index){
      courseListsCopy.push([]);
    }

    courseListsCopy[index] = courseList;
    return { courseLists: courseListsCopy };
  }),
  setItems: (courseLists: any[]) => set({ courseLists: courseLists }),
  clearItems: () => set({ courseLists: [] })
}));

const CourseList = ({scheduleIndex} : CourseListProps) => {
  const theme = useTheme();
  const [selectedCardKey, setSelectedCardKey] = useState("");

  const { courseLists } = useCourseStore();
  const courses = useMemo(() => {
    return courseLists[scheduleIndex] ?? [];
  }, [scheduleIndex, courseLists]);

  return (<List>{
      courses.map((course: any) => 
        <Card key={course._id} 
        sx={{
          backgroundColor: theme.palette.secondary.main,
          border: '1px solid', 
          borderColor: theme.palette.divider
        }}>
          <CardActionArea onClick={() => {
            if(selectedCardKey === course._id) setSelectedCardKey(""); 
            else setSelectedCardKey(course._id)
          }}  
            data-active={selectedCardKey === course._id ? '' : undefined} sx={{
              '&[data-active]': {
                backgroundColor: theme.palette.success.main,
                '&:hover': {
                  backgroundColor: 'action.selectedHover',
                },
              },
            }}>
            <CardContent>
              <Typography variant="body2" sx={{fontWeight: 'bold'}}>
              {course.abbreviation}
              </Typography>    
              <Typography>
              {course.title}
              </Typography>
              <Box sx={{overflowX: 'auto', display: 'flex', gap: 2}}>
              {course.types?.map((sessionType: any) => {
                <Select value={sessionType.selected}>
                  {Array.from(sessionType.sessions).map((_, index) => <></>)}
                </Select>
              })}
              </Box>
            </CardContent>
          </CardActionArea>
         </Card>)
  }</List>);
}

export default function Menu() {
    const theme = useTheme();

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
    const [pickedCourses, setPickedCourses] = useState<any[]>([]);

    const MenuDrawer = () => {
        return (
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
                </Row>
                <CourseList scheduleIndex={schedule}/>
            </Box>
            <CourseSearch scheduleIndex={schedule}/>
        </MyDrawer>);
    };
    
    if(!query) return <></>;
    else return (
        <MenuDrawer />
    );
};
