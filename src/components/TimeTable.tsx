import Column from "./Column";

function TimeTable(){
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const grid = days.map(day => Column(day));
    const hours = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
    const slots = (
        <div style={{ width: '100%', maxWidth: '60px' }}>
            <div className="header"></div>
            {hours.map(hour => (<div className="cell">{hour}</div>))}
        </div>
    );

    return <><div style={{display: 'flex'}}>{slots}<div className="timetable">{grid}</div></div></>
}

export default TimeTable;
