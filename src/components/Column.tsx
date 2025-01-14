interface ColumnProps {
    day: string
}

function Column({day}: ColumnProps){
    var rows = [];
    for(let hour = 8; hour < 24; hour++){
        rows.push(<div className="cell" key={`row-${hour}`}></div>)
    }

    return (
        <div className="column" key={`column-${day}`}>
            <div className="header">{day}</div>
            {rows}
        </div>)
    
}

export default Column;