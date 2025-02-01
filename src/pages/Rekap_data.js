import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import '../assets/css/User_s.css';
import axios from 'axios';
import Kmeans from "../service/Kmeans";
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
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Grid,
  Accordion,
  AccordionSummary
} from "@mui/material";
// date picker
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
//dayjs
import dayjs from "dayjs";
/* icon */
import {
  Search,
  Add,
  Edit,
  Delete,
} from "@mui/icons-material";

const RekapData = () => {
  const [datamurid, setDatamurid] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState(null);
  const [tahunAjaran, setTahunAjaran] = useState(""); // State untuk tahun ajaran
  const [kelas, setKelas] = useState(""); // State untuk kelas
  // Contoh daftar kelas dan tahun ajaran
  const kelasOptions = ["1", "2", "3", "4", "5", "6"];
  const tahunAjaranOptions = ["2021/2022", "2022/2023", "2023/2024"];
  const jenisKelaminOptions = ["L", "P"]

  // Fetch username from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem("data");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        const userData = parsedData[0];
        const namaLengkap = userData?.attributes?.user_name;
        setUsername(namaLengkap || "User");
      } catch (error) {
        console.error("Failed to parse localStorage data:", error);
        setUsername("User");
      }
    }
  }, []);


  const fetchData = async () => {
    try {
      const response = await axios.get("http://103.150.197.185:10050/stunting/getDataMurid", {
        params: { kelas, tahunAjaran }
      });
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
    agama: "",
    alamat: "",
    beratBadan: null,
    createdBy: "",
    jenisKelamin: "",
    kelas: null,
    namaMurid: "",
    tahunAjaran: "",
    tanggalLahir: null,
    tempatLahir: "",
    tinggiBadan: null,
    umur: null
  });
  const handleAddOpen = () => {
    setNewUser({
      agama: "",
      alamat: "",
      beratBadan: null,
      createdBy: username,
      jenisKelamin: "",
      kelas: null,
      namaMurid: "",
      tahunAjaran: "",
      tanggalLahir: "",
      tempatLahir: "",
      tinggiBadan: null,
      umur: null
    });
    setAddOpen(true);
  };
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
      }).then(async (result) => {
        if (result.isConfirmed) {
          console.log(newUser)
          const response = await Kmeans.post('/stunting/insertDataMurid', newUser);
          if (response.status === 200) {
            Swal.fire("Berhasil!", response.message, response.tipsStunting);
            window.location.reload();
          } else {
            Swal.fire("Gagal!", "Terjadi kesalahan saat menyimpan data.", "error");
          }
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
      }).then(async (result) => {
        if (result.isConfirmed) {
          const updatedData = {
            agama: selectedUser.agama,
            alamat: selectedUser.alamat,
            beratBadan: selectedUser.beratBadan,
            lastModifiedBy: username,
            jenisKelamin: selectedUser.jenisKelamin,
            kelas: selectedUser.kelas,
            namaMurid: selectedUser.namaMurid,
            tahunAjaran: selectedUser.tahunAjaran,
            tanggalLahir: selectedUser.tanggalLahir,
            tempatLahir: selectedUser.tempatLahir,
            tinggiBadan: selectedUser.tinggiBadan,
            umur: selectedUser.umur,
            idMurid: selectedUser.idMurid
          };

          console.log(updatedData)

          const response = await Kmeans.post('/stunting/updateDataMurid', updatedData);
          if (response.status === 200) {
            Swal.fire("Berhasil!", response.message, response.tipsStunting);
            window.location.reload();
          } else {
            Swal.fire("Gagal!", "Terjadi kesalahan saat menyimpan data.", "error");
          }
          Swal.fire("Berhasil!", "Data berhasil disimpan.", "success");
        }
      });
    }, 300);
  };
  const handleEditChange = (field, value) => {
    setSelectedUser((prev) => ({ ...prev, [field]: value }));
  };


  /* Delete */
  const handleDelete = async (idMurid) => {
    console.log('ID User yang akan dihapus:', idMurid);

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
          const response = await Kmeans.post(`/stunting/deleteDataMurid?idMurid=${idMurid}`);

          console.log('Respons dari server:', response);

          if (response.status === 200) {
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
  const paginatedData = datamurid.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (

    <Box sx={{ padding: 1, marginTop: "50px", minHeight: "100vh" }}>

      <Accordion sx={{ backgroundColor: "#0a32b8", color: "white" }}>
        <AccordionSummary >
          <Typography variant="h8"> Rekap Data Murid</Typography>
        </AccordionSummary>
      </Accordion>

      <Box sx={{ display: "flex", gap: 2, alignItems: "center", marginTop: 2 }}>
        {/* Select Kelas */}
        <Box className="add-user-container" >
          <IconButton onClick={handleAddOpen} className="add-user-button" marginTop={2}>
            <Typography className="add-user-text"> Tambah Murid </Typography>
            <Add className="add-user-icon" />
          </IconButton>
        </Box>

        <Box className="search-bar-container" >
          <TextField marginTop={2} variant="outlined" placeholder="Cari sesuatu...hmmm" value={searchValue} className="search-input" onChange={(e) => setSearchValue(e.target.value)}
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

        <FormControl sx={{ minWidth: 150 }} marginTop={2} variant="outlined" size="small">
          <InputLabel shrink={true}>Kelas</InputLabel>
          <Select
            value={kelas}
            onChange={(e) => setKelas(e.target.value)}
          >
            {kelasOptions.map((option, index) => (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Select Tahun Ajaran */}
        <FormControl sx={{ minWidth: 150 }} marginTop={2} variant="outlined" size="small">
          <InputLabel shrink={true}>Tahun Ajaran</InputLabel>
          <Select value={tahunAjaran} onChange={(e) => setTahunAjaran(e.target.value)}>
            {tahunAjaranOptions.map((option, index) => (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* Tombol Cari */}
        <Button
          variant="contained"
          onClick={fetchData}
          disabled={loading}
          marginTop={2}
        >
          {loading ? "Memuat..." : "Cari"}
        </Button>

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
                  <TableCell className="action-cell">
                    <IconButton color="primary" onClick={() => handleEditOpen(murid)}> <Edit /> </IconButton>
                    <IconButton onClick={() => handleDelete(murid.idMurid)} className="delete-button">
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
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Modal open={addOpen} onClose={handleAddClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              maxWidth: 600,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" component="h2" mb={2}>
              Tambah Murid Baru
            </Typography>

            {/* Grid Container untuk membagi dua kolom */}
            <Grid container spacing={2}>
              {/* Kolom Kiri */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nama Lengkap"
                  value={newUser.namaMurid}
                  onChange={(e) => handleNewChange("namaMurid", e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Agama"
                  value={newUser.agama}
                  onChange={(e) => handleNewChange("agama", e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Alamat"
                  value={newUser.alamat}
                  onChange={(e) => handleNewChange("alamat", e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Tempat Lahir"
                  value={newUser.tempatLahir}
                  onChange={(e) => handleNewChange("tempatLahir", e.target.value)}
                  margin="normal"
                />
              </Grid>

              {/* Kolom Kanan */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Umur"
                  value={newUser.umur}
                  onChange={(e) => handleNewChange("umur", e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Tinggi Badan"
                  value={newUser.tinggiBadan}
                  onChange={(e) => handleNewChange("tinggiBadan", e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Berat Badan"
                  value={newUser.beratBadan}
                  onChange={(e) => handleNewChange("beratBadan", e.target.value)}
                  margin="normal"
                />

                <DatePicker
                  label="Tanggal Lahir"
                  value={newUser.tanggalLahir ? dayjs(newUser.tanggalLahir) : null}  // Ensure it's a Day.js object
                  onChange={(newValue) => {
                    handleNewChange("tanggalLahir", newValue ? dayjs(newValue).format("YYYY-MM-DD") : "");
                  }}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
            </Grid>

            {/* Kolom Kelas dan Tahun Ajaran menggunakan FormControl */}
            <Grid container spacing={2} mt={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel shrink={true}>Kelas</InputLabel>
                  <Select
                    value={newUser.kelas}
                    onChange={(e) => handleNewChange("kelas", e.target.value)}
                  >
                    {kelasOptions.map((option, index) => (
                      <MenuItem key={index} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel shrink={true}>Tahun Ajaran</InputLabel>
                  <Select
                    value={newUser.tahunAjaran}
                    onChange={(e) => handleNewChange("tahunAjaran", e.target.value)}
                  >
                    {tahunAjaranOptions.map((option, index) => (
                      <MenuItem key={index} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel shrink={true}>Jenis Kelamin</InputLabel>
                  <Select
                    value={newUser.jenisKelamin}
                    onChange={(e) => handleNewChange("jenisKelamin", e.target.value)}
                  >
                    {jenisKelaminOptions.map((option, index) => (
                      <MenuItem key={index} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Tombol Aksi */}
            <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
              <Button variant="contained" color="secondary" onClick={handleAddClose}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" onClick={handleAddSubmit}>
                Save
              </Button>
            </Box>
          </Box>
        </Modal >
      </LocalizationProvider>


      {/* Modal untuk Edit User */}
      {selectedUser && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Modal open={editOpen} onClose={handleEditClose}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "90%",
                maxWidth: 600,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" component="h2" mb={2}>
                Edit Data Murid
              </Typography>

              {/* Grid Container untuk membagi dua kolom */}
              <Grid container spacing={2}>
                {/* Kolom Kiri */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nama Lengkap"
                    value={selectedUser.namaMurid}
                    onChange={(e) => handleEditChange("namaMurid", e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Agama"
                    value={selectedUser.agama}
                    onChange={(e) => handleEditChange("agama", e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Alamat"
                    value={selectedUser.alamat}
                    onChange={(e) => handleEditChange("alamat", e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Tempat Lahir"
                    value={selectedUser.tempatLahir}
                    onChange={(e) => handleEditChange("tempatLahir", e.target.value)}
                    margin="normal"
                  />
                </Grid>

                {/* Kolom Kanan */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Umur"
                    value={selectedUser.umur}
                    onChange={(e) => handleEditChange("umur", e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Tinggi Badan"
                    value={selectedUser.tinggiBadan}
                    onChange={(e) => handleEditChange("tinggiBadan", e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Berat Badan"
                    value={selectedUser.beratBadan}
                    onChange={(e) => handleEditChange("beratBadan", e.target.value)}
                    margin="normal"
                  />

                  <DatePicker
                    label="Tanggal Lahir"
                    value={selectedUser.tanggalLahir ? dayjs(selectedUser.tanggalLahir) : null}  // Ensure it's a Day.js object
                    onChange={(newValue) => {
                      handleEditChange("tanggalLahir", newValue ? dayjs(newValue).format("YYYY-MM-DD") : "");
                    }}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
              </Grid>

              {/* Kolom Kelas dan Tahun Ajaran menggunakan FormControl */}
              <Grid container spacing={2} mt={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel shrink={true}>Kelas</InputLabel>
                    <Select
                      value={selectedUser.kelas}
                      onChange={(e) => handleEditChange("kelas", e.target.value)}
                    >
                      {kelasOptions.map((option, index) => (
                        <MenuItem key={index} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel shrink={true}>Tahun Ajaran</InputLabel>
                    <Select
                      value={selectedUser.tahunAjaran}
                      onChange={(e) => handleEditChange("tahunAjaran", e.target.value)}
                    >
                      {tahunAjaranOptions.map((option, index) => (
                        <MenuItem key={index} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel shrink={true}>Jenis Kelamin</InputLabel>
                    <Select
                      value={selectedUser.jenisKelamin}
                      onChange={(e) => handleEditChange("jenisKelamin", e.target.value)}
                    >
                      {jenisKelaminOptions.map((option, index) => (
                        <MenuItem key={index} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Tombol Aksi */}
              <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
                <Button variant="contained" color="secondary" onClick={handleEditClose}>
                  Cancel
                </Button>
                <Button variant="contained" color="primary" onClick={handleEditSubmit}>
                  Save
                </Button>
              </Box>
            </Box>
          </Modal >
        </LocalizationProvider>
      )}

    </Box >
  );
};

export default RekapData;
