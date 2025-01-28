import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import '../assets/css/User_s.css';
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
} from "@mui/material";

/* icon */
import {
  Search,
  Add,
  Edit,
  Delete,
} from "@mui/icons-material";

const RekapData = () => {
  /* Dummy data user */
  const generateDummyData = () => {
    const dummyData = [];
    for (let i = 1; i <= 100; i++) {
      dummyData.push({
        id: i,
        userName: `susu${i}`,
        namaLengkap: `sehat ${i}`,
        email: `enak${i}@kenyal.com`,
        asalSekolah: `sempak ${i}`,
        isActive: i % 2 === 0,
      });
    } return dummyData;
  };
  const [userdata, setUserdata] = useState(generateDummyData());


  /* Add user */
  const [addOpen, setAddOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    namaLengkap: "",
    asalSekolah: "",
    email: "",
  });
  const handleAddOpen = () => { setNewUser({ namaLengkap: "", asalSekolah: "", email: "" }); setAddOpen(true); };
  const handleAddClose = () => { setAddOpen(false); };
  const handleAddSubmit = () => {
    handleAddClose();
    setTimeout(() => {
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
      }).then((result) => {
        if (result.isConfirmed) {
          setUserdata([...userdata, { ...newUser, id: userdata.length + 1, isActive: true }]);
          Swal.fire("Berhasil!", "Data berhasil disimpan.", "success");
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
    const filteredData = generateDummyData().filter(
      (user) =>
        user.userName.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.namaLengkap.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.email.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.asalSekolah.toLowerCase().includes(searchValue.toLowerCase())
    );
    setUserdata(filteredData);
  };
  useEffect(() => { if (!searchValue) { setUserdata(generateDummyData()); } }, [searchValue]);


  /* Edit */
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const handleEditOpen = (user) => { setSelectedUser(user); setEditOpen(true); };
  const handleEditClose = () => { setSelectedUser(null); setEditOpen(false); };
  const handleEditSubmit = () => {
    handleEditClose();
    setTimeout(() => {
      Swal.fire({
        title: "Konfirmasi Simpan Data",
        text: "Apakah Anda yakin ingin menyimpan perubahan data ini?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Save",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          const updatedData = userdata.map((user) =>
            user.id === selectedUser.id ? { ...selectedUser } : user
          );
          setUserdata(updatedData);
          Swal.fire("Berhasil!", "Data berhasil diperbarui.", "success");
        }
      });
    }, 300);
  };
  const handleEditChange = (field, value) => {
    setSelectedUser((prev) => ({ ...prev, [field]: value }));
  };


  /* Delete */
  const handleDelete = (userId) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      cancelButtonText: "Cancel",
      confirmButtonText: "Delete!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        setUserdata(userdata.filter((user) => user.id !== userId));
        Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
      }
    });
  };



  /* pagination */
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const paginatedData = userdata.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ padding: 2 }}>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", }}>

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
                    <IconButton onClick={() => handleDelete(user.id)} className="delete-button">
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
            label="Email"
            value={newUser.email}
            onChange={(e) => handleNewChange("email", e.target.value)}
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

export default RekapData;
