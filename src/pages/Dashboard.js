import React, { useEffect, useState } from "react";
import {
    Grid,
    Paper,
    Typography,
    Avatar,
    Box,
    CircularProgress,
    TextField,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import { BarChart } from '@mui/x-charts/BarChart';
import Kmeans from "../service/Kmeans";
import img from "../assets/image/apa itu stunting.png"

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [profiledata, setProfileData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tahunAjaran, setTahunAjaran] = useState("2021/2022");
    const [asalsekolah, setAsalSekolah] = useState("");
    const [namalengkap, setNamaLengkap] = useState("");
    const [email, setEmail] = useState("");

    const fetchDashboardData = async (tahunAjaran) => {
        try {
            setLoading(true);
            const response = await Kmeans.get("/stunting/getDataDashboard", {
                params: { tahunAjaran },
            });
            setDashboardData(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Gagal mengambil data dari server");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData(tahunAjaran);
    }, [tahunAjaran]);

    useEffect(() => {
        const storedData = localStorage.getItem("data");
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                const profiledata = parsedData[0];
                const asalSekolah = profiledata?.attributes?.user?.asalSekolah;
                const namaLengkap = profiledata?.attributes?.user?.namaLengkap;
                const email = profiledata?.attributes?.user?.email;
                setNamaLengkap(namaLengkap || "");
                setAsalSekolah(asalSekolah || "");
                setEmail(email || "user@example.com");
            } catch (error) {
                console.error("Failed to parse localStorage data:", error);
            }
        }
    }, []);

    const categories = ["Kelas 1", "Kelas 2", "Kelas 3", "Kelas 4", "Kelas 5", "Kelas 6"];

    const stuntingData = dashboardData
        ? [
            dashboardData.jumlahStuntingKelas1 || 0,
            dashboardData.jumlahStuntingKelas2 || 0,
            dashboardData.jumlahStuntingKelas3 || 0,
            dashboardData.jumlahStuntingKelas4 || 0,
            dashboardData.jumlahStuntingKelas5 || 0,
            dashboardData.jumlahStuntingKelas6 || 0,
        ]
        : [0, 0, 0, 0, 0, 0];

    const nonStuntingData = dashboardData
        ? [
            dashboardData.jumlahTidakStuntingKelas1 || 0,
            dashboardData.jumlahTidakStuntingKelas2 || 0,
            dashboardData.jumlahTidakStuntingKelas3 || 0,
            dashboardData.jumlahTidakStuntingKelas4 || 0,
            dashboardData.jumlahTidakStuntingKelas5 || 0,
            dashboardData.jumlahTidakStuntingKelas6 || 0,
        ]
        : [0, 0, 0, 0, 0, 0];

    const series = [
        { label: "Stunting", data: stuntingData },
        { label: "Tidak Stunting", data: nonStuntingData },
    ];

    const xAxis = [{
        scaleType: "band",
        data: categories,
        label: "Kelas",
    }];

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ textAlign: "center", marginTop: "50px" }}>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ padding: 3, textAlign: "center", borderRadius: "12px", backgroundColor: "#ffffff" }}>
                        <img
                            src={img}
                            alt="Informasi Stunting"
                            style={{ maxWidth: "100%", borderRadius: "12px", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}
                        />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ padding: 3, textAlign: "center", borderRadius: "12px", backgroundColor: "#ffffff" }}>
                        <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: "bold" }}>
                            Profil Pengguna
                        </Typography>
                        <Avatar sx={{ margin: "0 auto", width: 80, height: 80, marginBottom: 2, backgroundColor: "#3f51b5" }}>
                            {namalengkap?.charAt(0) || "U"}
                        </Avatar>
                        <Typography variant="h6">{namalengkap || ""}</Typography>
                        <Typography variant="h6">{asalsekolah || ""}</Typography>
                        <Typography variant="body2" color="textSecondary">
                            {email || "user@example.com"}
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ padding: 3, borderRadius: "12px", backgroundColor: "#ffffff", marginBottom: 3 }}>
                        <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: "bold", textAlign: "center" }}>
                            Grafik Kelas
                        </Typography>

                        {/* Selector Tahun Ajaran */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                marginBottom: 3,
                            }}
                        >
                            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                                <InputLabel id="tahun-ajaran-label">Tahun Ajaran</InputLabel>
                                <Select
                                    labelId="tahun-ajaran-label"
                                    value={tahunAjaran}
                                    onChange={(e) => setTahunAjaran(e.target.value)}
                                    label="Tahun Ajaran"
                                >
                                    <MenuItem value="2021/2022">2021/2022</MenuItem>
                                    <MenuItem value="2022/2023">2022/2023</MenuItem>
                                    <MenuItem value="2023/2024">2023/2024</MenuItem>
                                    <MenuItem value="2024/2025">2024/2025</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        {/* Data Detail Kelas */}
                        <Grid container spacing={2} sx={{ marginBottom: 3 }}>
                            {categories.map((kelas, index) => (
                                <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
                                    <Paper
                                        elevation={3}
                                        sx={{
                                            padding: 2,
                                            textAlign: "center",
                                            backgroundColor: "#3f51b5",
                                            borderRadius: "12px",
                                            color: "white",
                                            transition: "transform 0.2s",
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                            },
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: "bold", textTransform: "uppercase", marginBottom: 1 }}
                                        >
                                            {kelas}
                                        </Typography>
                                        <Typography variant="body1">
                                            Jumlah Murid: {stuntingData[index] + nonStuntingData[index]}
                                        </Typography>
                                        <Typography variant="body1">
                                            Jumlah Stunting: {stuntingData[index]}
                                        </Typography>
                                        <Typography variant="body1">
                                            Tidak Stunting: {nonStuntingData[index]}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Grafik */}
                        <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: "bold", textAlign: "center" }}>
                            Grafik Statistik Stunting per Kelas
                        </Typography>
                        <BarChart
                            series={series}
                            xAxis={xAxis}
                            height={400}
                            margin={{ top: 20, bottom: 50, left: 40, right: 10 }}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;