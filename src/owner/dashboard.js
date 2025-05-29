import {
    Box, CssBaseline, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Grid, Button, Avatar, Card, CardContent, LinearProgress, Chip, Stack, Container, useTheme, styled
} from '@mui/material';
import {
    ChevronRight, Home, People, CalendarMonth, Pets, Bathtub, ContentCut, Vaccines,Assessment as AssessmentIcon,AddBoxRounded, LocalHospital, History, Menu, Logout, TrendingUp, CheckCircle, AttachMoney, Notifications, Close
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getNormalReport, getallcate_servicereport } from '../services/report.service';
import React, { useState, useEffect } from 'react';

// Create a custom styled container for the logo
const LogoContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 2),
    height: 64,
    backgroundColor: theme.palette.primary.dark
}));

const admin_name = decodeURIComponent(Cookies.get("name_owner") || "");
const cus_id = Cookies.get("cus_ida");
const accessToken = Cookies.get("accessTokena");

// Mock data from the original code
const menuItems = [
    { icon: <Home />, label: 'ພາບລວມຄລິນິກ', path: '/owner/dashboard', active: true },
    { icon: <People />, label: 'ຂໍ້ມູນພະນັກງານ', path: '/owner/dataemployee' },
    { icon: <People />, label: 'ຂໍ້ມູນລູກຄ້າ', path: '/owner/datacustomer' },
    { icon: <CalendarMonth />, label: 'ຂໍ້ມູນການຈອງ', path: '/owner/databooking' },
    { icon: <Pets />, label: 'ຝາກສັດລ້ຽງ', path: '/owner/petboarding'},
    { icon: <Bathtub />, label: 'ອາບນ້ຳສັດລ້ຽງ', path: '/owner/bathpet'  },
    { icon: <ContentCut />, label: 'ຕັດຂົນສັດລ້ຽງ', path: '/owner/petbar' },
    { icon: <Vaccines />, label: 'ປິ່ນປົວສັດລ້ຽງ', path: '/owner/treatpet' },
    { icon: <AssessmentIcon />, label: 'ລາຍງານ', path: '/owner/report' },
    { icon: <AddBoxRounded />, label: 'ເພີ່ມກົງສັດລ້ຽງ', path: '/owner/insertCages' },
];

// Define the drawer width
const drawerWidth = 240;

const Dashboard = () => {
    const theme = useTheme();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [reportData, setReportData] = useState(null);
    const [categoryData, setCategoryData] = useState([]); // use [] not null


    // Count the number of 'ໝາ' and 'ແມວ' pets
    const pets = reportData?.report?.report_pet ?? [];

    // Calculate dog and cat counts
    const dogCount = pets.filter(pet => pet.pet_type === 'ໝາ').length;
    const catCount = pets.filter(pet => pet.pet_type === 'ແມວ').length;

    // Calculate percentages
    const totalPets = pets.length;
    const dogPercentage = totalPets ? (dogCount / totalPets) * 100 : 0;
    const catPercentage = totalPets ? (catCount / totalPets) * 100 : 0;


    useEffect(() => {
        const getNormalReportapi = async () => {
            const response = await getNormalReport(accessToken);
            console.log(response);
            setReportData(response);
        };
        getNormalReportapi();
    }, []);

    useEffect(() => {
        const getallcate_servicereportapi = async () => {
            const response = await getallcate_servicereport(accessToken);
            console.log("response", response);
            if (response?.report) {
                const { cat_service, category_service } = response.report;

                const categoryWithCounts = cat_service.map((cat) => {
                    // Filter services that match current category ID
                    const services = category_service.filter(
                        (s) => s.cat_id === cat.cat_id
                    );

                    // Sum all bookings for this category
                    const totalBookings = services.reduce(
                        (sum, service) => sum + (service.tb_bookings?.length || 0),
                        0
                    );

                    const target = 12; // You can customize this
                    const progress = (totalBookings / target) * 100;

                    return {
                        name: cat.cat_name,
                        count: totalBookings,
                        target,
                        progress,
                    };
                });

                setCategoryData(categoryWithCounts);
            } else {
                setCategoryData([]); // fallback
            }

        };
        getallcate_servicereportapi();
    }, [accessToken]);

    // Toggle sidebar for desktop
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Toggle mobile drawer
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        Cookies.remove("name_admin");
        Cookies.remove("cus_ida");
        Cookies.remove("accessTokena");
        Cookies.remove("rolea");

        Cookies.remove("accessToken");
        Cookies.remove("cus_id");
        Cookies.remove("name");
        navigate('/');
        window.location.reload(); // Force reload
    };

    const navigate = useNavigate();


    // Create the drawer content component
    const drawerContent = (
        <>
            <LogoContainer>
                <Avatar sx={{ bgcolor: theme.palette.primary.contrastText, color: theme.palette.primary.main }}>
                    <Pets fontSize="small" />
                </Avatar>
                <Box ml={2}>
                    <Typography variant="subtitle1" color="white" fontWeight="bold">
                        DR. P
                    </Typography>
                    <Typography variant="caption" color={theme.palette.primary.contrastText}>
                        VETERINARY
                    </Typography>
                </Box>
                <IconButton
                    edge="end"
                    onClick={handleDrawerToggle}
                    sx={{
                        color: theme.palette.primary.contrastText,
                        marginLeft: 'auto',
                        display: { sm: 'none' }
                    }}
                >
                    <Close />
                </IconButton>
            </LogoContainer>
            <Divider />
            <List>
                {menuItems.map((item, index) => (
                    <ListItem key={index} disablePadding>
                        <ListItemButton
                            component="a"
                            href={item.path}
                            selected={item.active}
                            sx={{
                                borderRadius: 1,
                                my: 0.5,
                                mx: 1,
                                '&.Mui-selected': {
                                    backgroundColor: theme.palette.primary.main,
                                    color: theme.palette.primary.contrastText,
                                    '&:hover': {
                                        backgroundColor: theme.palette.primary.main,
                                    },
                                    '& .MuiListItemIcon-root': {
                                        color: theme.palette.primary.contrastText,
                                    },
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    color: item.active ? 'inherit' : theme.palette.primary.light,
                                    minWidth: 40
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.label} />
                            {item.active && <ChevronRight fontSize="small" />}
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            {/* App Bar */}
            <AppBar
                position="fixed"
                color="default"
                elevation={1}
                sx={{
                    width: { sm: `calc(100% - ${sidebarOpen ? drawerWidth : 0}px)` },
                    ml: { sm: `${sidebarOpen ? drawerWidth : 0}px` },
                    transition: theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <Menu />
                    </IconButton>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1, fontWeight: 'bold', color: theme.palette.primary.main }}
                    >
                        Owner: {admin_name}
                    </Typography>

                    <IconButton color="inherit">
                        <Notifications />
                    </IconButton>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Logout />}
                        onClick={handleLogout}
                        sx={{ ml: 1 }}
                    >
                        ອອກຈາກລະບົບ
                    </Button>

                </Toolbar>
            </AppBar>

            {/* Mobile Drawer */}
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                {/* Desktop Drawer */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            backgroundColor: theme.palette.primary.dark,
                            color: theme.palette.primary.contrastText,
                            borderRight: 'none',
                            transition: theme.transitions.create('width', {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.enteringScreen,
                            }),
                            ...(sidebarOpen ? {
                                width: drawerWidth,
                                overflowX: 'hidden',
                            } : {
                                width: 0,
                                overflow: 'hidden',
                            }),
                        },
                    }}
                    open={sidebarOpen}
                >
                    {drawerContent}
                </Drawer>
            </Box>

            {/* Main Content */}
            <Box component="main" sx={{
                flexGrow: 1,
                p: 3,
                width: { sm: `calc(100% - ${sidebarOpen ? drawerWidth : 0}px)` },
                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                mt: 8,
                backgroundColor: '#f5f5f5',
                minHeight: '100vh'
            }}>
                <Container maxWidth="xl">
                    {/* Page Header */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h4" fontWeight="bold" color="primary">ພາບລວມຄລິນິກ</Typography>
                    </Box>

                    {/* Main Content with Changed Layout - Moving Services to Right */}
                    <Grid container spacing={3}>
                        {/* Left Column - Dashboard Stats */}
                        <Grid item xs={12} md={8}>
                            {/* First Row - Stats */}
                            <Grid container spacing={3} sx={{ mb: 3 }}>
                                {/* Stat Card 1 - ລູກຄ້າທັງໝົດ */}
                                <Grid item xs={12} sm={6}>
                                    <Paper sx={{ p: 3, position: 'relative', overflow: 'hidden', borderRadius: 2 }}>
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                width: 120,
                                                height: 120,
                                                borderBottomLeftRadius: '100%',
                                                bgcolor: 'primary.light',
                                                opacity: 0.2,
                                            }}
                                        />
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box>
                                                <Typography variant="h6" color="text.secondary">ລູກຄ້າທັງໝົດ</Typography>
                                                <Typography variant="h3" fontWeight="bold" color="primary.dark" mt={2}>
                                                    {reportData?.report?.report_customer?.length ?? 0}
                                                </Typography>
                                            </Box>

                                            <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.dark', width: 56, height: 56 }}>
                                                <People sx={{ fontSize: 32 }} />
                                            </Avatar>
                                        </Box>
                                    </Paper>
                                </Grid>

                                {/* Stat Card 2 - ສັດລ້ຽງມື້ນີ້ */}
                                <Grid item xs={12} sm={6}>
                                    <Paper sx={{ p: 3, position: 'relative', overflow: 'hidden', borderRadius: 2 }}>
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                width: 120,
                                                height: 120,
                                                borderBottomLeftRadius: '100%',
                                                bgcolor: 'secondary.light',
                                                opacity: 0.2,
                                            }}
                                        />
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box>
                                                <Typography variant="h6" color="text.secondary">ສັດລ້ຽງທັງໝົດ</Typography>
                                                <Typography variant="h3" fontWeight="bold" color="secondary.dark" mt={2}>
                                                    {reportData?.report?.report_pet?.length ?? 0}
                                                </Typography>
                                            </Box>
                                            <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.dark', width: 56, height: 56 }}>
                                                <Pets sx={{ fontSize: 32 }} />
                                            </Avatar>
                                        </Box>
                                    </Paper>
                                </Grid>
                            </Grid>

                            {/* Second Row - Stats */}
                            <Grid container spacing={3} sx={{ mb: 3 }}>
                                {/* Stat Card 3 - ການຈອງທັງໝົດ */}
                                <Grid item xs={12} sm={6}>
                                    <Paper sx={{ p: 3, position: 'relative', overflow: 'hidden', borderRadius: 2 }}>
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                width: 120,
                                                height: 120,
                                                borderBottomLeftRadius: '100%',
                                                bgcolor: 'warning.light',
                                                opacity: 0.2,
                                            }}
                                        />
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box>
                                                <Typography variant="h6" color="text.secondary">ການຈອງທັງໝົດ</Typography>
                                                <Typography variant="h3" fontWeight="bold" color="warning.dark" mt={2}>
                                                    {reportData?.report?.report_book?.length ?? 0}
                                                </Typography>
                                            </Box>
                                            <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.dark', width: 56, height: 56 }}>
                                                <CalendarMonth sx={{ fontSize: 32 }} />
                                            </Avatar>
                                        </Box>
                                    </Paper>
                                </Grid>

                                {/* Stat Card 4 - ກົງສັດລ້ຽງທີ່ຍັງວ່າງ */}
                                <Grid item xs={12} sm={6}>
                                    <Paper sx={{ p: 3, position: 'relative', overflow: 'hidden', borderRadius: 2 }}>
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                width: 120,
                                                height: 120,
                                                borderBottomLeftRadius: '100%',
                                                bgcolor: 'success.light',
                                                opacity: 0.2,
                                            }}
                                        />
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box>
                                                <Typography variant="h6" color="text.secondary">ກົງສັດລ້ຽງທີ່ຖືກຈອງ</Typography>
                                                <Typography variant="h3" fontWeight="bold" color="success.dark" mt={2}>
                                                    {
                                                        `${reportData?.report?.report_roompet?.filter(room => room.status === "ບໍ່ວ່າງ")?.length ?? 0} / ${reportData?.report?.report_roompet?.length ?? 0}`
                                                    }
                                                </Typography>
                                            </Box>
                                            <Avatar sx={{ bgcolor: 'success.light', color: 'success.dark', width: 56, height: 56 }}>
                                                <Pets sx={{ fontSize: 32 }} />
                                            </Avatar>
                                        </Box>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* Right Column - Services and Pet Types */}
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h6" fontWeight="bold">ຈຳນວນບໍລິການແຕ່ລະປະເພດ</Typography>
                                    <Button href="/databooking" color="primary" size="small">ເບິ່ງທັງໝົດ</Button>
                                </Box>

                                <Stack spacing={3}>
                                    {categoryData.map((service, index) => (
                                        <Box key={index}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                <Typography variant="body2" fontWeight="medium">{service.name}</Typography>
                                                <Typography variant="body2" color="text.secondary">{service.count}/{service.target}</Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={service.progress}
                                                sx={{
                                                    height: 8,
                                                    borderRadius: 4,
                                                    bgcolor: 'grey.200',
                                                    '& .MuiLinearProgress-bar': {
                                                        borderRadius: 4,
                                                        bgcolor: index === 0 ? 'primary.main' :
                                                            index === 1 ? 'secondary.main' :
                                                                index === 2 ? 'warning.main' : 'success.main'
                                                    }
                                                }}
                                            />
                                        </Box>
                                    ))}
                                </Stack>
                            </Paper>
                        </Grid>

                        {/* Pet Types - Right Component */}
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                                <Typography variant="h6" fontWeight="bold" mb={3}>
                                    ປະເພດສັດລ້ຽງ
                                </Typography>

                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 240, position: 'relative' }}>
                                    {/* Donut Chart with conic-gradient */}
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            width: 160,
                                            height: 160,
                                            borderRadius: '50%',
                                            background: `conic-gradient(${theme.palette.primary.main} 0% ${dogPercentage}%, ${theme.palette.secondary.main} ${dogPercentage}% 100%)`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                width: '70%',
                                                height: '70%',
                                                borderRadius: '50%',
                                                backgroundColor: 'background.paper',
                                                zIndex: 1
                                            }
                                        }}
                                    />

                                    {/* Legend */}
                                    <Stack
                                        direction="row"
                                        spacing={2}
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            justifyContent: 'center',
                                            width: '100%'
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Box sx={{ width: 12, height: 12, borderRadius: 6, bgcolor: 'primary.main', mr: 1 }} />
                                            <Typography variant="caption" color="text.secondary">
                                                {dogCount} ໝາ ({dogPercentage.toFixed(1)}%)
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Box sx={{ width: 12, height: 12, borderRadius: 6, bgcolor: 'secondary.main', mr: 1 }} />
                                            <Typography variant="caption" color="text.secondary">
                                                {catCount} ແມວ ({catPercentage.toFixed(1)}%)
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box >
    );
};

export default Dashboard;