// src/components/Navbar.js
import React, { useState, useEffect } from "react";
import Logo from "../assets/image/logo_main.png";
import Swal from 'sweetalert2';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Collapse,
  Menu,
  MenuItem,
  IconButton,
  Avatar,
} from "@mui/material";
import {
  Home as HomeIcon,
  Settings as SettingsIcon,
  MonetizationOn as MonetizationOnIcon,
  TableChart as TableChartIcon,
  Menu as MenuIcon,
  PowerSettingsNew as PowerSettingsNewIcon,
  ExpandMore,
  ExpandLess,
  AccountCircle,
  Person,
  Storage as StorageIcon,
  DataUsage as DataUsageIcon,
  Book as BookIcon
} from "@mui/icons-material";

const Navbar = ({ onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pengaturanOpen, setPengaturanOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // Fetch username from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem("data");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        const userData = parsedData[0];
        const namaLengkap = userData?.attributes?.user?.namaLengkap;
        const emailuser = userData?.attributes?.user?.email;
        setUsername(namaLengkap || "User");
        setEmail(emailuser || "user.example@mail.com")
      } catch (error) {
        console.error("Failed to parse localStorage data:", error);
        setUsername("User");
      }
    }
  }, []);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };


  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  /*modal logout */
  const handleLogoutClick = () => {
    // Menampilkan SweetAlert2 konfirmasi logout
    handleMenuClose();
    Swal.fire({
      title: 'Konfirmasi Logout',
      text: "Apakah Anda yakin ingin logout?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Logout',
      cancelButtonText: 'Batal',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        onLogout(); // Panggil fungsi logout
        localStorage.clear()
      }
    });
  };



  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#FFFFFF" }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >

        {/* Logo
        <div style={{ flexGrow: 1, textAlign: "center" }}>
          <img
            src={Logo}
            alt="Logo"
            style={{ maxHeight: "50px", objectFit: "contain" }}
          />
        </div> */}


        <div>
          <IconButton
            color="inherit"
            onClick={handleMenuClick}
            sx={{ display: "flex", alignItems: "center", gap: '8px', color: "#002147" }}
          >
            <AccountCircle />
            <Typography variant="body1" sx={{ color: "#002147" }}>
              Hi, {username}
            </Typography>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            PaperProps={{
              sx: {
                width: 300, // Menentukan lebar menu
                maxWidth: 300, // Menentukan lebar maksimum menu
                minWidth: 250, // Menentukan lebar minimum menu
              },
            }}
          >
            <MenuItem>
              <Avatar sx={{ marginRight: 2, fontSize: 80 }} />
              <div>
                <Typography sx={{ fontSize: "18px", fontWeight: "bold", color: "#616161" }}> {username}</Typography>
                <Typography sx={{ fontSize: "14px", color: "#757575" }}>{email}</Typography>
              </div>
            </MenuItem>
            <MenuItem>
              <Person sx={{ marginRight: 1, color: '#616161' }} />
              <Typography sx={{ fontSize: "14px", color: "#616161" }}>  My Profile</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogoutClick}>
              <PowerSettingsNewIcon sx={{ marginRight: 1, color: '#616161' }} />
              <Typography sx={{ fontSize: "14px", color: "#616161" }}> Logout</Typography>
            </MenuItem>

          </Menu>

        </div>
      </Toolbar>
    </AppBar>


  )
};

export default Navbar;
