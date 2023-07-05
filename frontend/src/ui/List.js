import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import CommentIcon from "@mui/icons-material/Comment";

export default function CheckboxList() {
  const [checked, setChecked] = React.useState([0]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <List sx={{ width: "100%", maxWidth: 360 }}>
      <ListItem isablePadding>
        <ListItemButton role={undefined} dense>
          <ListItemIcon>
            <Checkbox
              edge="start"
              tabIndex={-1}
              checked={localStorage.getItem("isAgeVerified") === "true"}
              disableRipple
              style={{ color: "#7fff00" }}
              inputProps={{ "aria-labelledby": "age" }}
            />
          </ListItemIcon>
          <ListItemText id={1} primary="Verify your age" />
        </ListItemButton>
      </ListItem>
      <ListItem isablePadding>
        <ListItemButton role={undefined} dense>
          <ListItemIcon>
            <Checkbox
              edge="start"
              tabIndex={-1}
              checked={localStorage.getItem("isAgeVerified") === "true"}
              disableRipple
              style={{ color: "#7fff00" }}
              inputProps={{ "aria-labelledby": "experience" }}
            />
          </ListItemIcon>
          <ListItemText id={1} primary="Verify your experience" />
        </ListItemButton>
      </ListItem>
      <ListItem isablePadding>
        <ListItemButton role={undefined} dense>
          <ListItemIcon>
            <Checkbox
              edge="start"
              tabIndex={-1}
              checked={localStorage.getItem("isSalaryVerified") === "true"}
              disableRipple
              style={{ color: "#7fff00" }}
              inputProps={{ "aria-labelledby": "salary" }}
            />
          </ListItemIcon>
          <ListItemText id={1} primary="Verify your salary" />
        </ListItemButton>
      </ListItem>
    </List>
  );
}
