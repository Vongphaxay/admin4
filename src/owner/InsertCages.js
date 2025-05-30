import {
    Box, CssBaseline, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Grid, Button, Avatar, Card, CardContent, Container, useTheme, styled, TextField, FormControl, InputLabel, Select, MenuItem, Alert, Snackbar, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import {
    ChevronRight, Home, People, CalendarMonth, Pets, Menu as MenuIcon,
    Assessment as AssessmentIcon, Bathtub, ContentCut, Vaccines, LocalHospital, History, Menu, Logout, Close, Add, Save, Info, CheckCircle, Warning, Edit, Delete, AddCircle,
    AddBoxRounded
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import { GetAllroompet, UpdateRoompet,createRoompet, DeleteRoompet } from '../services/report.service';

// Create a custom styled container for the logo
const LogoContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 2),
    height: 64,
    backgroundColor: theme.palette.primary.dark
}));

const admin_name = decodeURIComponent(Cookies.get("name_owner") || "");
const cus_id = Cookies.get("cus_ido");
const accessToken = Cookies.get("accessTokeno");

// Menu items configuration
const menuItems = [
    { icon: <Home />, label: 'ພາບລວມຄລິນິກ', path: '/owner/dashboard' },
    { icon: <People />, label: 'ຂໍ້ມູນພະນັກງານ', path: '/owner/dataemployee' },
    { icon: <People />, label: 'ຂໍ້ມູນລູກຄ້າ', path: '/owner/datacustomer' },
    { icon: <CalendarMonth />, label: 'ຂໍ້ມູນການຈອງ', path: '/owner/databooking' },
    { icon: <Pets />, label: 'ຝາກສັດລ້ຽງ', path: '/owner/petboarding' },
    { icon: <Bathtub />, label: 'ອາບນ້ຳສັດລ້ຽງ', path: '/owner/bathpet' },
    { icon: <ContentCut />, label: 'ຕັດຂົນສັດລ້ຽງ', path: '/owner/petbar' },
    { icon: <Vaccines />, label: 'ປິ່ນປົວສັດລ້ຽງ', path: '/owner/treatpet' },
    { icon: <AssessmentIcon />, label: 'ລາຍງານ', path: '/owner/report' },
    { icon: <AddBoxRounded />, label: 'ເພີ່ມກົງສັດລ້ຽງ', path: '/owner/InsertCages', active: true },
];

// Define the drawer width
const drawerWidth = 240;

const InsertCages = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [roompetData, setRoompetData] = useState([]);
    const [cageData, setCageData] = useState([]);

    // State สำหรับ Delete Confirmation Dialog
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [cageToDelete, setCageToDelete] = useState(null);

    useEffect(() => {
        const getAllRoompet = async () => {
            const response = await GetAllroompet();
            const mapped = response.map((room) => ({
                id: room.room_id,
                cageName: room.room_name,
                cagePrice: room.price,
                cageStatus: room.status,
                cageSize: '-', // หรือเพิ่มข้อมูลจาก backend ถ้ามี
            }));
            setCageData(mapped);

            setCageData(response);
            console.log("roompetData", roompetData);
            console.log("response", response);
        }
        getAllRoompet();
    }, []);

    // Form states
    const [formData, setFormData] = useState({
        cageName: '',
        cagePrice: '',
        cageSize: '',
        cageStatus: 'ວ່າງ',
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

    // Handle dialog open/close
    const handleDialogOpen = (cage = null) => {
        console.log("cage", cage);
        if (cage) {
            // Map API data structure to form data structure
            const mappedFormData = {
                id: cage.room_id,
                cageName: cage.room_name,
                cagePrice: cage.price.toString(), // Convert to string for TextField
                cageStatus: cage.status,
                description: cage.description || '' // Handle if description doesn't exist
            };
            setFormData(mappedFormData);
            setEditMode(true);
        } else {
            setFormData({
                cageName: '',
                cagePrice: '',
                cageSize: '',
                cageStatus: 'ວ່າງ',
                description: ''
            });
            setEditMode(false);
        }
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        console.log("formData", formData);
        e.preventDefault();

        // Basic validation
        if (!formData.cageName || !formData.cagePrice || !formData.cageStatus) {
            setSnackbarMessage('ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        if (editMode) {
            console.log("editMode1", editMode);
            const roomData = {
                room_name: formData.cageName,
                price: formData.cagePrice,
                status: formData.cageStatus,
            }
            console.log("roomData", roomData);
            console.log("formData.id", formData.id);
            const response = UpdateRoompet(formData.id, roomData, accessToken);
            // Update existing cage
            setCageData(prevData =>
                prevData.map(cage =>
                    cage.id === formData.id ? formData : cage
                )
            );
            setSnackbarMessage('ແກ້ໄຂກົງສັດລ້ຽງສຳເລັດແລ້ວ!');
        } else {
            console.log("editMode2", editMode);
            // Add new cage
            const newCage = {
                room_name: formData.cageName,
                owner_id: cus_id,
                price: formData.cagePrice,
                status: formData.cageStatus,
            };
            console.log("newCage", newCage);
            const response = createRoompet(newCage, accessToken);
            console.log("response", response);
            setCageData(prevData => [...prevData, newCage]);
            setSnackbarMessage('ເພີ່ມກົງສັດລ້ຽງສຳເລັດແລ້ວ!');
        }

        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setOpenDialog(false);

        // Reset form
        setFormData({
            cageName: '',
            cagePrice: '',
            cageSize: '',
            cageStatus: 'ວ່າງ',
            description: ''
        });

        window.location.reload();
    };

    // Handle delete cage button click - ເປີດ confirmation dialog
    const handleDeleteClick = (cage) => {
        console.log("cage", cage);
        console.log("cageid", cage.room_id);
        setCageToDelete(cage);
        setOpenDeleteDialog(true);
    };

    // Handle actual delete after confirmation
    const handleConfirmDelete = () => {
        console.log("cageToDelete", cageToDelete);
        console.log("cageToDelete.room_id", cageToDelete.room_id);
        const response = DeleteRoompet(cageToDelete.room_id, accessToken);
        console.log("response", response);
        if (cageToDelete) {
            setCageData(prevData => prevData.filter(cage => cage.room_id !== cageToDelete.room_id));
            setSnackbarMessage('ລຶບກົງສັດລ້ຽງສຳເລັດແລ້ວ!');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
        }
        setOpenDeleteDialog(false);
        setCageToDelete(null);

        setTimeout(() => {
            window.location.reload();
        }, 100);
    };

    // Handle cancel delete
    const handleCancelDelete = () => {
        setOpenDeleteDialog(false);
        setCageToDelete(null);
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
                <Container maxWidth="xl">
                    {/* Page Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Typography variant="h4" fontWeight="bold" color="primary">
                            ຈັດການກົງສັດລ້ຽງ
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Add />}
                            onClick={() => handleDialogOpen()}
                            sx={{ borderRadius: 2 }}
                        >
                            ເພີ່ມກົງໃໝ່
                        </Button>
                    </Box>

                    {/* Cages Table */}
                    <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#e3f2fd' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>ຊື່ກົງ</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>ລາຄາ (ກີບ)</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>ຂະໜາດ</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>ສະຖານະ</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>ຈັດການ</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cageData.map((cage) => (
                                    <TableRow key={cage.room_id} hover>
                                        <TableCell>{cage.room_name}</TableCell>
                                        <TableCell>{Number(cage.price).toLocaleString()}</TableCell>
                                        <TableCell>
                                            {Number(cage.price) === 50000
                                                ? 'S'
                                                : Number(cage.price) === 70000
                                                    ? 'M'
                                                    : Number(cage.price) === 100000
                                                        ? 'L'
                                                        : '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={cage.status}
                                                color={cage.status === 'ວ່າງ' ? 'success' : 'error'}
                                                size="small"
                                                sx={{ fontWeight: 'bold' }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <IconButton
                                                    onClick={() => handleDialogOpen(cage)}
                                                    color="primary"
                                                    size="small"
                                                    sx={{
                                                        bgcolor: 'primary.light',
                                                        color: 'white',
                                                        '&:hover': { bgcolor: 'primary.main' },
                                                    }}
                                                >
                                                    <Edit fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => handleDeleteClick(cage)}
                                                    color="error"
                                                    size="small"
                                                    sx={{
                                                        bgcolor: 'error.light',
                                                        color: 'white',
                                                        '&:hover': { bgcolor: 'error.main' },
                                                    }}
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Add/Edit Dialog */}
                    <Dialog
                        open={openDialog}
                        onClose={handleDialogClose}
                        maxWidth="sm"
                        fullWidth
                        PaperProps={{
                            sx: { borderRadius: 2 }
                        }}
                    >
                        <DialogTitle sx={{
                            fontWeight: 'bold',
                            bgcolor: theme.palette.primary.main,
                            color: 'white',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Pets sx={{ mr: 1 }} />
                                {editMode ? 'ແກ້ໄຂກົງສັດລ້ຽງ' : 'ເພີ່ມກົງສັດລ້ຽງ'}
                            </Box>
                            <IconButton onClick={handleDialogClose} sx={{ color: 'white' }}>
                                <Close />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent sx={{ p: 3 }}>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={3} sx={{ mt: 1 }}>
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
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                }
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="ລາຄາ (ກີບ)"
                                            name="cagePrice"
                                            type="number"
                                            value={formData.cagePrice}
                                            onChange={handleInputChange}
                                            required
                                            variant="outlined"
                                            placeholder="ເຊັ່ນ: 50000"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                }
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth required>
                                            <InputLabel>ສະຖານະ</InputLabel>
                                            <Select
                                                name="cageStatus"
                                                value={formData.cageStatus}
                                                label="ສະຖານະ"
                                                onChange={handleInputChange}
                                                sx={{ borderRadius: 2 }}
                                            >
                                                <MenuItem value="ວ່າງ">ວ່າງ</MenuItem>
                                                <MenuItem value="ບໍ່ວ່າງ">ບໍ່ວ່າງ</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </form>
                        </DialogContent>
                        <DialogActions sx={{ p: 3 }}>
                            <Button
                                onClick={handleDialogClose}
                                variant="outlined"
                                color="error"
                                startIcon={<Close />}
                                sx={{ borderRadius: 2 }}
                            >
                                ຍົກເລີກ
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                variant="contained"
                                color="primary"
                                startIcon={editMode ? <Save /> : <Add />}
                                sx={{ borderRadius: 2 }}
                            >
                                {editMode ? 'ແກ້ໄຂ' : 'ເພີ່ມ'}
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Delete Confirmation Dialog */}
                    <Dialog
                        open={openDeleteDialog}
                        onClose={handleCancelDelete}
                        maxWidth="sm"
                        PaperProps={{
                            sx: { borderRadius: 2 }
                        }}
                    >
                        <DialogTitle sx={{
                            fontWeight: 'bold',
                            bgcolor: theme.palette.error.main,
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <Warning sx={{ mr: 1 }} />
                            ຢືນຢັນການລຶບ
                        </DialogTitle>
                        <DialogContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                ທ່ານຕ້ອງການລຶບກົງສັດລ້ຽງນີ້ແທ້ບໍ?
                            </Typography>
                            {cageToDelete && (
                                <Box sx={{ 
                                    bgcolor: '#f5f5f5', 
                                    p: 2, 
                                    borderRadius: 2,
                                    border: '1px solid #ddd'
                                }}>
                                    <Typography variant="body1">
                                        <strong>ຊື່ກົງ:</strong> {cageToDelete.room_name}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>ລາຄາ:</strong> {Number(cageToDelete.price).toLocaleString()} ກີບ
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>ສະຖານະ:</strong> {cageToDelete.status}
                                    </Typography>
                                </Box>
                            )}
                            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                                ⚠️ ການກະທຳນີ້ບໍ່ສາມາດຍົກເລີກໄດ້!
                            </Typography>
                        </DialogContent>
                        <DialogActions sx={{ p: 3 }}>
                            <Button
                                onClick={handleCancelDelete}
                                variant="outlined"
                                color="primary"
                                sx={{ borderRadius: 2 }}
                            >
                                ຍົກເລີກ
                            </Button>
                            <Button
                                onClick={handleConfirmDelete}
                                variant="contained"
                                color="error"
                                startIcon={<Delete />}
                                sx={{ borderRadius: 2 }}
                            >
                                ຕົກລົງ ລຶບ
                            </Button>
                        </DialogActions>
                    </Dialog>
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