function Column(day: string){
    var rows = [];
    for(let hour = 8; hour < 24; hour++){
        rows.push(<div className="cell"></div>)
    }

    return (
        <div className="column">
            <div className="header">{day}</div>
            {rows}
        </div>)
    
}

export default Column;