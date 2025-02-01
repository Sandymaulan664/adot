import React, { useState, useEffect } from "react";
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Pagination,
  Accordion,
  AccordionSummary
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import murid from "../service/Kmeans"; // Axios instance with base URL

const DataMuridStunting = () => {
  const [kelas, setKelas] = useState(""); // State untuk kelas
  const [tahunAjaran, setTahunAjaran] = useState(""); // State untuk tahun ajaran
  const [dataMurid, setDataMurid] = useState([]); // State untuk data murid
  const [loading, setLoading] = useState(false); // State untuk loading
  const [error, setError] = useState(""); // State untuk error

  // Contoh daftar kelas dan tahun ajaran
  const kelasOptions = ["1", "2", "3", "4", "5", "6"];
  const tahunAjaranOptions = ["2021/2022", "2022/2023", "2023/2024"];

  // Fungsi fetch data murid
  const fetchRekapDataMurid = async () => {

    setLoading(true);
    setError("");
    try {
      const response = await murid.get("/stunting/kmeansData", {
        params: { kelas, tahunAjaran },
      });
      setDataMurid(response.data.stunting); // Set data murid dari API
    } catch (err) {
      console.error("Error fetching data murid:", err);
      setError("Gagal mengambil data murid. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  /* pagination */
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const paginatedData = dataMurid.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ padding: 1, marginTop: "45px", minHeight: "100vh" }}>
      {/* Judul Halaman */}
      <Accordion sx={{margin: 2, backgroundColor: "#0a32b8", color: "white"}}>
        <AccordionSummary >
          <Typography variant="h8"> Data Murid Terindikasi Stunting</Typography>
        </AccordionSummary>
      </Accordion>
      {/* <Typography variant="h4" gutterBottom margin={2}>
        Data Murid Terindikasi Stunting
      </Typography> */}

      {/* Input Parameter */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          margin: 2,
          width: {
            xs: 800, // theme.breakpoints.up('xs')
            sm: 900, // theme.breakpoints.up('sm')
            md: 1000, // theme.breakpoints.up('md')
            lg: 1100, // theme.breakpoints.up('lg')
            xl: 1200, // theme.breakpoints.up('xl')
          }
        }}
      >
        {/* Select Tahun Ajaran */}
        <FormControl sx={{ minWidth: 150 }} marginTop={2} variant="outlined" size="small">
          <InputLabel>Tahun Ajaran</InputLabel>
          <Select
            value={tahunAjaran}
            onChange={(e) => setTahunAjaran(e.target.value)}
          >
            {tahunAjaranOptions.map((option, index) => (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Select Kelas */}
        <FormControl sx={{ minWidth: 150 }} marginTop={2} variant="outlined" size="small">
          <InputLabel>Kelas</InputLabel>
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

        {/* Tombol Cari */}
        <Button
          variant="contained"
          onClick={fetchRekapDataMurid}
          disabled={loading}
        >
          {loading ? "Memuat..." : "Cari"}
        </Button>
      </Box>

      {/* Error Message */}
      {error && (
        <Typography color="error" sx={{ marginBottom: 2 }}>
          {error}
        </Typography>
      )}
      <Box
        sx={{
          margin: 2,
          width: {
            xs: 800, // theme.breakpoints.up('xs')
            sm: 900, // theme.breakpoints.up('sm')
            md: 1000, // theme.breakpoints.up('md')
            lg: 1100, // theme.breakpoints.up('lg')
            xl: 1200, // theme.breakpoints.up('xl')
          }
        }}
      >
        {/* Table Data Murid */}
        <TableContainer component={Paper} style={{ width: '100%', margin: '0 auto' }}>
          <Table style={{ tableLayout: 'fixed', width: '100%' }}>
            <TableHead>
              <TableRow className="table-head-row">
                <TableCell className="table-cell-head">No</TableCell>
                <TableCell className="table-cell-head">Nama</TableCell>
                <TableCell className="table-cell-head">Kelas</TableCell>
                <TableCell className="table-cell-head">Jenis Kelamin</TableCell>
                <TableCell className="table-cell-head">Tempat Tanggal Lahir</TableCell>
                <TableCell className="table-cell-head">Umur</TableCell>
                <TableCell className="table-cell-head">Tinggi Badan</TableCell>
                <TableCell className="table-cell-head">Berat Badan</TableCell>
                <TableCell className="table-cell-head">Tahun Ajaran</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((dataMurid, index) => (
                  <TableRow key={index}>
                    <TableCell className="table-cell-body">{index + 1 + page * rowsPerPage}</TableCell>
                    <TableCell className="table-cell-body">{dataMurid.namaMurid}</TableCell>
                    <TableCell className="table-cell-body">{dataMurid.kelas}</TableCell>
                    <TableCell className="table-cell-body">{dataMurid.jenisKelamin}</TableCell>
                    <TableCell className="table-cell-body">{dataMurid.tempatTanggalLahir}</TableCell>
                    <TableCell className="table-cell-body">{dataMurid.umur}</TableCell>
                    <TableCell className="table-cell-body">{dataMurid.tinggiBadan}</TableCell>
                    <TableCell className="table-cell-body">{dataMurid.beratBadan}</TableCell>
                    <TableCell className="table-cell-body">{dataMurid.tahunAjaran}</TableCell>
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
            count={Math.ceil(dataMurid.length / rowsPerPage)}
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

        {/* Pesan jika data kosong
        {dataMurid.length === 0 && !loading && !error && (
          <Typography sx={{ marginTop: 4 }}>
            Data murid tidak ditemukan. Silakan pilih parameter.
          </Typography>
        )} */}
      </Box>
    </Box>
  );
};

export default DataMuridStunting;
