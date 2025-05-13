import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, CssBaseline, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Grid, Button, Avatar, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, MenuItem, Select, InputLabel, FormControl, useTheme, styled, Container, Chip
} from '@mui/material';
import {
    Edit, Delete, AddCircle, Home, Person, People, CalendarMonth, Pets, Bathtub, ContentCut, Vaccines, Menu, ChevronRight, Notifications, Close, Logout, Phone, Email, LocationOn, Cake, Search, FilterList
} from '@mui/icons-material';
import Cookies from 'js-cookie';

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
    const [petDialogOpen, setPetDialogOpen] = useState(false);
    const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerData, setCustomerData] = useState([
        {
            id: 1,
            name: 'ທ. ສຸລິຍະ ແສງມະນີ',
            phone: '020 5555 1234',
            email: 'suriya@example.com',
            address: 'ບ້ານ ດົງໂດກ, ເມືອງ ໄຊທານີ, ນະຄອນຫຼວງວຽງຈັນ',
            status: 'Regular',
            pets: [
                { id: 1, name: 'ມີກີ້', type: 'ໝາ', breed: 'ປອມ', age: '3 ປີ', gender: 'ຜູ້' },
                { id: 2, name: 'ໂຕໂຕ້', type: 'ໝາ', breed: 'ຊິບ້າ', age: '1 ປີ', gender: 'ແມ່' }
            ]
        },
        {
            id: 2,
            name: 'ນ. ນິດຕະຍາ ພົມມະວົງ',
            phone: '020 7777 8888',
            email: 'nittaya@example.com',
            address: 'ບ້ານ ທາດຫຼວງ, ເມືອງ ຈັນທະບູລີ, ນະຄອນຫຼວງວຽງຈັນ',
            status: 'VIP',
            pets: [
                { id: 3, name: 'ກິບກີ້', type: 'ແມວ', breed: 'ເປີເຊຍ', age: '2 ປີ', gender: 'ແມ່' }
            ]
        },
        {
            id: 3,
            name: 'ທ. ຄຳຫຼ້າ ສຸວັນນະພູມ',
            phone: '020 9999 0000',
            email: 'khamla@example.com',
            address: 'ບ້ານ ໂພນຕ້ອງ, ເມືອງ ສີໂຄດຕະບອງ, ນະຄອນຫຼວງວຽງຈັນ',
            status: 'New',
            pets: [
                { id: 4, name: 'ໂລຊີ', type: 'ໝາ', breed: 'ກົນຈອນ', age: '5 ປີ', gender: 'ແມ່' },
                { id: 5, name: 'ບາດູ', type: 'ໝາ', breed: 'ພິດບູນ', age: '4 ປີ', gender: 'ຜູ້' },
                { id: 6, name: 'ລູລູ່', type: 'ແມວ', breed: 'ສະກັອດຕິຊໂຟລ', age: '1 ປີ', gender: 'ແມ່' }
            ]
        },
    ]);
    const [currentCustomer, setCurrentCustomer] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        status: 'New',
        pets: []
    });
    const [currentPet, setCurrentPet] = useState({ name: '', type: '', breed: '', age: '', gender: '' });
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);

    const handleDialogOpen = (customer = null) => {
        if (customer) {
            setCurrentCustomer({ ...customer });
            setEditMode(true);
        } else {
            setCurrentCustomer({ name: '', phone: '', email: '', address: '', status: 'New', pets: [] });
            setEditMode(false);
        }
        setOpenDialog(true);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
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

    const handleDeleteCustomer = (id) => {
        if (window.confirm('ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບຂໍ້ມູນລູກຄ້ານີ້?')) {
            setCustomerData(prevData => prevData.filter(item => item.id !== id));
        }
    };

    const handlePetDialogOpen = (customerId, pet = null) => {
        setSelectedCustomerId(customerId);
        if (pet) {
            setCurrentPet({ ...pet });
            setEditMode(true);
        } else {
            setCurrentPet({ name: '', type: '', breed: '', age: '', gender: '' });
            setEditMode(false);
        }
        setPetDialogOpen(true);
    };

    const handlePetDialogClose = () => setPetDialogOpen(false);

    const handleSavePet = () => {
        const updatedCustomerData = customerData.map(customer => {
            if (customer.id === selectedCustomerId) {
                if (editMode) {
                    const updatedPets = customer.pets.map(pet =>
                        pet.id === currentPet.id ? currentPet : pet
                    );
                    return { ...customer, pets: updatedPets };
                } else {
                    const newPet = {
                        ...currentPet,
                        id: Math.max(0, ...customer.pets.map(p => p.id)) + 1
                    };
                    return { ...customer, pets: [...customer.pets, newPet] };
                }
            }
            return customer;
        });

        setCustomerData(updatedCustomerData);
        setPetDialogOpen(false);
    };

    const handleDeletePet = (customerId, petId) => {
        if (window.confirm('ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບຂໍ້ມູນສັດລ້ຽງນີ້?')) {
            const updatedCustomerData = customerData.map(customer => {
                if (customer.id === customerId) {
                    return {
                        ...customer,
                        pets: customer.pets.filter(pet => pet.id !== petId)
                    };
                }
                return customer;
            });
            setCustomerData(updatedCustomerData);
        }
    };

    const handleViewDetails = (customer) => {
        setSelectedCustomer(customer);
        setViewDetailsOpen(true);
    };

    const handleViewDetailsClose = () => {
        setViewDetailsOpen(false);
    };

    const handleNavigate = (path) => {
        navigate(path);
    };

    const handleLogout = () => {
        if (window.confirm('ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການອອກຈາກລະບົບ?')) {
            navigate('/');
        }
    };

    const filteredCustomers = customerData.filter(customer =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'VIP': return { bg: '#ffa000', color: '#fff' };
            case 'Regular': return { bg: '#2e7d32', color: '#fff' };
            case 'New': return { bg: '#1976d2', color: '#fff' };
            default: return { bg: '#9e9e9e', color: '#fff' };
        }
    };

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
                                        <TableCell>{customer.phone}</TableCell>
                                        <TableCell>{customer.email}</TableCell>
                                        <TableCell>{customer.phone}</TableCell>
                                        <TableCell>{customer.pets?.length || 0}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleDialogOpen()} sx={{ color: '#1976d2' }}><Edit /></IconButton>
                                            <IconButton onClick={() => handleDeleteCustomer()} color="error"><Delete /></IconButton>
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
                </Container>
            </Box>
        </Box>
    );
};
export default CustomerManagement;