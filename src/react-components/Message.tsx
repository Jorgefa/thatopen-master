import * as React from "react";
import * as Router from "react-router-dom"

interface Props {
  title: string,
  message: string
}


export function Message(props: Props) {
  return (
    <div style={{ padding: 36
     }}>
      <h1>{props.title}</h1>
      <p>{props.message}</p>
    </div>
  )
}