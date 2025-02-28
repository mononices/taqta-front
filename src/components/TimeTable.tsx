import React, { useEffect, useMemo, useState } from "react";
import Column from "./Column";
import { useCourseStore, useScheduleStore } from "./Menu";
import { Card, CardContent, Typography, useTheme } from "@mui/material";

const days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const hours = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
const dayMapping = {
    'M': 0,
    'T': 1,
    'W': 2,
    'R': 3,
    'F': 4
};

type DayKey = keyof typeof dayMapping;

const parseTime = (timeStr: string) => {
    const [time, modifier] = timeStr.split(' '); // Split "01:00 PM" into ["01:00", "PM"]
    const [hours, minutes] = time.split(':').map(Number); // Convert "01:00" to [1, 0]

    let hours24 = hours;
    if (modifier === 'PM' && hours !== 12) hours24 += 12; // Convert PM to 24-hour format
    if (modifier === 'AM' && hours === 12) hours24 = 0; // Convert 12 AM to 00:00

    return new Date().setHours(hours24, minutes, 0, 0); // Create timestamp
};

function parseTimeRange(timeRange: string) {
  const [start, end] = timeRange.split('-').map(time => time.trim()); // Split and trim
  return {
    start: new Date(parseTime(start)),
    end: new Date(parseTime(end))
  };
}

function TimeTable(){
    const { courseLists } = useCourseStore();
    const [ courses, setCourses ] = useState<React.ReactNode[][]>([
        [], [], [], [], [], [], []
    ]); 

    const { schedule } = useScheduleStore();
    const theme = useTheme();

    useEffect(() => {
        const localCourses: React.ReactNode[][] = [ [], [], [], [], [], [], []];
        if(courseLists[schedule] && courseLists[schedule].courses){
            for(const course of courseLists[schedule].courses){
                for (const type of course.types){
                    if(!type.selected) continue;
                
                    const session = type.sessions.find((s: any) => (s.section + s.type) === type.selected) 
                    if(!session) continue;
                    const selectedDays = session.days;
                    const start: Date = new Date(parseTime(session.start_time));
                    const end: Date = new Date(parseTime(session.end_time));

                    const translationY = 120 * (start.getHours() + (start.getMinutes() / 60) - 8);
                    for(const day of selectedDays as DayKey[]){
                        const index = dayMapping[day];
                        console.log("Course", session, "has", index);
                        if(index !== undefined){
                            localCourses[index].push(
                            <Card key={session._id} sx={{
                                position: 'absolute',
                                height: `${Math.floor(120 * (end - start) / 1000 / 3600)}px`,
                                left: 0,
                                right: 0,
                                transform: `translateY(${translationY}px)`,
                                backgroundColor: theme.palette.secondary.main,
                                borderRadius: 0,
                            }}>
                                <CardContent sx={{p: '8px 0px 0px 12px !important', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'start', alignItems: 'start', borderTop: '1px solid blue'}}>
                                    <Typography variant="subtitle2" sx={{fontWeight: 'bold', fontSize: 13}}>
                                    {session.abbreviation}
                                    </Typography>
                                    <Typography variant="subtitle2" sx={{fontSize: 12}}>
                                    {session.section}{session.type} / ({start.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit", hour12: false})}-{end.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit", hour12: false})})
                                    <br/>
                                    {session.faculty_member} ({session.room_cap.split(' ')[0] ?? ""})
                                    <br/>
                                    {session.ec_cr} ECTS credits
                                    </Typography> 
                                </CardContent>
                            </Card>);
                        }
                    }
                }
            }
        }

        console.log(localCourses);
        setCourses(localCourses);
    }, [courseLists, schedule]);
    
    const grid = days.map((day, index) => <Column key={day} day={day}>{courses[index]}</Column>);
    const slots = useMemo(() => {
        // time rows
        return <div style={{ width: '100%', maxWidth: '60px' }}>
            <div className="header"></div>
            {hours.map(hour => (<div className="cell" key={hour}>{hour}</div>))}
        </div>
    }, []);

    const table = useMemo(() => <div style={{display: 'flex'}}>{slots}<div className="timetable">{grid}</div></div>, [grid]);
    return table;
}

export default TimeTable;
