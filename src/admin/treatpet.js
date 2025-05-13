import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, CssBaseline, Drawer, AppBar, Toolbar, List, Typography, Divider,
    IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText,
    Paper, Grid, Button, Avatar, Dialog, DialogActions, DialogContent,
    DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, TextField, MenuItem, Select, InputLabel, FormControl,
    useTheme, styled, Container, Card, CardContent, Chip
} from '@mui/material';
import {
    Edit, Delete, AddCircle, Home, Person, People, CalendarMonth,
    Pets, Bathtub, ContentCut, Vaccines, Menu, ChevronRight, Notifications,
    Close, Logout, Phone, Search, Info, PetsOutlined, MedicalServices,
    LocalHospital, CalendarToday, AttachMoney, Assignment, EventNote
} from '@mui/icons-material';
import { Description } from '@mui/icons-material';
import Cookies from 'js-cookie';

// ກຳນົດ container ສຳລັບ logo
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
// ກຳນົດຄວາມກວ້າງຂອງ drawer
const drawerWidth = 240;

// ລາຍການເມນູ
const menuItems = [
    { icon: <Home />, label: 'ພາບລວມຄລິນິກ', path: '/dashboard' },
    { icon: <People />, label: 'ຂໍ້ມູນພະນັກງານ', path: '/dataemployee' },
    { icon: <People />, label: 'ຂໍ້ມູນລູກຄ້າ', path: '/datacustomer' },
    { icon: <CalendarMonth />, label: 'ຂໍ້ມູນການຈອງ', path: '/databooking' },
    { icon: <Pets />, label: 'ຝາກສັດລ້ຽງ', path: '/petboarding'},
    { icon: <Bathtub />, label: 'ອາບນ້ຳສັດລ້ຽງ', path: '/bathpet' },
    { icon: <ContentCut />, label: 'ຕັດຂົນສັດລ້ຽງ', path: '/petbar' },
    { icon: <Vaccines />, label: 'ປິ່ນປົວສັດລ້ຽງ', path: '/treatpet', active: true },
];

const TreatPet = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [treatmentData, setTreatmentData] = useState([
        { 
            id: 1, 
            petName: 'ນ້ອຍໂຕ້', 
            petType: 'ໝາ', 
            breed: 'ພັນລາບລາດໍ', 
            weight: '15.2',
            ownerName: 'ທ. ສົມຈິດ ພູເງິນ', 
            phone: '020 1234 5678',
            treatmentDate: '2025-05-05', 
            nextAppointment: '2025-05-20', 
            status: 'Completed',
            diagnosis: 'ອາການເປັນໄຂ້, ບໍ່ກິນອາຫານ',
            treatment: 'ຢາປະຕິຊີວະນະ, ຢາລົດໄຂ້',
            symptoms: 'ເປັນໄຂ້, ບໍ່ກິນອາຫານມື້ວານ, ອິດເມື່ອຍ',
            vetName: 'ດຣ. ສຸກສະຫວັນ',
            price: '350000',
            notes: 'ໃຫ້ຢາ 2 ຄັ້ງຕໍ່ມື້ ເປັນເວລາ 7 ວັນ'
        },
        { 
            id: 2, 
            petName: 'ມິກກີ້', 
            petType: 'ແມວ', 
            breed: 'ພັນເປີຊຽນ', 
            weight: '3.5',
            ownerName: 'ນ. ນິດຕະຍາ ແກ້ວມະນີ', 
            phone: '020 8765 4321',
            treatmentDate: '2025-05-07', 
            nextAppointment: '2025-05-14', 
            status: 'InProgress',
            diagnosis: 'ຄາງແຂງ, ບາດແຜທີ່ຂາ',
            treatment: 'ລ້າງບາດແຜ, ຢາຕ້ານອັກເສບ, ຢາແກ້ປວດ',
            symptoms: 'ກິນອາຫານບໍ່ໄດ້, ມີບາດແຜຢູ່ຂາຫຼັງ',
            vetName: 'ດຣ. ພົງສະຫວັນ',
            price: '280000',
            notes: 'ນັດຕິດຕາມອາການອີກ 7 ວັນ'
        },
        { 
            id: 3, 
            petName: 'ເຈຄ', 
            petType: 'ໝາ', 
            breed: 'ພັນຊິບາ', 
            weight: '12.0',
            ownerName: 'ທ. ສີສະຫວາດ ຈັນທະລາ', 
            phone: '020 5678 9012',
            treatmentDate: '2025-05-01', 
            nextAppointment: '2025-06-01', 
            status: 'Completed',
            diagnosis: 'ການສັກວັກຊີນປະຈຳປີ',
            treatment: 'ສັກວັກຊີນພິດສຸນັກບ້າ, ວັກຊີນໄຂ້ຫວັດໝາ',
            symptoms: 'ກວດສຸຂະພາບປະຈຳປີ, ບໍ່ມີອາການຜິດປົກກະຕິ',
            vetName: 'ດຣ. ພົງສະຫວັນ',
            price: '420000',
            notes: 'ນັດສັກວັກຊີນຄັ້ງຕໍ່ໄປໃນອີກ 1 ເດືອນ'
        },
        { 
            id: 4, 
            petName: 'ລີລີ່', 
            petType: 'ໝາ', 
            breed: 'ພັນພູເດີ້ນ', 
            weight: '18.3',
            ownerName: 'ນ. ມະນີລາ ສຸວັນນະສອນ', 
            phone: '020 3456 7890',
            treatmentDate: '2025-05-08', 
            nextAppointment: '2025-05-10', 
            status: 'Critical',
            diagnosis: 'ອາການເຈັບທ້ອງຮຸນແຮງ, ສົງໄສການກິນສິ່ງແປກປອມ',
            treatment: 'ການໃຫ້ນ້ຳເກືອ, ຢາຕ້ານອັກເສບ, ການກວດ X-ray',
            symptoms: 'ຮາກ, ທ້ອງເສຍ, ບໍ່ກິນອາຫານ 2 ມື້, ປວດທ້ອງ',
            vetName: 'ດຣ. ສຸກສະຫວັນ',
            price: '650000',
            notes: 'ຕ້ອງເຝົ້າຕິດຕາມອາການຢ່າງໃກ້ຊິດ, ອາດຈຳເປັນຕ້ອງຜ່າຕັດ'
        },
    ]);
    const [currentTreatment, setCurrentTreatment] = useState({ 
        petName: '', petType: '', breed: '', weight: '',
        ownerName: '', phone: '', treatmentDate: '', nextAppointment: '', 
        status: '', diagnosis: '', treatment: '', symptoms: '',
        vetName: '', price: '', notes: ''
    });
    const [selectedTreatment, setSelectedTreatment] = useState(null);

    // ຟັງຊັ່ນ handleDialog ທີ່ປັບປຸງໃຫ້ກະທັດຮັດ
    const handleDialogOpen = (treatment = null) => {
        if (treatment) {
            setCurrentTreatment(treatment);
            setEditMode(true);
        } else {
            setCurrentTreatment({ 
                petName: '', petType: '', breed: '', weight: '',
                ownerName: '', phone: '',
                treatmentDate: new Date().toISOString().split('T')[0], 
                nextAppointment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
                status: 'Scheduled', diagnosis: '', treatment: '', symptoms: '',
                vetName: '', price: '', notes: ''
            });
            setEditMode(false);
        }
        setOpenDialog(true);
    };

    const handleDetailsOpen = (treatment) => {
        setSelectedTreatment(treatment);
        setOpenDetailsDialog(true);
    };

    const handleDetailsClose = () => setOpenDetailsDialog(false);
    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const handleDialogClose = () => setOpenDialog(false);
    const handleLogout = () => navigate('/');

    // ຟັງຊັ່ນບັນທຶກຂໍ້ມູນ
    const handleSaveTreatment = () => {
        if (editMode) {
            setTreatmentData(prevData => prevData.map(item => 
                item.id === currentTreatment.id ? currentTreatment : item));
        } else {
            setTreatmentData(prevData => 
                [...prevData, { ...currentTreatment, id: prevData.length + 1 }]);
        }
        setOpenDialog(false);
    };

    // ຟັງຊັ່ນລຶບຂໍ້ມູນ
    const handleDeleteTreatment = (id) => 
        setTreatmentData(prevData => prevData.filter(item => item.id !== id));

    // ກອງຂໍ້ມູນຕາມການຄົ້ນຫາ
    const filteredData = treatmentData.filter(treatment => 
        treatment.petName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        treatment.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        treatment.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        treatment.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ຄຳນວນສະຖິຕິ
    const completedCount = treatmentData.filter(item => item.status === 'Completed').length;
    const inProgressCount = treatmentData.filter(item => item.status === 'InProgress').length;
    const criticalCount = treatmentData.filter(item => item.status === 'Critical').length;
    const scheduledCount = treatmentData.filter(item => item.status === 'Scheduled').length;
    const totalRevenue = treatmentData.reduce((sum, item) => sum + parseInt(item.price || 0), 0);

    // ຟັງຊັ່ນສຳລັບສະແດງສະຖານະ
    const getStatusInfo = (status) => {
        switch(status) {
            case 'Scheduled': return { color: 'info', label: 'ນັດໝາຍໄວ້' };
            case 'InProgress': return { color: 'warning', label: 'ກຳລັງປິ່ນປົວ' };
            case 'Completed': return { color: 'success', label: 'ສຳເລັດແລ້ວ' };
            case 'Critical': return { color: 'error', label: 'ອາການຮຸນແຮງ' };
            default: return { color: 'default', label: status };
        }
    };

    // ເນື້ອຫາຂອງແຖບເມນູ
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

            {/* ເມນູສຳລັບໂມບາຍ */}
            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
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

                {/* ເມນູສຳລັບເດສທອບ */}
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

            {/* ເນື້ອຫາຫຼັກ */}
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
                    {/* ຫົວຂໍ້ໜ້າ */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h4" fontWeight="bold" color="primary">
                            <LocalHospital sx={{ mr: 1, verticalAlign: 'middle' }} />
                            ປິ່ນປົວສັດລ້ຽງ
                        </Typography>
                    </Box>

                    {/* ຄົ້ນຫາ ແລະ ປຸ່ມເພີ່ມ */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: { xs: '100%', md: '50%' } }}>
                            <TextField
                                placeholder="ຄົ້ນຫາ..."
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />,
                                }}
                            />
                        </Box>

                        <Button
                            variant="contained"
                            sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#1565c0' } }}
                            startIcon={<AddCircle />}
                            onClick={() => handleDialogOpen()}
                        >ເພີ່ມການປິ່ນປົວ</Button>
                    </Box>

                    {/* ສະຖິຕິ */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ bgcolor: '#e8f5e9', boxShadow: 2 }}>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Typography variant="h6" color="primary" gutterBottom>ສຳເລັດແລ້ວ</Typography>
                                    <Typography variant="h4" fontWeight="bold" color="primary">
                                        {completedCount}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ bgcolor: '#fff3e0', boxShadow: 2 }}>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Typography variant="h6" color="primary" gutterBottom>ກຳລັງປິ່ນປົວ</Typography>
                                    <Typography variant="h4" fontWeight="bold" color="primary">
                                        {inProgressCount}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ bgcolor: '#ffebee', boxShadow: 2 }}>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Typography variant="h6" color="primary" gutterBottom>ອາການຮຸນແຮງ</Typography>
                                    <Typography variant="h4" fontWeight="bold" color="primary">
                                        {criticalCount}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ bgcolor: '#e3f2fd', boxShadow: 2 }}>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Typography variant="h6" color="primary" gutterBottom>ລາຍຮັບທັງໝົດ</Typography>
                                    <Typography variant="h4" fontWeight="bold" color="primary">
                                        {totalRevenue.toLocaleString()} ₭
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* ຕາຕະລາງຂໍ້ມູນ */}
                    <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#e3f2fd' }}>
                                <TableRow>
                                    <TableCell>ຊື່ສັດລ້ຽງ</TableCell>
                                    <TableCell>ຊະນິດສັດລ້ຽງ</TableCell>
                                    <TableCell>ເຈົ້າຂອງ</TableCell>
                                    <TableCell>ເບີໂທລະສັບ</TableCell>
                                    <TableCell>ວັນທີປິ່ນປົວ</TableCell>
                                    <TableCell>ການບົ່ງມະຕິ</TableCell>
                                    <TableCell>ສັດຕະວະແພດ</TableCell>
                                    <TableCell>ນັດໝາຍຄັ້ງຕໍ່ໄປ</TableCell>
                                    <TableCell>ລາຄາ</TableCell>
                                    <TableCell>ສະຖານະ</TableCell>
                                    <TableCell>ຈັດການ</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData.map((treatment) => (
                                    <TableRow key={treatment.id}>
                                        <TableCell>{treatment.petName}</TableCell>
                                        <TableCell>{treatment.petType}</TableCell>
                                        <TableCell>{treatment.ownerName}</TableCell>
                                        <TableCell>{treatment.phone}</TableCell>
                                        <TableCell>{treatment.treatmentDate}</TableCell>
                                        <TableCell>{treatment.diagnosis}</TableCell>
                                        <TableCell>{treatment.vetName}</TableCell>
                                        <TableCell>{treatment.nextAppointment}</TableCell>
                                        <TableCell>{parseInt(treatment.price).toLocaleString()} ₭</TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={getStatusInfo(treatment.status).label}
                                                color={getStatusInfo(treatment.status).color}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleDetailsOpen(treatment)} sx={{ color: '#1976d2' }}>
                                                <Info />
                                            </IconButton>
                                            <IconButton onClick={() => handleDialogOpen(treatment)} sx={{ color: '#1976d2' }}>
                                                <Edit />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteTreatment(treatment.id)} color="error">
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* ແບບຟອມເພີ່ມ/ແກ້ໄຂ */}
                    <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="md" fullWidth>
                        <DialogTitle>
                            {editMode ? 'ແກ້ໄຂຂໍ້ມູນການປິ່ນປົວສັດລ້ຽງ' : 'ເພີ່ມການປິ່ນປົວສັດລ້ຽງ'}
                        </DialogTitle>
                        <DialogContent>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="ຊື່ສັດລ້ຽງ"
                                        fullWidth
                                        value={currentTreatment.petName}
                                        onChange={(e) => setCurrentTreatment({ ...currentTreatment, petName: e.target.value })}
                                        InputProps={{
                                            startAdornment: (
                                                <PetsOutlined sx={{ color: 'action.active', mr: 1 }} />
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>ຊະນິດສັດລ້ຽງ</InputLabel>
                                        <Select
                                            value={currentTreatment.petType}
                                            onChange={(e) => setCurrentTreatment({ ...currentTreatment, petType: e.target.value })}
                                            label="ຊະນິດສັດລ້ຽງ"
                                        ></Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="ຊື່ຜູ້ນໍາເຂົ້າ"
                                        fullWidth
                                        value={currentTreatment.ownerName}
                                        onChange={(e) => setCurrentTreatment({ ...currentTreatment, ownerName: e.target.value })}
                                        InputProps={{
                                            startAdornment: (
                                                <Person sx={{ color: 'action.active', mr: 1 }} />
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="ເບີໂທ"
                                        fullWidth
                                        value={currentTreatment.phone}
                                        onChange={(e) => setCurrentTreatment({ ...currentTreatment, phone: e.target.value })}
                                        InputProps={{
                                            startAdornment: (
                                                <Phone sx={{ color: 'action.active', mr: 1 }} />
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="ວັນທີປິ່ນປົວສັດລ້ຽງ"
                                        fullWidth
                                        value={currentTreatment.treatmentDate}
                                        onChange={(e) => setCurrentTreatment({ ...currentTreatment, treatmentDate: e.target.value })}
                                        InputProps={{
                                            startAdornment: (
                                                <CalendarMonth sx={{ color: 'action.active', mr: 1 }} />
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="ປະຫວັດສັດລ້ຽງ"
                                        fullWidth
                                        value={currentTreatment.diagnosis}  
                                        onChange={(e) => setCurrentTreatment({ ...currentTreatment, diagnosis: e.target.value })}
                                        InputProps={{
                                            startAdornment: (
                                                <Description sx={{ color: 'action.active', mr: 1 }} />
                                            ),
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDialogClose}>ຍົກເລີກ</Button>
                            {/* <Button onClick={handleSave}>ບັນທຶກ</Button> */}
                        </DialogActions>
                    </Dialog>
                </Container>
            </Box>
        </Box>
    );
}
export default TreatPet;