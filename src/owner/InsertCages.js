import {
    Box, CssBaseline, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Grid, Button, Avatar, Card, CardContent, Container, useTheme, styled, TextField, FormControl, InputLabel, Select, MenuItem, Alert, Snackbar
} from '@mui/material';
import {
    ChevronRight, Home, People, CalendarMonth, Pets, Menu as MenuIcon,
    Assessment as AssessmentIcon, Bathtub, ContentCut, Vaccines, LocalHospital, History, Menu, Logout, Close, Add, Save
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import React, { useState } from 'react';

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

// Menu items configuration
const menuItems = [
    { icon: <Home />, label: 'ພາບລວມຄລິນິກ', path: '/owner/dashboard' },
    { icon: <People />, label: 'ຂໍ້ມູນພະນັກງານ', path: '/owner/dataemployee' },
    { icon: <People />, label: 'ຂໍ້ມູນລູກຄ້າ', path: '/owner/datacustomer' },
    { icon: <CalendarMonth />, label: 'ຂໍ້ມູນການຈອງ', path: '/owner/databooking' },
    { icon: <Pets />, label: 'ຝາກສັດລ້ຽງ', path: '/owner/petboarding'},
    { icon: <Bathtub />, label: 'ອາບນ້ຳສັດລ້ຽງ', path: '/owner/bathpet'  },
    { icon: <ContentCut />, label: 'ຕັດຂົນສັດລ້ຽງ', path: '/owner/petbar' },
    { icon: <Vaccines />, label: 'ປິ່ນປົວສັດລ້ຽງ', path: '/owner/treatpet' },
    { icon: <AssessmentIcon />, label: 'ລາຍງານ', path: '/owner/report' },
    { icon: <AssessmentIcon />, label: 'ເພີ່ມກົງສັດລ້ຽງ', path: '/owner/InsertCages', active: true },
];

// Define the drawer width
const drawerWidth = 240;

const InsertCages = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    
    // Form states
    const [formData, setFormData] = useState({
        cageName: '',
        cageType: '',
        cageSize: '',
        description: ''
    });
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

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

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!formData.cageName || !formData.cageType || !formData.cageSize) {
            setSnackbarMessage('ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        // Here you would typically send the data to your API
        console.log('Cage data:', formData);
        
        setSnackbarMessage('ເພີ່ມກົງສັດລ້ຽງສຳເລັດແລ້ວ!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        
        // Reset form
        setFormData({
            cageName: '',
            cageType: '',
            cageSize: '',
            description: ''
        });
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

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

                {/* Mobile Drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            backgroundColor: theme.palette.primary.dark,
                            color: theme.palette.primary.contrastText,
                        },
                    }}
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
                <Container maxWidth="lg">
                    {/* Page Header */}
                    <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                            ເພີ່ມກົງສັດລ້ຽງ
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            ສ້າງກົງສັດລ້ຽງໃໝ່ສໍາລັບຄລິນິກຂອງທ່ານ
                        </Typography>
                    </Paper>

                    {/* Form Content */}
                    <Grid container spacing={3}>
                        {/* Main Form */}
                        <Grid item xs={12} lg={8}>
                            <Paper sx={{ p: 4, borderRadius: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                                    <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                                        <Add />
                                    </Avatar>
                                    <Typography variant="h6" fontWeight="bold">
                                        ຂໍ້ມູນກົງສັດລ້ຽງ
                                    </Typography>
                                </Box>

                                <form onSubmit={handleSubmit}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="ຊື່ກົງ"
                                                name="cageName"
                                                value={formData.cageName}
                                                onChange={handleInputChange}
                                                required
                                                variant="outlined"
                                                placeholder="ເຊັ່ນ: ກົງ A1"
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth required>
                                                <InputLabel>ຂະໜາດກົງ</InputLabel>
                                                <Select
                                                    name="cageSize"
                                                    value={formData.cageSize}
                                                    label="ຂະໜາດກົງ"
                                                    onChange={handleInputChange}
                                                >
                                                    <MenuItem value="ນ້ອຍ">ນ້ອຍ (ສໍາລັບສັດນ້ອຍ)</MenuItem>
                                                    <MenuItem value="ກາງ">ກາງ (ສໍາລັບສັດປານກາງ)</MenuItem>
                                                    <MenuItem value="ໃຫຍ່">ໃຫຍ່ (ສໍາລັບສັດໃຫຍ່)</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={4}
                                                label="ລາຍລະອຽດເພີ່ມເຕີມ"
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                variant="outlined"
                                                placeholder="ລາຍລະອຽດເພີ່ມເຕີມກ່ຽວກັບກົງ..."
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Divider sx={{ my: 2 }} />
                                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                                <Button
                                                    variant="outlined"
                                                    onClick={() => setFormData({
                                                        cageName: '',
                                                        cageType: '',
                                                        cageSize: '',
                                                        description: ''
                                                    })}
                                                >
                                                    ຍົກເລີກ
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    startIcon={<Save />}
                                                    sx={{ minWidth: 120 }}
                                                >
                                                    ບັນທຶກ
                                                </Button>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Paper>
                        </Grid>

                        {/* Side Information */}
                        <Grid item xs={12} lg={4}>
                            <Paper sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                                    ຂໍ້ມູນສຳຄັນ
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                                    ກົງທີ່ສ້າງແລ້ວຈະສາມາດນຳໃຊ້ສຳລັບການຈອງ ແລະ ຝາກສັດລ້ຽງໄດ້ທັນທີ
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Success/Error Snackbar */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                    elevation={6}
                    variant="filled"
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default InsertCages;