import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from "../assets/image/logo_main.png";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Tooltip, Switch, FormControlLabel, Box, colors } from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  TableChart as TableChartIcon,
  Storage as StorageIcon,
  GridView as GridViewIcon
} from "@mui/icons-material";
import Footer from './Footer';

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();
  const [role, setRole] = useState("");

  // Fetch username from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem("data");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        const userData = parsedData[0];
        const rolename = userData?.attributes?.role;
        setRole(rolename);
      } catch (error) {
        console.error("Failed to parse localStorage data:", error);
      }
    }
  }, []);


  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, link: '/' },
    { text: 'User', icon: <PeopleIcon />, link: '/user' },
    { text: 'Rekap Data Murid', icon: <StorageIcon />, link: '/rekap_data' },
    { text: 'Data Stunting', icon: <GridViewIcon />, link: '/data-stunting' },
    { text: 'Grafik K-means', icon: <TableChartIcon />, link: '/k_means' },
  ];

   // Filter menu berdasarkan role
   const filteredMenu = menuItems.filter(item => !(role === "Admin Sekolah" && item.text === "User"));

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? 240 : 60,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? 240 : 60,
          transition: 'width 0.3s ease-in-out',
          overflowX: 'hidden',
          backgroundColor: '#fff',
          boxShadow: '2px 0px 5px rgba(28, 95, 229, 0.2)',
        },
      }}
    >
      {/* Logo */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: open ? "70px" : "55px", // Adjust the height of the logo container
        padding: open ? "10px" : "5px", // Adjust padding if necessary
        marginBottom: "5px", // Reduce the margin between logo and menu list
        backgroundColor: "#0a32b8"
      }}>
        <img
          src={Logo}
          alt="Logo"
          style={{ maxHeight: open ? "70px" : "50px", objectFit: "contain" }}
        />
      </div>



      {/* List Menu */}
      <div style={{ marginTop: 0, alignContent: 'center' }}>
        <List >
          {filteredMenu.map((item, index) => (
            <Tooltip title={!open ? item.text : ''} placement="right" key={index}>
              <ListItem
                button
                component={Link}
                to={item.link}
                selected={location.pathname === item.link}
                sx={{
                  justifyContent: open ? 'flex-start' : 'center',
                  paddingLeft: open ? '20px' : '45px',
                  transition: 'padding 0.2s ease-in-out',
                }}
              >
                <ListItemIcon sx={{ color: location.pathname === item.link ? '#00796b' : '#757575' }}>
                  {item.icon}
                </ListItemIcon>
                {open && <ListItemText primary={item.text} />}
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </div>

      {/* Toggle Switch */}
      <div style={{ padding: "10px", alignSelf: open ? "center" : "center" }}>
        <FormControlLabel
          control={<Switch checked={open} onChange={() => setOpen(!open)} />}
          // label={open ? "Close Sidebar" : "Open Sidebar"}
          sx={{
            marginLeft: open ? "10px" : "0px",
            transition: "all 0.2s ease-in-out",
          }}
        />
      </div>

      <Footer></Footer>
    </Drawer>
  );
};

export default Sidebar;