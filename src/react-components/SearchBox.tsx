import * as React from "react";

interface Props {
    onChange: (value: string) => void
}

export function SearchBox(props: Props) {
  return (
    <div style={{display:"flex", alignItems: "center", columnGap: 10, margin:"10px", width: "100%"}}>
        <input
            onChange={(e) => {props.onChange(e.target.value)}}
            type="text"
            placeholder="Search by name..."
            style={{width: "100%", backgroundColor: "var-(background-100)"}}
        />
    </div>
  )
}