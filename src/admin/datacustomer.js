import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, CssBaseline, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Grid, Button, Avatar, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, MenuItem, Select, InputLabel, FormControl, useTheme, styled, Container, Chip
} from '@mui/material';
import {
    Edit, Delete, AddCircle, Home, Person, People, CalendarMonth, Pets, Bathtub, ContentCut, Vaccines, Menu, ChevronRight, Notifications, Close, Logout, Phone, Email, LocationOn, Cake, Search, FilterList
} from '@mui/icons-material';

// Create a custom styled container for the logo
const LogoContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 2),
    height: 64,
    backgroundColor: theme.palette.primary.dark
}));

// Define the drawer width
const drawerWidth = 240;

// Menu items
const menuItems = [
    { icon: <Home />, label: 'ພາບລວມຄລິນິກ', path: '/dashboard' },
    { icon: <People />, label: 'ຂໍ້ມູນພະນັກງານ', path: '/dataemployee' },
    { icon: <People />, label: 'ຂໍ້ມູນລູກຄ້າ', path: '/datacustomer', active: true },
    { icon: <CalendarMonth />, label: 'ຂໍ້ມູນການຈອງ', path: '/databooking' },
    { icon: <Pets />, label: 'ຝາກສັດລ້ຽງ', path: '/petboarding' },
    { icon: <Bathtub />, label: 'ອາບນ້ຳສັດລ້ຽງ', path: '/bathpet'},
    { icon: <ContentCut />, label: 'ຕັດຂົນສັດລ້ຽງ' },
    { icon: <Vaccines />, label: 'ປິ່ນປົວສັດລ້ຽງ' },
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
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: theme.palette.primary.main }}>
                        DR. P VETERINARY
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
                        <Button
                            variant="contained"
                            startIcon={<AddCircle />}
                            onClick={() => handleDialogOpen()}
                            sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#1565c0' } }}
                        >
                            ເພີ່ມລູກຄ້າ
                        </Button>
                    </Paper>

                    {/* Customer Table */}
                    <TableContainer component={Paper} sx={{ boxShadow: 3, mb: 4 }}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#e3f2fd' }}>
                                <TableRow>
                                    <TableCell>ຊື່ ແລະ ນາມສະກຸນ</TableCell>
                                    <TableCell>ເບີໂທລະສັບ</TableCell>
                                    <TableCell>ອີເມວ</TableCell>
                                    <TableCell>ສະຖານະ</TableCell>
                                    <TableCell>ຈຳນວນສັດລ້ຽງ</TableCell>
                                    <TableCell>ຈັດການ</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredCustomers.map((customer) => (
                                    <TableRow key={customer.id}>
                                        <TableCell>{customer.name}</TableCell>
                                        <TableCell>{customer.phone}</TableCell>
                                        <TableCell>{customer.email}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={customer.status === 'VIP' ? 'ວີໄອພີ' :
                                                    customer.status === 'Regular' ? 'ປົກກະຕິ' :
                                                        customer.status === 'New' ? 'ໃໝ່' : customer.status}
                                                sx={{
                                                    bgcolor: getStatusColor(customer.status).bg,
                                                    color: getStatusColor(customer.status).color,
                                                    fontWeight: 'medium'
                                                }}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{customer.pets?.length || 0}</TableCell>
                                        <TableCell>
                                            <Button 
                                                variant="text" 
                                                color="primary" 
                                                size="small"
                                                onClick={() => handleViewDetails(customer)}
                                            >
                                                ລາຍລະອຽດ
                                            </Button>
                                            <IconButton onClick={() => handleDialogOpen(customer)} sx={{ color: '#1976d2' }}><Edit /></IconButton>
                                            <IconButton onClick={() => handleDeleteCustomer(customer.id)} color="error"><Delete /></IconButton>
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

                    {/* Add/Edit Customer Dialog */}
                    <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
                        <DialogTitle>{editMode ? 'ແກ້ໄຂຂໍ້ມູນລູກຄ້າ' : 'ເພີ່ມລູກຄ້າ'}</DialogTitle>
                        <DialogContent>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="ຊື່ ແລະ ນາມສະກຸນ"
                                        fullWidth
                                        value={currentCustomer.name}
                                        onChange={(e) => setCurrentCustomer({ ...currentCustomer, name: e.target.value })}
                                        InputProps={{
                                            startAdornment: (
                                                <Person sx={{ color: 'action.active', mr: 1 }} />
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="ເບີໂທລະສັບ"
                                        fullWidth
                                        value={currentCustomer.phone}
                                        onChange={(e) => setCurrentCustomer({ ...currentCustomer, phone: e.target.value })}
                                        InputProps={{
                                            startAdornment: (
                                                <Phone sx={{ color: 'action.active', mr: 1 }} />
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="ອີເມວ"
                                        type="email"
                                        fullWidth
                                        value={currentCustomer.email}
                                        onChange={(e) => setCurrentCustomer({ ...currentCustomer, email: e.target.value })}
                                        InputProps={{
                                            startAdornment: (
                                                <Email sx={{ color: 'action.active', mr: 1 }} />
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="ທີ່ຢູ່"
                                        fullWidth
                                        multiline
                                        rows={2}
                                        value={currentCustomer.address}
                                        onChange={(e) => setCurrentCustomer({ ...currentCustomer, address: e.target.value })}
                                        InputProps={{
                                            startAdornment: (
                                                <LocationOn sx={{ color: 'action.active', mr: 1 }} />
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>ສະຖານະ</InputLabel>
                                        <Select
                                            value={currentCustomer.status || 'New'}
                                            label="ສະຖານະ"
                                            onChange={(e) => setCurrentCustomer({ ...currentCustomer, status: e.target.value })}
                                        >
                                            <MenuItem value="New">ໃໝ່</MenuItem>
                                            <MenuItem value="Regular">ປົກກະຕິ</MenuItem>
                                            <MenuItem value="VIP">ວີໄອພີ</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDialogClose}>ຍົກເລີກ</Button>
                            <Button onClick={handleSaveCustomer} variant="contained" color="primary">ບັນທຶກ</Button>
                        </DialogActions>
                    </Dialog>

                    {/* View Customer Details Dialog */}
                    <Dialog open={viewDetailsOpen} onClose={handleViewDetailsClose} maxWidth="md" fullWidth>
                        {selectedCustomer && (
                            <>
                                <DialogTitle>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <Typography variant="h6">{selectedCustomer.name}</Typography>
                                        <Chip
                                            label={selectedCustomer.status === 'VIP' ? 'ວີໄອພີ' :
                                                selectedCustomer.status === 'Regular' ? 'ປົກກະຕິ' :
                                                    selectedCustomer.status === 'New' ? 'ໃໝ່' : selectedCustomer.status}
                                            sx={{
                                                bgcolor: getStatusColor(selectedCustomer.status).bg,
                                                color: getStatusColor(selectedCustomer.status).color,
                                                fontWeight: 'medium'
                                            }}
                                            size="small"
                                        />
                                    </Box>
                                </DialogTitle>
                                <DialogContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                                                <Typography variant="subtitle1" color="primary" fontWeight="bold" mb={2}>
                                                    ຂໍ້ມູນສ່ວນຕົວ
                                                </Typography>
                                                <Box display="flex" alignItems="center" mb={1}>
                                                    <Phone sx={{ color: 'text.secondary', mr: 1 }} fontSize="small" />
                                                    <Typography>{selectedCustomer.phone}</Typography>
                                                </Box>
                                                <Box display="flex" alignItems="center" mb={1}>
                                                    <Email sx={{ color: 'text.secondary', mr: 1 }} fontSize="small" />
                                                    <Typography>{selectedCustomer.email}</Typography>
                                                </Box>
                                                <Box display="flex" mb={1}>
                                                    <LocationOn sx={{ color: 'text.secondary', mr: 1 }} fontSize="small" />
                                                    <Typography>{selectedCustomer.address}</Typography>
                                                </Box>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                                                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                                                    <Typography variant="subtitle1" color="primary" fontWeight="bold">
                                                        ສັດລ້ຽງ ({selectedCustomer.pets?.length || 0})
                                                    </Typography>
                                                    <Button 
                                                        size="small" 
                                                        startIcon={<AddCircle />}
                                                        variant="outlined"
                                                        onClick={() => handlePetDialogOpen(selectedCustomer.id)}
                                                    >
                                                        ເພີ່ມສັດລ້ຽງ
                                                    </Button>
                                                </Box>
                                                {selectedCustomer.pets && selectedCustomer.pets.length > 0 ? (
                                                    <TableContainer>
                                                        <Table size="small">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell>ຊື່</TableCell>
                                                                    <TableCell>ປະເພດ</TableCell>
                                                                    <TableCell>ພັນ</TableCell>
                                                                    <TableCell>ອາຍຸ</TableCell>
                                                                    <TableCell>ເພດ</TableCell>
                                                                    <TableCell>ຈັດການ</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {selectedCustomer.pets.map((pet) => (
                                                                    <TableRow key={pet.id}>
                                                                        <TableCell>{pet.name}</TableCell>
                                                                        <TableCell>{pet.type}</TableCell>
                                                                        <TableCell>{pet.breed}</TableCell>
                                                                        <TableCell>{pet.age}</TableCell>
                                                                        <TableCell>{pet.gender}</TableCell>
                                                                        <TableCell>
                                                                            <IconButton 
                                                                                size="small" 
                                                                                color="primary"
                                                                                onClick={() => handlePetDialogOpen(selectedCustomer.id, pet)}
                                                                            >
                                                                                <Edit fontSize="small" />
                                                                            </IconButton>
                                                                            <IconButton 
                                                                                size="small" 
                                                                                color="error"
                                                                                onClick={() => handleDeletePet(selectedCustomer.id, pet.id)}
                                                                            >
                                                                                <Delete fontSize="small" />
                                                                            </IconButton>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                ) : (
                                                    <Box sx={{ py: 2, textAlign: 'center' }}>
                                                        <Typography color="text.secondary">ບໍ່ມີຂໍ້ມູນສັດລ້ຽງ</Typography>
                                                    </Box>
                                                )}
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleViewDetailsClose}>ປິດ</Button>
                                    <Button 
                                        variant="contained" 
                                        color="primary"
                                        onClick={() => {
                                            handleViewDetailsClose();
                                            handleDialogOpen(selectedCustomer);
                                        }}
                                    >
                                        ແກ້ໄຂຂໍ້ມູນ
                                    </Button>
                                </DialogActions>
                            </>
                        )}
                    </Dialog>

                    {/* Add/Edit Pet Dialog */}
                    <Dialog open={petDialogOpen} onClose={handlePetDialogClose} maxWidth="sm" fullWidth>
                        <DialogTitle>{editMode ? 'ແກ້ໄຂຂໍ້ມູນສັດລ້ຽງ' : 'ເພີ່ມສັດລ້ຽງ'}</DialogTitle>
                        <DialogContent>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="ຊື່ສັດລ້ຽງ"
                                        fullWidth
                                        value={currentPet.name}
                                        onChange={(e) => setCurrentPet({ ...currentPet, name: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>ປະເພດ</InputLabel>
                                        <Select
                                            value={currentPet.type}
                                            label="ປະເພດ"
                                            onChange={(e) => setCurrentPet({ ...currentPet, type: e.target.value })}
                                        >
                                            <MenuItem value="ໝາ">ໝາ</MenuItem>
                                            <MenuItem value="ແມວ">ແມວ</MenuItem>
                                            <MenuItem value="ນົກ">ນົກ</MenuItem>
                                            <MenuItem value="ປາ">ປາ</MenuItem>
                                            <MenuItem value="ອື່ນໆ">ອື່ນໆ</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="ພັນ"
                                        fullWidth
                                        value={currentPet.breed}
                                        onChange={(e) => setCurrentPet({ ...currentPet, breed: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="ອາຍຸ"
                                        fullWidth
                                        value={currentPet.age}
                                        onChange={(e) => setCurrentPet({ ...currentPet, age: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>ເພດ</InputLabel>
                                        <Select
                                            value={currentPet.gender}
                                            label="ເພດ"
                                            onChange={(e) => setCurrentPet({ ...currentPet, gender: e.target.value })}
                                        >
                                            <MenuItem value="ຜູ້">ຜູ້</MenuItem>
                                            <MenuItem value="ແມ່">ແມ່</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handlePetDialogClose}>ຍົກເລີກ</Button>
                            <Button onClick={handleSavePet} variant="contained" color="primary">ບັນທຶກ</Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </Box>
        </Box>
    );
};
export default CustomerManagement;