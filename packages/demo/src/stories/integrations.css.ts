import { style } from "@vanilla-extract/css";

const white75Background = "rgb(255 255 255 / 80%)";

export const iframe = style({
  position: "absolute",
  top: 0,
  left: 0,
  height: "100%",
  width: "100%",
});

export const badge = style({
  display: "flex",
  alignItems: "center",
  flexDirection: "row",

  gap: 8,
  position: "absolute",
  // pointerEvents: 'none',
  cursor: "default",
  top: 20,
  left: 20,
  background: white75Background,
  padding: 15,
  borderRadius: 12,
  boxShadow:
    "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
});

export const badgeVersion = style({
  transform: "translateY(2px)",
  fontSize: 11,
  color: "#666",
});

export const info = style({
  position: "absolute",
  bottom: 20,
  left: 20,
  fontSize: 14,
  cursor: "pointer",
  color: "#fff",
  border: "1px solid #ccc",
  width: 20,
  height: 20,
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow:
    "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",

  selectors: {
    "&:hover:before": {
      opacity: 1,
      pointerEvents: "auto",
    },
    "&:before": {
      content: "attr(data-text)",
      opacity: 0,
      color: "#484848",
      pointerEvents: "none",
      transition: "0.2s",
      boxShadow:
        "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
      padding: "10px 20px",
      lineHeight: 1.5,
      borderRadius: 10,
      borderBottomLeftRadius: 2,
      background: white75Background,

      position: "absolute",
      bottom: "50%",
      left: "100%",
      transform: "translate(3px, -12px)",
      width: 275,
    },
  },
});
