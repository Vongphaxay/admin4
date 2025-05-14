import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, CssBaseline, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Grid, Button, Avatar, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, MenuItem, Select, InputLabel, FormControl, useTheme, styled, Container, Chip
} from '@mui/material';
import {
    Edit, Delete, AddCircle, Home, Person, People, CalendarMonth, Pets, Bathtub, ContentCut, Vaccines, Menu, ChevronRight, Notifications, Close, Logout, Phone, Email, LocationOn, Cake, Search, FilterList
} from '@mui/icons-material';
import Cookies from 'js-cookie';
import { getReportallcus, DeleteCustomer } from '../services/report.service';


// Create a custom styled container for the logo
const LogoContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 2),
    height: 64,
    backgroundColor: theme.palette.primary.dark
}));

const admin_name = decodeURIComponent(Cookies.get("name_admin") || "");
const cus_id = Cookies.get("cus_ida");
const accessToken = Cookies.get("accessTokena");

// Define the drawer width
const drawerWidth = 240;

const Deletecusapi = async (cus_id) => {
    try {
        const response = await DeleteCustomer(cus_id, accessToken);
        return response;
    } catch (error) {
        const message = error?.response?.data?.error;

        if (message?.includes("foreign key constraint fails")) {
            alert("ບໍ່ສາມາດລົບລູກຄ້ານີ້ໄດ້ ເນື່ອງຈາກຍັງມີຂໍ້ມູນການຈອງຢູ່.");
        } else {
            // แสดงข้อความทั่วไป ถ้าไม่ใช่ error แบบ foreign key
            alert("ເກີດຂໍ້ຜິດພາດໃນການລົບຂໍ້ມູນ. ກະລຸນາລອງໃໝ່ພາຍຫຼັງ.");
        }

        // Log ใน console สำหรับนักพัฒนา
        console.error("❌ Delete error:", error.response?.data || error.message);
    }
};




// Menu items
const menuItems = [
    { icon: <Home />, label: 'ພາບລວມຄລິນິກ', path: '/dashboard' },
    { icon: <People />, label: 'ຂໍ້ມູນພະນັກງານ', path: '/dataemployee' },
    { icon: <People />, label: 'ຂໍ້ມູນລູກຄ້າ', path: '/datacustomer', active: true },
    { icon: <CalendarMonth />, label: 'ຂໍ້ມູນການຈອງ', path: '/databooking' },
    { icon: <Pets />, label: 'ຝາກສັດລ້ຽງ', path: '/petboarding' },
    { icon: <Bathtub />, label: 'ອາບນ້ຳສັດລ້ຽງ', path: '/bathpet' },
    { icon: <ContentCut />, label: 'ຕັດຂົນສັດລ້ຽງ', path: '/petbar' },
    { icon: <Vaccines />, label: 'ປິ່ນປົວສັດລ້ຽງ', path: '/treatpet' },
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

    const [customerData, setCustomerData] = useState([]);
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

    const handleSaveCustomer = () => {
        if (editMode) {
            setCustomerData(prevData => prevData.map(item => item.id === currentCustomer.id ? currentCustomer : item));
        } else {
            setCustomerData(prevData => [...prevData, { ...currentCustomer, id: prevData.length + 1, pets: currentCustomer.pets || [] }]);
        }
        setOpenDialog(false);
    };

    const handleDeleteCustomer = async (id) => {
        if (window.confirm('ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບຂໍ້ມູນລູກຄ້ານີ້?')) {
            await Deletecusapi(id);
            window.location.reload();
        }
    };

    const handleNavigate = (path) => {
        navigate(path);
    };

    const handleLogout = () => {
        if (window.confirm('ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການອອກຈາກລະບົບ?')) {
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
                        Admin: {admin_name}
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
                            flexDirection: { xs: 'column', md: 'row' }
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
                                            <IconButton onClick={() => handleDeleteCustomer(customer.id)} color="error">
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

                    {/* Dialog ສຳລັບແກ້ໄຂຂໍ້ມູນລູກຄ້າ */}
                    <Dialog 
                        open={openDialog} 
                        onClose={handleDialogClose} 
                        maxWidth="md" 
                        fullWidth
                    >
                        <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: 'white' }}>
                            {editMode ? 'ແກ້ໄຂຂໍ້ມູນລູກຄ້າ' : 'ເພີ່ມຂໍ້ມູນລູກຄ້າໃໝ່'}
                        </DialogTitle>
                        <DialogContent sx={{ pt: 2, mt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" fontWeight="bold">ຂໍ້ມູນລູກຄ້າ</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="ຊື່ ແລະ ນາມສະກຸນ"
                                        value={currentCustomer.name || ''}
                                        onChange={(e) => setCurrentCustomer({ ...currentCustomer, name: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="ເພດ"
                                        value={currentCustomer.gender || ''}
                                        onChange={(e) => setCurrentCustomer({ ...currentCustomer, gender: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="ຊື່ຜູ້ໃຊ້"
                                        value={currentCustomer.username || ''}
                                        onChange={(e) => setCurrentCustomer({ ...currentCustomer, username: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="ເບີໂທລະສັບ"
                                        value={currentCustomer.phone || ''}
                                        onChange={(e) => setCurrentCustomer({ ...currentCustomer, phone: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="ທີ່ຢູ່"
                                        multiline
                                        rows={2}
                                        value={currentCustomer.address || ''}
                                        onChange={(e) => setCurrentCustomer({ ...currentCustomer, address: e.target.value })}
                                    />
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions sx={{ px: 3, pb: 2 }}>
                            <Button onClick={handleDialogClose} variant="outlined">ຍົກເລີກ</Button>
                            <Button onClick={handleSaveCustomer} variant="contained" color="primary" startIcon={<Edit />}>
                                {editMode ? 'ແກ້ໄຂ' : 'ບັນທຶກ'}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </Box>
        </Box>
    );
};

export default CustomerManagement;