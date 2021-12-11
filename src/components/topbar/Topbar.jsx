import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useContext } from "react";

import { LoginContext } from "../../context/LoginProvider";
import { useHistory } from 'react-router-dom'
import { Button, Grid, Typography } from "@mui/material";

export default function Topbar() {
  const history = useHistory()
  const { userData } = useContext(LoginContext);
  // const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
    // history.replace('/login')
}
  return (
    <div className="topbarContainer">
     <Grid
  container
  direction="row"
  justifyContent="space-around"
  alignItems="center"
>
<Typography style={{color:"white",fontWeight:"bold"}}>{`Account Name : ${userData.username}`}</Typography>
<Typography style={{color:"white",fontWeight:"bold"}}> Chat App</Typography>
<Button variant="contained" onClick={handleLogout}>Logout</Button>
  </Grid>
      
    </div>
  );
}
