import { Accordion, AccordionDetails, AccordionProps, AccordionSummary, Box, Button, Checkbox, Divider, FormControlLabel, IconButton, List, ListItem, ListItemText, styled, Switch, TextField, Typography, useTheme } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import { useCourseStore, useScheduleStore } from "./Menu";
import React, { useCallback, useRef, useState } from "react";
import { CustomCheckbox } from "./CustomCheckbox";
import { API_URL } from "../config";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { CustomTextField } from "./CustomTextField";

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
    const [ names, setNames ] = useState<string[]>([]);
    const [ input, setInput ] = useState<string>("");

    const handleMinimizeWindows = (event: React.ChangeEvent<HTMLInputElement>) => {
      setMinimizeWindows(event.target.checked);
    }

    const addName = () => {
      if (input.trim() !== "") {
        setNames([...names, input.trim()]);
        setInput("");
      }
    };
    
    const deleteName = (index: number) => {
      setNames(names.filter((_, i) => i !== index));
    };

    const generate = useCallback(() => {
      axios.post(API_URL + "schedule/generate", {
        id: schedule,
        options: {
          minimizeWindows: minimizeWindows,
          professorBlacklist: names
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
              if(status === "failed") clearInterval(pollingRef.current);
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
    }, [names, minimizeWindows]);

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
              <AccordionDetails>
              <Box display="flex" flexDirection="row">
              <CustomTextField
                label="Enter name"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                sx={{ mb: "10px", maxHeight: "45px", boxSizing: 'border-box', '& .MuiInputLabel-root': {
                  transform: 'translate(14px, 13px) scale(1)',
                  fontSize: '14px'
                },
                '& .MuiInputLabel-shrink': {
                  transform: 'translate(14px, -9px) scale(0.8)'
                }
               }}
              />
              <Button sx={{height: "45px", textTransform: 'none'}} disableElevation variant="contained" color="primary" onClick={addName} style={{ marginLeft: 10 }}>
                Add
              </Button>
              </Box>
              <List>
                {names.map((name, index) => (
                  <ListItem key={index} secondaryAction={
                    <IconButton edge="end" color="secondary" onClick={() => deleteName(index)}>
                      <DeleteIcon sx={{fill: 'white'}}/>
                    </IconButton>
                  }>
                    <ListItemText primary={name} />
                  </ListItem>
                ))}
              </List>
              </AccordionDetails>
            </CustomAccordion>
            {
            /* <CustomAccordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fill: 'white'}}/>}>
                <Typography variant="subtitle2">Declutter specific days</Typography>
              </AccordionSummary>
            </CustomAccordion>*/
            }
          </List>
        </AccordionDetails> 
        <Button onClick={generate} disableElevation variant="contained" sx={{width: '100%', fontSize: '14px', backgroundColor: 'transparent', borderTop: '1px solid', borderColor: theme.palette.divider, height: 40, textTransform: 'none', borderRadius: '0'}} startIcon={<AutoAwesomeOutlinedIcon sx={{fontSize: 2}} />}>Generate</Button>
    </Accordion>
    )
};