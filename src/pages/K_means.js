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
  Accordion,
  AccordionSummary
} from "@mui/material";
import Kmeans from "../service/Kmeans"; // Axios instance with base URL

const GrafikKmeans = () => {
  const [kelas, setKelas] = useState(""); // State untuk kelas
  const [tahunAjaran, setTahunAjaran] = useState(""); // State untuk tahun ajaran
  const [htmlResponse, setHtmlResponse] = useState(""); // State untuk menyimpan response HTML
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
      const response = await Kmeans.get("/stunting/kmeansGraphProduce", {
        params: { kelas, tahunAjaran },
        responseType: "text", // Pastikan response diambil dalam bentuk text (HTML)
      });
      setHtmlResponse(response.data); // Simpan HTML dari API
    } catch (err) {
      console.error("Error fetching data murid:", err);
      setError("Gagal mengambil data murid. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const downloadDataGraphic = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await Kmeans.get("/stunting/kmeansGraph", {
        params: { kelas, tahunAjaran },
        responseType: "blob", // Mengambil response sebagai file (binary)
      });

      // Buat URL dari Blob untuk mengunduh file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Set nama file yang ingin diunduh (opsional, tergantung header Content-Disposition dari API)
      link.setAttribute("download", "kmeans_graphic.png");

      // Tambahkan link ke DOM dan trigger download
      document.body.appendChild(link);
      link.click();

      // Hapus link setelah digunakan
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error downloading file:", err);
      setError("Gagal mengunduh data grafik. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Box sx={{ padding: 3, marginTop: "50px", minHeight: "100vh" }}>
      {/* Judul Halaman */}
      <Accordion sx={{ backgroundColor: "#0a32b8", color: "white" }}>
        <AccordionSummary >
          <Typography variant="h8"> Grafik K-Means </Typography>
        </AccordionSummary>
      </Accordion>

      {/* Input Parameter */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          marginTop: 2,
          marginBottom: 4,
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

        {/* Tombol Download */}
        <Button
          variant="contained"
          onClick={downloadDataGraphic}
          disabled={loading}
        >
          {loading ? "Memuat..." : "DOWNLOAD"}
        </Button>

      </Box>

      {/* Error Message */}
      {error && (
        <Typography color="error" sx={{ marginBottom: 2 }}>
          {error}
        </Typography>
      )}

      {/* Menampilkan HTML dari API */}
      {htmlResponse && (
        <Box
          sx={{
            marginTop: 4,
            padding: 2,
            border: "1px solid #ccc",
            borderRadius: 2,
            backgroundColor: "#f9f9f9",
            justifyContent: "center"
          }}
          dangerouslySetInnerHTML={{ __html: htmlResponse }}
        />
      )}
    </Box>
  );
};

export default GrafikKmeans;
