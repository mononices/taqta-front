import * as React from 'react';
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Button from '@mui/material/Button';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import useTheme from '@mui/material/styles/useTheme';
import { Card, CardContent, Drawer, IconButton, MenuItem, Select, SelectChangeEvent, selectClasses, SelectProps, styled, SvgIconProps, TextField, TextFieldProps, Typography } from '@mui/material';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import UnfoldMoreSharpIcon from '@mui/icons-material/UnfoldMoreSharp';
import { useEffect, useMemo, useState } from 'react';
import { API_URL } from '../config';
import axios from 'axios';
import Row from './Row';
import { RemoveCircleOutline } from '@mui/icons-material';
import { useCourseStore, usePickedCourses } from './Menu';
import { useContext } from 'react';

const drawerWidth = 300;

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

const CustomTextField = styled((props: TextFieldProps) => (
      <TextField {...props}/>))(({theme}) => ({
        maxHeight: 45,
        width: '100%',
        '& .MuiInputBase-root': {
          height: 45,
          border: '2px solid',
          borderColor: theme.palette.divider,
        },
        '& .MuiFilledInput-root': {
          textAlign: 'center',
          width: '100%',
          color: theme.palette.text.primary,
        }
}));

const CustomSelect = styled((props: SelectProps) => (
    <Select {...props}/>))(({theme}) => ({
        border: '2px solid',
        textAlign: 'center',
        width: '100%',
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
}));

export interface CourseSearchProps {
  scheduleIndex: number;
};

export default function CourseSearch({scheduleIndex} : CourseSearchProps) {
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const theme = useTheme(); 

  const [degree, setDegree] = useState(0);
  const handleDegreeChange = (event: SelectChangeEvent) => {
      if(event.target.value === undefined) return;

      setDegree(Number(event.target.value));
  };

  const [term, setTerm] = useState(0);
  const handleTermChange = (event: SelectChangeEvent) => {
      if(event.target.value === undefined) return;

      setTerm(Number(event.target.value));
  };

  const { courseLists, setItem } = useCourseStore();
  const [searchedCourseValue, setSearchedCourseName] = useState("");
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [localPickedCourses, setLocalPickedCourses] = useState<any[]>(courseLists[scheduleIndex] ?? []);

  useEffect(() => {
    setIsLoading(true);
    axios.get(API_URL + "course", {params: {contains: searchedCourseValue}})
    .then((res) => {
      setCourses(res.data ?? []);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => setIsLoading(false));
  }, [searchedCourseValue]);

  const Courses = useMemo(() => (
    <List>{courses.map((course: any) => (
    <Card key={course._id} sx={{
      backgroundColor: theme.palette.secondary.main,
      border: '1px solid', 
      borderColor: theme.palette.divider
    }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography gutterBottom variant="body2" sx={{color: theme.palette.success.light, fontWeight: 'bold'}}>
          {course.abbreviation}
        </Typography>
        <Typography gutterBottom variant="caption" sx={{color: theme.palette.grey[400], fontWeight: 'bold'}}>
          {course.school}{bull}{course.ec_cr} credits
        </Typography>
        </Box>
        <Typography sx={{mb: '10px'}} variant="body1">
          {course.title}
        </Typography>
        {
          localPickedCourses.find(e => e._id === course._id) ?
          <Button disableElevation variant="contained" color="error" sx={{fontSize: '14px', height: 32, textTransform: 'none'}} startIcon={<RemoveCircleOutline sx={{fontSize: 2}}/>} onClick={() => setLocalPickedCourses((prev) => prev.filter(item => item !== course))}>Remove</Button>
          : <Button disableElevation variant="contained" color="success" sx={{fontSize: '14px', height: 32, textTransform: 'none'}} startIcon={<AddCircleOutline sx={{fontSize: 2}}/>} onClick={() => setLocalPickedCourses((prev) => [...prev, course])}>Add</Button>
        }
        </CardContent>
    </Card>))}</List>
  ), [searchedCourseValue, courses, localPickedCourses]);    

  const onClose = () => {
    setOpen(false);
    console.log(localPickedCourses);
    setItem(scheduleIndex, localPickedCourses);
    console.log("Course list on close: ", courseLists);
  }

  const DrawerList = useMemo(() => (
    <Box role="presentation" sx={{p: '10px', boxSizing: 'border-box', width: drawerWidth, maxWidth: drawerWidth, backgroundColor: `${theme.palette.background.default}`}} >
      <Button disableElevation variant="contained" sx={{fontSize: '16px', border: '2px solid', borderColor: theme.palette.divider, backgroundColor: theme.palette.background.default, height: 45, textTransform: 'none'}} startIcon={<ChevronLeftOutlinedIcon sx={{fontSize: 'small'}}/>} onClick={onClose}>Back</Button>
      <Divider sx={{mt: '10px', mb: '10px'}}/>
      <CustomSelect sx={{mb: '10px'}} fullWidth value={`${degree}`} onChange={handleDegreeChange}
            IconComponent={React.forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => (<UnfoldMoreSharpIcon fontSize="small" sx={{fill: 'white'}} {...props} ref={ref}/>))}
            inputProps={{
                MenuProps: {
                PaperProps: {
                    sx: {
                    backgroundColor: theme.palette.background.default
                    }
                }
                }
            }}>
                <MenuItem key={0} value={0}>Undergraduate</MenuItem>
                <MenuItem key={1} value={1}>Master</MenuItem>
                <MenuItem key={2} value={2}>PhD</MenuItem>
                <MenuItem key={3} value={3}>Doctor Of Medicine</MenuItem>
                <MenuItem key={4} value={4}>Zero Years of Master's Program</MenuItem>
      </CustomSelect>
      <CustomSelect sx={{mb: '10px'}} fullWidth value={`${term}`} onChange={handleTermChange}
            IconComponent={React.forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => (<UnfoldMoreSharpIcon fontSize="small" sx={{fill: 'white'}} {...props} ref={ref}/>))}
            inputProps={{
                MenuProps: {
                PaperProps: {
                    sx: {
                    backgroundColor: theme.palette.background.default
                    }
                }
                }
            }}>
                <MenuItem key={0} value={0}>Spring 2025</MenuItem>
                <MenuItem key={1} value={1}>Fall 2024</MenuItem>
                <MenuItem key={2} value={2}>Summer 2024</MenuItem>
                <MenuItem key={3} value={3}>Spring 2024</MenuItem>
      </CustomSelect>
      <CustomTextField sx={{mb: '10px'}} id="controlled-course-searchfield" value={searchedCourseValue} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setSearchedCourseName(event.target.value)}}></CustomTextField>
      <Divider />
      {Courses}
    </Box>
  ), [degree, term, searchedCourseValue, Courses]);

  return (
    <>
      <Button variant="contained" color="success" sx={{borderRadius: 0, maxHeight: 45, textTransform: 'none'}} startIcon={<AddCircleOutline sx={{fontSize: 4}}/>} onClick={toggleDrawer(true)}>Add course</Button>
      <Drawer BackdropProps={{ invisible: true }} open={open} onClose={() => {toggleDrawer(false);}} sx={{width: drawerWidth}}>
        {DrawerList}
      </Drawer> 
    </>
  );
}
