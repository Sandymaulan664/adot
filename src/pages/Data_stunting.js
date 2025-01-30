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
} from "@mui/material";
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

  return (
    <Box sx={{ padding: 4 }}>
      {/* Judul Halaman */}
      <Typography variant="h4" gutterBottom>
        Data Murid Terindikasi Stunting
      </Typography>

      {/* Input Parameter */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        {/* Select Tahun Ajaran */}
        <FormControl fullWidth>
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
        <FormControl fullWidth>
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

      {/* Table Data Murid */}
      {dataMurid.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Nama</TableCell>
                <TableCell>Kelas</TableCell>
                <TableCell>Jenis Kelamin</TableCell>
                <TableCell>Tempat Tanggal Lahir</TableCell>
                <TableCell>Umur</TableCell>
                <TableCell>Tinggi Badan</TableCell>
                <TableCell>Berat Badan</TableCell>
                <TableCell>Tahun Ajaran</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataMurid.map((rekapmurid, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{rekapmurid.namaMurid}</TableCell>
                  <TableCell>{rekapmurid.kelas}</TableCell>
                  <TableCell>{rekapmurid.jenisKelamin}</TableCell>
                  <TableCell>{rekapmurid.tempatTanggalLahir}</TableCell>
                  <TableCell>{rekapmurid.umur}</TableCell>
                  <TableCell>{rekapmurid.tinggiBadan}</TableCell>
                  <TableCell>{rekapmurid.beratBadan}</TableCell>
                  <TableCell>{rekapmurid.tahunAjaran}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pesan jika data kosong */}
      {dataMurid.length === 0 && !loading && !error && (
        <Typography sx={{ marginTop: 4 }}>
          Data murid tidak ditemukan. Silakan pilih parameter.
        </Typography>
      )}
    </Box>
  );
};

export default DataMuridStunting;
