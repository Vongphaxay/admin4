import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, CssBaseline, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Grid, Button, Avatar, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, MenuItem, Select, InputLabel, FormControl, useTheme, styled, Container, Chip, DialogContentText
} from '@mui/material';
import {
    Edit, Delete, AddCircle, Home, Person, People, CalendarMonth, Pets, Bathtub, ContentCut, Vaccines, Menu, Assessment as AssessmentIcon, AddBoxRounded, ChevronRight, Notifications, Close, Logout, Phone, Email, LocationOn, Cake, Search, FilterList, Warning
} from '@mui/icons-material';
import Cookies from 'js-cookie';
// ເພີ່ມການນຳເຂົ້າ Snackbar ແລະ MuiAlert
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { getReportallcus, DeleteCustomer, UpdateCus } from '../services/report.service';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

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

// Define the drawer width
const drawerWidth = 240;

const Deletecusapi = async (cus_id) => {
    try {
        const response = await DeleteCustomer(cus_id, accessToken);
        return response;
    } catch (error) {
        const message = error?.response?.data?.error;

        if (message?.includes("foreign key constraint fails")) {
            // alert("ບໍ່ສາມາດລົບລູກຄ້ານີ້ໄດ້ ເນື່ອງຈາກຍັງມີຂໍ້ມູນການຈອງຢູ່.");
            return "foreign_key_error";

        } else {
            // แสดงข้อความทั่วไป ถ้าไม่ใช่ error แบบ foreign key
            alert("ເກີດຂໍ້ຜິດພາດໃນການລົບຂໍ້ມູນ. ກະລຸນາລອງໃໝ່ພາຍຫຼັງ.");
        }

        // Log ใน console สำหรับนักพัฒนา
        console.error(" Delete error:", error.response?.data || error.message);
    }
};

// Menu items
const menuItems = [
    { icon: <Home />, label: 'ພາບລວມຄລິນິກ', path: '/owner/dashboard' },
    { icon: <People />, label: 'ຂໍ້ມູນພະນັກງານ', path: '/owner/dataemployee' },
    { icon: <People />, label: 'ຂໍ້ມູນລູກຄ້າ', path: '/owner/datacustomer', active: true },
    { icon: <CalendarMonth />, label: 'ຂໍ້ມູນການຈອງ', path: '/owner/databooking' },
    { icon: <Pets />, label: 'ຝາກສັດລ້ຽງ', path: '/owner/petboarding' },
    { icon: <Bathtub />, label: 'ອາບນ້ຳສັດລ້ຽງ', path: '/owner/bathpet' },
    { icon: <ContentCut />, label: 'ຕັດຂົນສັດລ້ຽງ', path: '/owner/petbar' },
    { icon: <Vaccines />, label: 'ປິ່ນປົວສັດລ້ຽງ', path: '/owner/treatpet' },
    { icon: <AssessmentIcon />, label: 'ລາຍງານ', path: '/owner/report' },
    { icon: <AddBoxRounded />, label: 'ເພີ່ມກົງສັດລ້ຽງ', path: '/owner/insertCages' },
];

const CustomerManagement = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [reportData, setReportData] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    // ເພີ່ມ state ສຳລັບ Dialog ຢືນຢັນການລົບ
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);

    const [customerData, setCustomerData] = useState([]);

    // ເພີ່ມຟັງຊັນສຳລັບປິດ Snackbar
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpenSnackbar(false);
    };

    useEffect(() => {
        const getReportallcusapi = async () => {
            const response = await getReportallcus(accessToken);
            const mappedData = response.report.map((item) => ({
                id: item.cus_id,
                name: item.cus_name,
                gender: item.gender,
                phone: item.tel,
                address: item.address,
                username: item.username,
                pets: [] // หากไม่มี pets จาก API ก็ใส่ array ว่างไว้
            }));
            setCustomerData(mappedData);
            setReportData(response); // เก็บ raw data เผื่อไว้ใช้
        };
        getReportallcusapi();
    }, [accessToken]);

    const [currentCustomer, setCurrentCustomer] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        status: 'New',
        pets: [],
        gender: '',
        username: ''
    });
    const [currentPet, setCurrentPet] = useState({ name: '', type: '', breed: '', age: '', gender: '' });
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);

    const handleDialogOpen = (customer = null) => {
        if (customer) {
            setCurrentCustomer({ ...customer });
            setEditMode(true);
        } else {
            setCurrentCustomer({
                name: '',
                phone: '',
                email: '',
                address: '',
                status: 'New',
                pets: [],
                gender: '',
                username: ''
            });
            setEditMode(false);
        }
        setOpenDialog(true);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleDialogClose = () => setOpenDialog(false);

    const handleSaveCustomer = async () => {
        if (editMode) {
            try {
                console.log("currentCustomer1", currentCustomer);
                const CustomerData = {
                    cus_name: currentCustomer.name,
                    gender: currentCustomer.gender,
                    address: currentCustomer.address,
                    tel: currentCustomer.phone
                };
                console.log("CustomerData", CustomerData);
                console.log("currentCustomer.id", currentCustomer.id);

                const response = await UpdateCus(currentCustomer.id, CustomerData, accessToken);
                console.log("response", response);

                // ອັບເດດ state ກ່ອນ
                setCustomerData(prevData =>
                    prevData.map(item =>
                        item.id === currentCustomer.id ? currentCustomer : item
                    )
                );

                // ປິດ dialog
                setOpenDialog(false);

                // ສະແດງຂໍ້ຄວາມສຳເລັດພ້ອມໄອຄອນ ✅
                setSnackbarMessage(" ແກ້ໄຂຂໍ້ມູນລູກຄ້າສຳເລັດ");
                setSnackbarSeverity("success");
                setOpenSnackbar(true);

                // Reload ໜ້າຫຼັງຈາກສະແດງຂໍ້ຄວາມສຳເລັດແລ້ວ 1.5 ວິນາທີ
                setTimeout(() => {
                    window.location.reload();
                }, 600);

            } catch (error) {
                console.error("Error updating customer:", error);

                // ສະແດງຂໍ້ຄວາມຜິດພາດ
                let errorMessage = "ຂໍ້ຜິດພາດໃນການແກ້ໄຂຂໍ້ມູນລູກຄ້າ";

                if (error.response && error.response.data && error.response.data.error) {
                    errorMessage = "ເກີດຂໍ້ຜິດພາດ: " + error.response.data.error;
                    //ເກີດຂໍ້ຜິດພາດ: if Phone number already exists. 
                    if (errorMessage.includes("Phone number already exists.")) {
                        errorMessage = "ບໍ່ສາມາດແກ້ໄຂໄດ້ ເນື່ອງຈາກມີເບີໂທຊ້ຳກັບຜູ້ອື່ນ";
                    }
                }

                setSnackbarMessage(" " + errorMessage);
                setSnackbarSeverity("error");
                setOpenSnackbar(true);

                // Reload ໜ້າຫຼັງຈາກສະແດງຂໍ້ຄວາມຜິດພາດແລ້ວ 2 ວິນາທີ
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        } else {
            // ກໍລະນີເພີ່ມລູກຄ້າໃໝ່
            console.log("currentCustomer2", currentCustomer);

            setCustomerData(prevData => [
                ...prevData,
                {
                    ...currentCustomer,
                    id: prevData.length + 1,
                    pets: currentCustomer.pets || []
                }
            ]);

            // ປິດ dialog
            setOpenDialog(false);

            // ສະແດງຂໍ້ຄວາມສຳເລັດສຳລັບການເພີ່ມລູກຄ້າໃໝ່
            setSnackbarMessage("✅ ເພີ່ມລູກຄ້າໃໝ່ສຳເລັດ");
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
        }
    };

    // ຟັງຊັນເປີດ Dialog ຢືນຢັນການລົບ
    const handleOpenDeleteDialog = (customer) => {
        setCustomerToDelete(customer);
        setDeleteDialogOpen(true);
    };

    // ຟັງຊັນປິດ Dialog ຢືນຢັນການລົບ
    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setCustomerToDelete(null);
    };

    // ຟັງຊັນລົບຂໍ້ມູນລູກຄ້າທີ່ປັບປຸງແລ້ວ
    const handleDeleteCustomer = async () => {
        if (customerToDelete) {
            const result = await Deletecusapi(customerToDelete.id);

            if (result === "foreign_key_error") {
                MySwal.fire({
                    icon: 'error',
                    title: 'ບໍ່ສາມາດລົບໄດ້',
                    text: 'ບໍ່ສາມາດລົບລູກຄ້ານີ້ໄດ້ ເນື່ອງຈາກຍັງມີຂໍ້ມູນການຈອງຢູ່.',
                    confirmButtonText: 'ຕົກລົງ'
                });
            } else if (result) {
                MySwal.fire({
                    icon: 'success',
                    title: 'ລົບສຳເລັດ',
                    text: 'ຂໍ້ມູນລູກຄ້າຖືກລົບອອກຈາກລະບົບແລ້ວ.',
                    confirmButtonText: 'ຕົກລົງ'
                }).then(() => {
                    window.location.reload();
                });
            }
            handleCloseDeleteDialog();
        }
    };

    // ຮາກສາໄວ້ເພື່ອຄວາມສອດຄ່ອງກັບໂຄດເກົ່າ (ຈະບໍ່ໄດ້ໃຊ້ແລ້ວ)
    const handleDeleteCustomerOld = async (id) => {
        if (window.confirm('ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບຂໍ້ມູນລູກຄ້ານີ້?')) {
            await Deletecusapi(id);
            window.location.reload();
        }
    };

    const handleNavigate = (path) => {
        navigate(path);
    };

    const handleLogout = () => {
        {
            navigate('/');
        }
    };

    const filteredCustomers = customerData.filter((customer) => {
        const name = customer.name?.toLowerCase() || '';
        const phone = customer.phone || '';
        const gender = customer.gender?.toLowerCase() || '';

        return (
            name.includes(searchQuery.toLowerCase()) ||
            phone.includes(searchQuery) ||
            gender.includes(searchQuery.toLowerCase())
        );
    });

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
                            onClick={() => handleNavigate(item.path)}
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
                            color: theme.palette.primary.contrastText
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>

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
                        <Typography variant="h4" fontWeight="bold" color="primary">ຂໍ້ມູນລູກຄ້າ</Typography>
                    </Box>

                    {/* Search and Filters */}
                    <Paper
                        elevation={2}
                        sx={{
                            p: 2,
                            mb: 3,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            flex: 1,
                            maxWidth: { md: '400px' }
                        }}
                    >
                        <TextField
                            placeholder="ຄົ້ນຫາລູກຄ້າ..."
                            fullWidth
                            variant="outlined"
                            size="small"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />,
                            }}
                            sx={{ flexGrow: 1 }}
                        />
                    </Paper>

                    {/* Customer Table */}
                    <TableContainer component={Paper} sx={{ boxShadow: 3, mb: 4 }}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#e3f2fd' }}>
                                <TableRow>
                                    <TableCell>ຊື່ ແລະ ນາມສະກຸນ</TableCell>
                                    <TableCell>ເພດ</TableCell>
                                    <TableCell>ທີ່ຢູ່</TableCell>
                                    <TableCell>ເບີໂທລະສັບ</TableCell>
                                    <TableCell>ຊື່ຜູ້ໃຊ້</TableCell>
                                    <TableCell>ຈັດການ</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredCustomers.map((customer) => (
                                    <TableRow key={customer.id}>
                                        <TableCell>{customer.name}</TableCell>
                                        <TableCell>{customer.gender}</TableCell>
                                        <TableCell>{customer.address}</TableCell>
                                        <TableCell>{customer.phone}</TableCell>
                                        <TableCell>{customer.username}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleDialogOpen(customer)} sx={{ color: '#1976d2' }}>
                                                <Edit />
                                            </IconButton>
                                            {/* ປ່ຽນຈາກການໃຊ້ window.confirm ເປັນການເປີດ Dialog */}
                                            <IconButton
                                                onClick={() => handleOpenDeleteDialog(customer)}
                                                color="error"
                                            >
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredCustomers.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">ບໍ່ພົບຂໍ້ມູນ</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Dialog for editing customer data */}
                    <Dialog
                        open={openDialog}
                        onClose={handleDialogClose}
                        maxWidth="md"
                        fullWidth
                        PaperProps={{
                            sx: {
                                borderRadius: 2,
                                boxShadow: 3
                            }
                        }}
                    >
                        <DialogTitle
                            sx={{
                                fontWeight: 'bold',
                                bgcolor: theme.palette.primary.main,
                                color: 'white',
                                py: 2,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
                            {editMode ? <Edit fontSize="small" /> : <AddCircle fontSize="small" />}
                            {editMode ? 'ແກ້ໄຂຂໍ້ມູນລູກຄ້າ' : 'ເພີ່ມຂໍ້ມູນລູກຄ້າໃໝ່'}
                        </DialogTitle>

                        <DialogContent sx={{ p: 3 }}>
                            <Grid container spacing={3} sx={{ mt: 0 }}>
                                <Grid item xs={12}>
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 2, mb: 1 }}>
                                        <Grid container spacing={2}>
                                            {/* Name */}
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    label="ຊື່ ແລະ ນາມສະກຸນ"
                                                    fullWidth
                                                    value={currentCustomer.name || ''}
                                                    onChange={(e) => setCurrentCustomer({ ...currentCustomer, name: e.target.value })}
                                                    InputProps={{
                                                        startAdornment: <Person fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                                                    }}
                                                    variant="outlined"
                                                    size="medium"
                                                />
                                            </Grid>

                                            {/* Gender */}
                                            <Grid item xs={12} md={6}>
                                                <FormControl fullWidth variant="outlined" size="medium">
                                                    <InputLabel id="gender-label">ເພດ</InputLabel>
                                                    <Select
                                                        labelId="gender-label"
                                                        value={currentCustomer.gender || ''}
                                                        label="ເພດ"
                                                        onChange={(e) => setCurrentCustomer({ ...currentCustomer, gender: e.target.value })}
                                                    >
                                                        <MenuItem value="ຊາຍ">ຊາຍ</MenuItem>
                                                        <MenuItem value="ຍິງ">ຍິງ</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>

                                            {/* Phone */}
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    label="ເບີໂທລະສັບ"
                                                    fullWidth
                                                    value={currentCustomer.phone || ''}
                                                    onChange={(e) => setCurrentCustomer({ ...currentCustomer, phone: e.target.value })}
                                                    InputProps={{
                                                        startAdornment: <Phone fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                                                    }}
                                                    variant="outlined"
                                                    size="medium"
                                                />
                                            </Grid>

                                            {/* Username */}
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    label="ຊື່ຜູ້ໃຊ້"
                                                    fullWidth
                                                    value={currentCustomer.username || ''}
                                                    onChange={(e) => setCurrentCustomer({ ...currentCustomer, username: e.target.value })}
                                                    variant="outlined"
                                                    size="medium"
                                                />
                                            </Grid>

                                            {/* Password (only for new customers) */}
                                            {!editMode ? (
                                                <Grid item xs={12} md={6}>
                                                    <TextField
                                                        label="ລະຫັດຜ່ານ"
                                                        type="password"
                                                        fullWidth
                                                        value={currentCustomer.password || ''}
                                                        onChange={(e) => setCurrentCustomer({ ...currentCustomer, password: e.target.value })}
                                                        variant="outlined"
                                                        size="medium"
                                                    />
                                                </Grid>
                                            ) : null}

                                            {/* Address - always at the end, width depends on editMode */}
                                            <Grid item xs={12} md={!editMode ? 6 : 12}>
                                                <TextField
                                                    label="ທີ່ຢູ່"
                                                    fullWidth
                                                    multiline
                                                    rows={2}
                                                    value={currentCustomer.address || ''}
                                                    onChange={(e) => setCurrentCustomer({ ...currentCustomer, address: e.target.value })}
                                                    InputProps={{
                                                        startAdornment: <LocationOn fontSize="small" sx={{ color: 'text.secondary', mr: 1, alignSelf: 'flex-start', mt: 1 }} />
                                                    }}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </DialogContent>

                        <DialogActions sx={{ px: 3, py: 3, justifyContent: 'center', gap: 2 }}>
                            <Button
                                onClick={handleDialogClose}
                                variant="outlined"
                                color="error"
                                startIcon={<Close />}
                                sx={{ borderRadius: 2, px: 3 }}
                            >
                                ຍົກເລີກ
                            </Button>
                            <Button
                                onClick={handleSaveCustomer}
                                variant="contained"
                                color="primary"
                                startIcon={editMode ? <Edit /> : <AddCircle />}
                                sx={{ borderRadius: 2, px: 3 }}
                            >
                                {editMode ? 'ແກ້ໄຂຂໍ້ມູນ' : 'ບັນທຶກຂໍ້ມູນ'}
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Dialog ຢືນຢັນການລົບຂໍ້ມູນລູກຄ້າ */}
                    <Dialog
                        open={deleteDialogOpen}
                        onClose={handleCloseDeleteDialog}
                        PaperProps={{
                            sx: {
                                borderRadius: 2,
                                minWidth: '350px'
                            }
                        }}
                    >
                        <DialogTitle sx={{
                            bgcolor: '#ffebee',
                            color: '#d32f2f',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            p: 2
                        }}>
                            <Warning color="error" />
                            ຢືນຢັນການລົບຂໍ້ມູນ
                        </DialogTitle>
                        <DialogContent sx={{ pt: 3, pb: 2, px: 3 }}>
                            <DialogContentText>
                                ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບຂໍ້ມູນລູກຄ້າ:
                                <Box component="span" sx={{ fontWeight: 'bold', display: 'block', my: 1 }}>
                                    {customerToDelete?.name}
                                </Box>
                                ການກະທໍານີ້ບໍ່ສາມາດຍ້ອນກັບໄດ້!
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center', gap: 2 }}>
                            <Button
                                onClick={handleCloseDeleteDialog}
                                variant="outlined"
                                color="inherit"
                                sx={{ borderRadius: 2, px: 3 }}
                            >
                                ຍົກເລີກ
                            </Button>
                            <Button
                                onClick={handleDeleteCustomer}
                                variant="contained"
                                color="error"
                                startIcon={<Delete />}
                                sx={{ borderRadius: 2, px: 3 }}
                            >
                                ລົບຂໍ້ມູນ
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Snackbar ສຳລັບສະແດງຂໍ້ຄວາມ */}
                    <Snackbar
                        open={openSnackbar}
                        autoHideDuration={3000}
                        onClose={handleSnackbarClose}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                        <MuiAlert
                            onClose={handleSnackbarClose}
                            severity={snackbarSeverity}
                            sx={{ width: '100%' }}
                            elevation={6}
                            variant="filled"
                        >
                            {snackbarMessage}
                        </MuiAlert>
                    </Snackbar>
                </Container>
            </Box>
        </Box>
    );
};

export default CustomerManagement;