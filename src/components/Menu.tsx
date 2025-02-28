import { backdropClasses, Box, Button, Card, CardActionArea, CardContent, Divider, Drawer, FormControl, InputLabel, List, MenuItem, OutlinedInput, Select, SelectChangeEvent, selectClasses, styled, SvgIconProps, Typography, useMediaQuery, useTheme } from "@mui/material";
import MuiDrawer, { drawerClasses, DrawerProps } from '@mui/material/Drawer';
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import UnfoldMoreSharpIcon from '@mui/icons-material/UnfoldMoreSharp';
import Row from "./Row";
import CourseSearch from "./CourseSearch";
import { create } from "zustand";
import { __unsafe_useEmotionCache } from "@emotion/react";
import { CustomSelect } from "./CustomSelect";
import { bull } from "./Bull";
import { ScheduleGenerator } from "./Generator";
import { API_URL } from "../config";
import axios from "axios";
import { PictureAsPdfRounded } from "@mui/icons-material";
import { MyDrawer } from "./CustomDrawer"

const drawerWidth = 300;
const MemoCourseSearch = React.memo(CourseSearch);

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

    const updatedScheduleList = prepare(courseListsCopy);
    try{
      const response = axios.post(API_URL + "schedule/save", {
        schedules: updatedScheduleList 
      },
      {
        'headers': {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
    } catch(err){}

    return { courseLists: courseListsCopy };
  }),
  setItems: (courseLists: any[]) => set({ courseLists: courseLists }),
  clearItems: () => set({ courseLists: [] })
}));

type ScheduleStore = {
  schedule: number;
  setSchedule:(index: number) => void;
};

export const useScheduleStore = create<ScheduleStore>((set) => ({
  schedule: 0,
  setSchedule: (index: number) => set({ schedule: index })
}));

type Schedule = {
  _id?: string, 
  courses: Array<{body: string, picked: {}}>
};

const prepare = (scheduleList: any) => {
  const preparedList: Array<Schedule> = [];

  for(const schedule of scheduleList){
    const preparedSchedule: Schedule = {
      _id: schedule._id, courses: []
    };

    if(!schedule.courses) continue;

    for(const course of schedule.courses){
      if(!course.types) continue;

      const preparedCourse: {body: string, picked: Record<string, any>} = {body: course._id, picked: {}};

      for(const type of course.types){
        if(!type.selected) continue;
        const match = type.sessions.find((session: { type: string; section: any; }) => session.section + session.type === type.selected);
        if(!match) continue;

        preparedCourse.picked[type.abbreviation] = match._id;
      }
      preparedSchedule.courses.push(preparedCourse);
    }
    preparedList.push(preparedSchedule);
  }

  return preparedList;
}

const CourseList = ({scheduleIndex} : CourseListProps) => {
  const theme = useTheme();
  const [selectedCardKey, setSelectedCardKey] = useState("");

  const { courseLists, setItem } = useCourseStore();

  const courses = useMemo(() => {
    return courseLists[scheduleIndex]?.courses ?? [];
  }, [scheduleIndex, courseLists]);

  return (<List>{
      courses.map((course: any) => 
        <Card key={course._id} 
        sx={{
          backgroundColor: theme.palette.secondary.main,
          border: '1px solid', 
          borderColor: theme.palette.divider,
          mb: '10px'
        }}>
          <CardActionArea disableRipple onClick={() => {
            if(selectedCardKey === course._id) setSelectedCardKey(""); 
            else setSelectedCardKey(course._id)
          }}  
            data-active={selectedCardKey === course._id ? '' : undefined} sx={{
              '&[data-active]': {
                backgroundColor: 'action.selectedHover', 
                '&:hover': {
                  backgroundColor: 'action.selectedHover',
                },
              },
            }}>
            <CardContent>
              <Typography variant="body2" sx={{fontWeight: 'bold'}}>
              {course.abbreviation}
              </Typography>    
              <Typography sx={{mb: '10px'}}>
              {course.title}
              </Typography>
              <Box sx={{overflowX: 'auto', display: 'flex', gap: 2}}>
              {course.types?.map((sessionType: any) => {
                return <CustomSelect value={sessionType.selected ?? 'N/A'} 
                renderValue={(selected) => selected}
                onChange={(event) => {
                  sessionType.selected = event.target.value;
                  console.log(sessionType.selected);
                  setItem(scheduleIndex, {_id: courseLists[scheduleIndex]?._id, courses: courses});  
                }} IconComponent={() => null} sx={{maxHeight: '20px', fontSize: 12, width: 'fit-content', flexGrow: 0}}inputProps={{
                sx: {
                  pr: '14px !important'
                },
                MenuProps: {
                PaperProps: {
                    sx: {
                    backgroundColor: theme.palette.background.default
                    }
                }
                }
            }}> 
                  <MenuItem key="N/A" value="N/A">N/A</MenuItem>
                  {Array.from(sessionType.sessions).map((session: any, index) => <MenuItem key={session._id} value={session.section + session.type}>{session.section}{session.type}{bull}{session.start_time}-{session.end_time}</MenuItem>)}
                </CustomSelect>
              })}
              </Box>
            </CardContent>
          </CardActionArea>
         </Card>)
  }</List>);
}

export default function Menu() {
    const theme = useTheme();

    const { setItems } = useCourseStore();
    const { schedule , setSchedule } = useScheduleStore();
    const [lastScheduleIndex, setLastScheduleIndex] = useState(0);
    
    const handleChange = (event: SelectChangeEvent) => {
      if(event.target.value === undefined) return;

      setSchedule(Number(event.target.value));
    };

    const query = useMediaQuery('(min-width:800px)');

    useEffect(() => {
      try{
        axios.get(API_URL + "user/me/schedules", {
            'headers': {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then(response => {
            const schedules = response.data.schedules.map((schedule: any) => {
              const preparedCourses: any[] = [];
              for(const course of schedule.courses){
                const preparedCourse = course.body;
                for(const [key, pickedSession] of Object.entries(course.picked)){
                    for(const type of preparedCourse.types){
                      if(type.abbreviation === key){
                        const picked = type.sessions.find((session: any) => session._id === pickedSession);
                        type.selected = picked.section + picked.type; 
                      }
                    }
                }
                preparedCourses.push(preparedCourse);
              }

              return {
                _id: schedule._id,
                courses: preparedCourses
              }
            });         
            
          //console.log(schedules);
          if(schedules.length) setLastScheduleIndex(schedules.length - 1);
          setItems(schedules);
        });
      }
      catch(err){
        //console.log(err);
      }
    }, [])

    const MenuDrawer = () => {
        return (
        <MyDrawer variant="permanent">
            <Box sx={{p: '10px', flexDirection: 'column',backgroundColor: `${theme.palette.background.default}` }}>
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
            <ScheduleGenerator />
            <CourseSearch scheduleIndex={schedule}/>
        </MyDrawer>);
    };
    
    if(!query) return <></>;
    else return (
        <MenuDrawer />
    );
};
