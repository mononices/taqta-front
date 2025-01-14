import React from "react";

interface RowProps{
    children: React.ReactNode;
}

export default function Row({ children }: RowProps){
    return <div style={{width: "100%", display: "flex", flexDirection: "row", gap: "10px"}}>{children}</div>;
}