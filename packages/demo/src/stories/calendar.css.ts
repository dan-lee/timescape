import { style } from "@vanilla-extract/css";
import { baseColor, lightColor } from "./timescape.css.ts";

export const wrapper = style({
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gap: "1px",
  boxShadow: "0 0 0 1px #ccc, 0 7px 29px 0 rgba(100, 100, 111, 0.2)",
  borderRadius: "0.25rem",
});

export const bar = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0.5rem",
});

export const dayItem = style({
  width: 35,
  height: 35,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "95%",
  fontVariantNumeric: "tabular-nums",
  outline: "1px solid #dedcdc",
  color: "#333",
  backgroundColor: "#fff",
  cursor: "pointer",
  transition:
    "background-color 0.2s ease-in-out, outline-color 0.2s ease-in-out",

  selectors: {
    "&:first-child": {
      borderTopLeftRadius: "0.25rem",
    },
    "&:nth-child(7)": {
      borderTopRightRadius: "0.25rem",
    },
    "&:nth-child(36)": {
      borderBottomLeftRadius: "0.25rem",
    },
    "&:last-child": {
      borderBottomRightRadius: "0.25rem",
    },
    "&:hover": {
      backgroundColor: lightColor,
      outline: `1px solid ${lightColor}`,
      color: "#fff",
      zIndex: 1,
    },
    '&[data-current-month="false"]': {
      backgroundColor: "#f5f5f5",
      color: "#7c7c7c",
    },
    '&[data-selected="true"]': {
      backgroundColor: baseColor,
      outline: `1px solid ${baseColor}`,
      color: "#fff",
      zIndex: 1,
    },
    '&[data-range="in-range"]': {
      backgroundColor: baseColor,
      outline: `1px solid ${baseColor}`,
      filter: "brightness(0.95)",
      color: "#fff",
      zIndex: 1,
    },
    '&[data-range="will-be-in-range"]': {
      backgroundColor: "#eaeaea",
      outline: "1px solid #ccc",
      color: "#555",
      zIndex: 1,
    },
  },
});

/*

width: 35;
height: 35;
display: flex;
justify-content: center;
align-items: center;
font-size: 95%;
font-variant-numeric: tabular-nums;
outline: 1px solid #dedcdc;
color: #333;
background-color: #fff;
cursor: pointer;
transition: background-color 0.2s ease-in-out, outline-color 0.2s ease-in-out;

&:first-child: null;
&:nth-child(7): null;
&:nth-child(36): null;
&:last-child: null;
&:hover: null;
&[data-current-month="false"]: null;
&[data-selected="true"]: null;
&[data-range="in-range"]: null;
&[data-range="will-be-in-range"]: null;

 */
