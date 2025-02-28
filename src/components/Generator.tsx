import { Accordion, AccordionDetails, AccordionProps, AccordionSummary, Box, Button, Checkbox, Divider, FormControlLabel, List, styled, Switch, Typography, useTheme } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import { useCourseStore, useScheduleStore } from "./Menu";
import React, { useCallback, useRef, useState } from "react";
import { CustomCheckbox } from "./CustomCheckbox";
import { API_URL } from "../config";
import axios from "axios";

const CustomAccordion = styled((props: AccordionProps) => (
    <Accordion disableGutters {...props}/>))(({theme}) => ({
       flexGrow: '0 !important', 
       borderRadius: '0 !important', 
       backgroundColor: theme.palette.background.default, 
       marginTop: 0 
}));

export const ScheduleGenerator = () => {
    const theme = useTheme();
    const pollingRef = useRef<any>(null);
    const { schedule } = useScheduleStore();
    const { courseLists, setItem } = useCourseStore();
    const [ minimizeWindows, setMinimizeWindows ] = useState(true);
    const handleMinimizeWindows = (event: React.ChangeEvent<HTMLInputElement>) => {
      setMinimizeWindows(event.target.checked);
    }

    const generate = useCallback(() => {
      axios.post(API_URL + "schedule/generate", {
        id: schedule,
        options: {
          minimizeWindows: minimizeWindows
        }
      }, {
          'headers': {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
      })
      .then((res) => {
        const poll = () => {
          axios.get(API_URL + "schedule/job/" + res.data, {
            'headers': {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`
          }}).then((update) => {
              const { status, result } = update.data;
              if(status !== "completed") return;
              const preparedCourses: any[] = [];
        
              result.map((course: any) => {
                const preparedCourse = course;
                for(const type of preparedCourse.types){
                  const pick = type.sessions[type.pick];
                  type.selected = pick.section + pick.type;   
                }
                preparedCourses.push(preparedCourse);
              });
              console.log(preparedCourses);
              setItem(schedule, {_id: courseLists[schedule]._id, courses: preparedCourses});
              clearInterval(pollingRef.current);
          });
        }

        pollingRef.current = setInterval(() => {
          poll();
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
      });
    }, []);

    return (
    <Accordion disableGutters sx={{ flexGrow: '0 !important', borderRadius: '0 !important', backgroundColor: "background.default", marginTop: 0 }}>
      <AccordionSummary
          sx={{
            flexGrow: '0 !important', display: 'flex', justifyContent: 'center', 
            '& .MuiAccordionSummary-content': {
              justifyContent: 'center',
            }
          }}
          expandIcon={<ExpandMoreIcon sx={{ fill: 'white'}}/>}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <AutoAwesomeIcon sx={{fill: 'white', ml: '8px', mr: '8px', fontSize: '20px'}}></AutoAwesomeIcon>
          <Typography component="span" sx={{fontSize: '0.875rem'}}>Generate</Typography>
        </AccordionSummary>
        <AccordionDetails>
          { // <Typography variant="subtitle1">Constraints</Typography> --!>
          }
          <List>
            <CustomAccordion slotProps={{ transition: { timeout: 0 } }} >
              <AccordionSummary
              expandIcon={<Switch checked={minimizeWindows} onChange={handleMinimizeWindows}/>}
              sx={{
                transform: 'rotate(0deg) !important', 
                '& .MuiAccordionSummary-content': {
                  margin: '0px !important'
                },
                '& .Mui-expanded': {
                  transform: 'rotate(0deg) !important'
                }
              }}
                >
                <Typography variant="subtitle2">Minimize windows</Typography>
                </AccordionSummary>
            </CustomAccordion>
            <CustomAccordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fill: 'white'}}/>}>
                <Typography variant="subtitle2">Avoid professors</Typography>
              </AccordionSummary>
            </CustomAccordion>
             <CustomAccordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fill: 'white'}}/>}>
                <Typography variant="subtitle2">Declutter specific days</Typography>
              </AccordionSummary>
            </CustomAccordion>
          </List>
        </AccordionDetails> 
        <Button onClick={generate} disableElevation variant="contained" sx={{width: '100%', fontSize: '14px', backgroundColor: theme.palette.background.default, height: 36.5, textTransform: 'none', borderRadius: '0'}} startIcon={<AutoAwesomeOutlinedIcon sx={{fontSize: 2}} />}>Generate</Button>
    </Accordion>
    )
};