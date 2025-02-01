import React, { useState, useEffect } from "react";
import axios from 'axios';
import Swal from "sweetalert2";
import '../assets/css/User_s.css';
import {
  Search,
  Add,
  Edit,
  Delete,
} from "@mui/icons-material";
import {
  Box,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  Pagination,
  IconButton,
  Accordion,
  AccordionSummary,
} from "@mui/material";

const PengaturanUser = () => {
  const [userdata, setUserdata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://103.150.197.185:10052/user/listDaftarUser');
      console.log('Data yang diterima:', response.data);
      setUserdata(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  /* Add user */
  const [addOpen, setAddOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    namaLengkap: "",
    username: "",
    asalSekolah: "",
    email: "",
    password: "",

  });
  const handleAddOpen = () => { setNewUser({ namaLengkap: "", username: "", asalSekolah: "", email: "", password: "", }); setAddOpen(true); };
  const handleAddClose = () => { setAddOpen(false); };
  const handleAddSubmit = async () => {
    handleAddClose();
    setTimeout(async () => {
      Swal.fire({
        title: "Konfirmasi Simpan Data",
        text: "Apakah Anda yakin ingin menyimpan data ini?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33, ",
        confirmButtonText: "Save",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const userData = {
              ...newUser,
              idRole: 2,
            };
            const response = await axios.post('http://103.150.197.185:10052/user/createuser', userData);
            if (response.status === 200) {
              setUserdata([...userdata, { ...userData, id: userdata.length + 1, isActive: true }]);
              Swal.fire("Berhasil!", "Data berhasil disimpan.", "success");
              window.location.reload();
            } else {
              Swal.fire("Gagal!", "Terjadi kesalahan saat menyimpan data.", "error");
            }
          } catch (err) {
            console.error(err);
            Swal.fire("Gagal!", "Terjadi kesalahan saat menyimpan data.", "error");
          }
        }
      });
    }, 300);
  };

  const handleNewChange = (field, value) => {
    setNewUser((prev) => ({ ...prev, [field]: value }));
  };


  /* Search */
  const [searchValue, setSearchValue] = useState("");
  const handleSearch = () => {
    const filteredData = userdata.filter(
      (user) =>
        user.userName.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.namaLengkap.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.email.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.asalSekolah.toLowerCase().includes(searchValue.toLowerCase())
    );
    setUserdata(filteredData);
  };

  useEffect(() => {
    fetchData();
  }, []);


  /* Edit */
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const handleEditOpen = (user) => { setSelectedUser(user); setEditOpen(true); };
  const handleEditClose = () => { setSelectedUser(null); setEditOpen(false); };
  const toggleUserStatus = () => {
    setSelectedUser((prev) => ({
      ...prev,
      isActive: !prev.isActive, // Toggle status
    }));
  };

  const handleEditSubmit = async () => {
    handleEditClose();

    setTimeout(async () => {
      Swal.fire({
        title: "Konfirmasi Simpan Data",
        text: "Apakah Anda yakin ingin menyimpan perubahan data ini?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Save",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const updatedUser = {
              idUser: selectedUser.idUser,
              email: selectedUser.email,
              namaLengkap: selectedUser.namaLengkap,
              userName: selectedUser.userName,
              updatedBy: "admin",
              active: selectedUser.isActive,
            };

            const response = await axios.post(`http://103.150.197.185:10052/user/update`, updatedUser);

            if (response.status === 200) {
              const updatedData = userdata.map((user) =>
                user.idUser === selectedUser.idUser ? { ...user, ...updatedUser } : user
              );
              setUserdata(updatedData);
              Swal.fire("Berhasil!", "Data berhasil diperbarui.", "success");
              window.location.reload();
            } else {
              Swal.fire("Gagal!", "Terjadi kesalahan saat memperbarui data.", "error");
            }
          } catch (err) {
            console.error(err);
            Swal.fire("Gagal!", "Terjadi kesalahan saat memperbarui data.", "error");
          }
        }
      });
    }, 300);
  };


  const handleEditChange = (field, value) => {
    setSelectedUser((prev) => ({ ...prev, [field]: value }));
  };


  /* Delete */
  const handleDelete = async (idUser) => {
    console.log('ID User yang akan dihapus:', idUser);

    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      cancelButtonText: "Cancel",
      confirmButtonText: "Delete!",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://103.150.197.185:10052/user/delete?idUser=${idUser}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
          });
          console.log('Respons dari server:', response);

          if (response.status === 200) {
            setUserdata(userdata.filter((user) => user.idUser !== idUser));
            Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
            window.location.reload();
          } else {
            Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus data.", "error");
          }
        } catch (err) {
          console.error(err);
          Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus data.", "error");
        }
      }
    });
  };

  /* pagination */
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const paginatedData = Array.isArray(userdata) ? userdata.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : [];

  return (
    <Box sx={{ padding: 3, marginTop: "50px", minHeight: "100vh" }}>

      <Accordion sx={{ backgroundColor: "#0a32b8", color: "white" }}>
        <AccordionSummary >
          <Typography variant="h8"> Daftar dan Pengaturan User </Typography>
        </AccordionSummary>
      </Accordion>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>

        <Box className="add-user-container">
          <IconButton onClick={handleAddOpen} className="add-user-button">
            <Typography className="add-user-text"> Add User </Typography>
            <Add className="add-user-icon" />
          </IconButton>
        </Box>

        <Box className="search-bar-container">
          <TextField variant="outlined" placeholder="Cari sesuatu...hmmm" value={searchValue} className="search-input" onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={(e) => { if (e.key === "Enter") { handleSearch(); } }}
            InputProps={{
              startAdornment: (
                <Box className="search-input-adornment">
                  <Search />
                </Box>
              ),
              disableUnderline: true,
            }}
          />
        </Box>

      </Box>

      <TableContainer component={Paper} className="table-container">
        <Table size="small">
          <TableHead>
            <TableRow className="table-head-row">
              <TableCell className="table-cell-head"> No  </TableCell>
              <TableCell className="table-cell-head"> NAMA  </TableCell>
              <TableCell className="table-cell-head"> USERNAME  </TableCell>
              <TableCell className="table-cell-head"> EMAIL   </TableCell>
              <TableCell className="table-cell-head"> ASAL SEKOLAH  </TableCell>
              <TableCell className="table-cell-head"> STATUS </TableCell>
              <TableCell className="table-cell-head"> ACTION </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((user, index) => (
                <TableRow key={index}>
                  <TableCell className="table-cell-body">
                    {index + 1 + page * rowsPerPage}
                  </TableCell>
                  <TableCell className="table-cell-body">{user.namaLengkap}</TableCell>
                  <TableCell className="table-cell-body">{user.userName}</TableCell>
                  <TableCell className="table-cell-body">{user.email}</TableCell>
                  <TableCell className="table-cell-body">{user.asalSekolah}</TableCell>
                  <TableCell className={`table-cell-body ${user.isActive ? 'status-active' : 'status-inactive'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </TableCell>
                  <TableCell className="action-cell">
                    <IconButton color="primary" onClick={() => handleEditOpen(user)}> <Edit /> </IconButton>
                    <IconButton onClick={() => handleDelete(user.idUser)} className="delete-button">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" className="no-data">
                  Tidak ada data untuk ditampilkan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagnation  */}
      <Box className="pagination-container">
        <p></p>
        <Pagination
          count={Math.ceil(userdata.length / rowsPerPage)}
          page={page + 1}
          onChange={(event, value) => setPage(value - 1)}
          siblingCount={1}
          sx={{
            "& .MuiPaginationItem-root": { color: "#757575", },
            "& .MuiPaginationItem-root.Mui-selected": { color: "#ffffff", backgroundColor: "#757575", },
            "& .MuiPaginationItem-root:hover": { backgroundColor: "#e0e0e0", }
          }}
        />
        <p></p>
      </Box>

      {/* Modal untuk Tambah User */}
      <Modal open={addOpen} onClose={handleAddClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2" mb={2}> Tambah User Baru </Typography>
          <TextField
            fullWidth
            label="Nama Lengkap"
            value={newUser.namaLengkap}
            onChange={(e) => handleNewChange("namaLengkap", e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Asal Sekolah"
            value={newUser.asalSekolah}
            onChange={(e) => handleNewChange("asalSekolah", e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="User Name"
            value={newUser.userName}  // Pastikan konsisten penamaannya
            onChange={(e) => handleNewChange("userName", e.target.value)}  // Penyesuaian properti
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            value={newUser.email}
            onChange={(e) => handleNewChange("email", e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            value={newUser.password}
            onChange={(e) => handleNewChange("password", e.target.value)}
            margin="normal"
          />

          <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
            <Button variant="contained" color="secondary" onClick={handleAddClose}> Cancel </Button>
            <Button variant="contained" color="primary" onClick={handleAddSubmit}> Save </Button>
          </Box>
        </Box>
      </Modal>


      {/* Modal untuk Edit User */}
      <Modal open={editOpen} onClose={handleEditClose}>
        <Box sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
        >
          <Typography variant="h6" component="h2" mb={2}> Edit User </Typography>
          {selectedUser && (
            <>
              <TextField
                fullWidth
                label="Username"
                value={selectedUser.userName}
                onChange={(e) => handleEditChange("userName", e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Nama Lengkap"
                value={selectedUser.namaLengkap}
                onChange={(e) => handleEditChange("namaLengkap", e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                value={selectedUser.email}
                onChange={(e) => handleEditChange("email", e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Asal Sekolah"
                value={selectedUser.asalSekolah}
                onChange={(e) => handleEditChange("asalSekolah", e.target.value)}
                margin="normal"
              />
              {/* hidupin klo mau update status */}
              <Typography variant="body2" margin="normal">
                <Box display="flex" justifyContent="space-between">

                  <Button
                    variant="contained"
                    color="success"
                    disabled={selectedUser?.isActive}
                    onClick={() => toggleUserStatus(true)}
                  >
                    Activate
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    disabled={!selectedUser?.isActive}
                    onClick={() => toggleUserStatus(false)}
                  >
                    Deactivate
                  </Button>
                </Box>
              </Typography>


              <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
                <Button variant="contained" color="secondary" onClick={handleEditClose}> Cancel </Button>
                <Button variant="contained" color="primary" onClick={handleEditSubmit}> Save</Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>

    </Box>
  );
};

export default PengaturanUser;
