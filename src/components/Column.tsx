interface ColumnProps {
    day: string,
    children?: React.ReactNode
}

function Column({day, children}: ColumnProps){
    var rows = [];
    for(let hour = 8; hour < 24; hour++){
        rows.push(<div className="cell" key={`row-${hour}`}></div>)
    }

    return (
        <div className="column" key={`column-${day}`}>
            <div className="header">{day}</div>
            {children}
            {rows}
        </div>)
    
}

export default Column;