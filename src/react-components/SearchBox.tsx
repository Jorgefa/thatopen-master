import * as React from "react";
import * as BUI from "@thatopen/ui";

interface Props {
  onChange: (value: string) => void
}

export function SearchBox(props: Props) {
  const searchInput = document.getElementById("search-input") as BUI.TextInput
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      props.onChange(searchInput.value)
    })
  }

  return (
    <div style={{ display: "flex", alignItems: "center", columnGap: 10, width: "40%" }}>
      <bim-text-input placeholder="Search" id="search-input"></bim-text-input>
    </div>
  )
}