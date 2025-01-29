import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import '../assets/css/User_s.css';
import axios from 'axios';
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

const Data_stunting = () => {
  const [datamurid, setDatamurid] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://103.150.197.185:10050/stunting/kmeansData");
      console.log("Data yang diterima:", response.data);
      setDatamurid(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
          setDatamurid([...datamurid, { ...newUser, id: datamurid.length + 1, isActive: true }]);
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
    const filteredData = datamurid.filter(
      (murid) =>
        murid.namaLengkap.toLowerCase().includes(searchValue.toLowerCase()) ||
        murid.email.toLowerCase().includes(searchValue.toLowerCase()) ||
        murid.asalSekolah.toLowerCase().includes(searchValue.toLowerCase())
    );
    setDatamurid(filteredData);
  };

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
          const updatedData = datamurid.map((user) =>
            user.id === selectedUser.id ? { ...selectedUser } : user
          );
          setDatamurid(updatedData);
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
        setDatamurid(datamurid.filter((user) => user.id !== userId));
        Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
      }
    });
  };



  /* pagination */
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const paginatedData = datamurid.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ padding: 5, marginTop:"50px", minHeight: "100vh" }}>

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
              <TableCell className="table-cell-head"> Nama  </TableCell>
              <TableCell className="table-cell-head"> Jeniskelamin  </TableCell>
              <TableCell className="table-cell-head"> Tempat lahir  </TableCell>
              <TableCell className="table-cell-head"> Tanggal Lahir   </TableCell>
              <TableCell className="table-cell-head"> Agama  </TableCell>
              <TableCell className="table-cell-head"> Alamat  </TableCell>
              <TableCell className="table-cell-head"> Umur  </TableCell>
              <TableCell className="table-cell-head"> Tinggi Badan  </TableCell>
              <TableCell className="table-cell-head"> Berat Badan  </TableCell>
              <TableCell className="table-cell-head"> Tahun   Ajaran  </TableCell>
              <TableCell className="table-cell-head"> Kelas  </TableCell>
              <TableCell className="table-cell-head"> Status </TableCell>
              <TableCell className="table-cell-head"> Action </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((murid, index) => (
                <TableRow key={index}>
                  <TableCell className="table-cell-body">
                    {index + 1 + page * rowsPerPage}
                  </TableCell>
                  <TableCell className="table-cell-body">{murid.namaMurid}</TableCell>
                  <TableCell className="table-cell-body">{murid.jenisKelamin}</TableCell>
                  <TableCell className="table-cell-body">{murid.tempatLahir}</TableCell>
                  <TableCell className="table-cell-body">{murid.tanggalLahir}</TableCell>
                  <TableCell className="table-cell-body">{murid.agama}</TableCell>
                  <TableCell className="table-cell-body">{murid.alamat}</TableCell>
                  <TableCell className="table-cell-body">{murid.umur}</TableCell>
                  <TableCell className="table-cell-body">{murid.tinggiBadan}</TableCell>
                  <TableCell className="table-cell-body">{murid.beratBadan}</TableCell>
                  <TableCell className="table-cell-body">{murid.tahunAjaran}</TableCell>
                  <TableCell className="table-cell-body">{murid.kelas}</TableCell>
                  <TableCell className={`table-cell-body ${murid.isActive ? 'status-active' : 'status-inactive'}`}>
                    {murid.isActive ? 'Active' : 'Inactive'}
                  </TableCell>
                  <TableCell className="action-cell">
                    <IconButton color="primary" onClick={() => handleEditOpen(murid)}> <Edit /> </IconButton>
                    <IconButton onClick={() => handleDelete(murid.id)} className="delete-button">
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
          count={Math.ceil(datamurid.length / rowsPerPage)}
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

export default Data_stunting;
