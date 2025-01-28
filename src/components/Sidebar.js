// src/components/Sidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Dashboard as DashboardIcon, People as PeopleIcon, TableChart as TableChartIcon, Storage as StorageIcon, GridView as GridViewIcon  } from '@mui/icons-material';
import '../assets/css/index.css';

const Sidebar = () => {
  const location = useLocation(); // Get the current path

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, link: '/' },
    { text: 'User', icon: <PeopleIcon />, link: '/user' },
    { text: 'Rekap Data', icon: <StorageIcon />, link: '/rekap_data' },
    { text: 'Clustering', icon: <GridViewIcon />, link: '/clustering' },
    { text: 'Grafik K-means', icon: <TableChartIcon />, link: '/k_means' },
  ];

  return (
    <div className="sidebar-container">
      <List>
        {menuItems.map((item, index) => (
          <ListItem button key={index} component={Link} to={item.link}
            className={location.pathname === item.link ? 'sidebar-item-active' : ''}
          >
            <ListItemIcon sx={{ color: location.pathname === item.link ? '#00796b' : '#757575', }}> {item.icon}  </ListItemIcon>
            <ListItemText primary={item.text} className={location.pathname === item.link ? 'sidebar-item-text-active' : 'sidebar-item-text'} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Sidebar;