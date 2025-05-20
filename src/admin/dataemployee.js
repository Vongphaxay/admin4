import LockIcon from '@mui/icons-material/Lock';
import { DialogContent, InputAdornment } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import WcIcon from '@mui/icons-material/Wc';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, CssBaseline, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Grid, Button, Avatar, Dialog, DialogActions, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, MenuItem, Select, InputLabel, FormControl, useTheme, styled, Container
} from '@mui/material';
import {
    Edit, Delete, AddCircle, Home, Person, People, CalendarMonth, Pets, Bathtub, ContentCut, Vaccines, Menu, ChevronRight, Notifications, Close, Logout, Phone, Email, Work
} from '@mui/icons-material';
import Cookies from 'js-cookie';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { GetAllEmp } from '../services/report.service';

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
    { icon: <People />, label: 'ຂໍ້ມູນພະນັກງານ', path: '/dataemployee', active: true },
    { icon: <People />, label: 'ຂໍ້ມູນລູກຄ້າ', path: '/datacustomer' },
    { icon: <CalendarMonth />, label: 'ຂໍ້ມູນການຈອງ', path: '/databooking' },
    { icon: <Pets />, label: 'ຝາກສັດລ້ຽງ', path: '/petboarding' },
    { icon: <Bathtub />, label: 'ອາບນ້ຳສັດລ້ຽງ', path: '/bathpet' },
    { icon: <ContentCut />, label: 'ຕັດຂົນສັດລ້ຽງ', path: '/petbar' },
    { icon: <Vaccines />, label: 'ປິ່ນປົວສັດລ້ຽງ', path: '/treatpet' },
];

const EmployeeManagement = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [employeeData, setEmployeeData] = useState([]);
    const [currentEmployee, setCurrentEmployee] = useState({});
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("ບັນທຶກສຳເລັດ");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    // Add state for delete confirmation dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);

    useEffect(() => {
        const getReportAllempapi = async () => {
            const res = await GetAllEmp(accessToken);

            const mappedData = res.report.map((item) => ({
                id: item.doc_id,
                docname: item.doc_name,
                empname: item.emp_name,
                position: item.position,
                phone: item.phone,
                gender: item.gender,
                address: item.address,
                tel: item.tel,
                username: item.username,
                status: item.status
            }))
            setEmployeeData(mappedData);
            console.log(res);
        }
        getReportAllempapi();
    }, [accessToken]);
    const fieldKey = currentEmployee.docname !== undefined ? 'docname' : 'empname';

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpenSnackbar(false);
    };

    const handleDialogOpen = (employee = null) => {
        if (employee) {
            setCurrentEmployee(employee);
            setEditMode(true);
        } else {
            setCurrentEmployee({
                name: '',
                position: '',
                phone: '',
                gender: '',
                address: '',
                tel: '',
                username: '',
                password: '',
                status: ''
            });
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

    const handleSaveEmployee = () => {
        if (editMode) {
            setEmployeeData(prevData => prevData.map(item => item.id === currentEmployee.id ? currentEmployee : item));
        } else {
            setEmployeeData(prevData => [...prevData, { ...currentEmployee, id: prevData.length + 1 }]);
        }
        setSnackbarMessage("ບັນທຶກສຳເລັດ");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        setOpenDialog(false);
    };

    // Updated delete handling functions
    const handleDeleteConfirmation = (employee) => {
        setEmployeeToDelete(employee);
        setDeleteDialogOpen(true);
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setEmployeeToDelete(null);
    };

    const handleConfirmDelete = () => {
        if (employeeToDelete) {
            const nameToDelete = employeeToDelete.docname || employeeToDelete.empname;

            if (nameToDelete) {
                console.log("Deleting person with name:", nameToDelete);

                setEmployeeData(prevData =>
                    prevData.filter(item =>
                        (item.docname || item.empname) !== nameToDelete
                    )
                );

                setSnackbarMessage("ລຶບຂໍ້ມູນສຳເລັດ");
                setSnackbarSeverity("success");
                setOpenSnackbar(true);
            } else {
                console.warn("No valid name to delete:", employeeToDelete);
            }
        } else {
            console.warn("employeeToDelete is null");
        }

        setDeleteDialogOpen(false);
        setEmployeeToDelete(null);
    };



    const handleLogout = () => {
        navigate('/');
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
                        <Typography variant="h4" fontWeight="bold" color="primary">ຂໍ້ມູນພະນັກງານ</Typography>
                    </Box>

                    <Button
                        variant="contained"
                        sx={{ mb: 3, bgcolor: '#1976d2', '&:hover': { bgcolor: '#1565c0' } }}
                        startIcon={<AddCircle />}
                        onClick={() => handleDialogOpen()}
                    >ເພີ່ມພະນັກງານ</Button>

                    <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
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
                                {employeeData.map((employee) => (
                                    <TableRow key={employee.id}>
                                        <TableCell>{employee.docname || employee.empname}</TableCell>
                                        <TableCell>{employee.gender}</TableCell>
                                        <TableCell>{employee.address}</TableCell>
                                        <TableCell>{employee.tel}</TableCell>
                                        <TableCell>{employee.username}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleDialogOpen(employee)} sx={{ color: '#1976d2' }}><Edit /></IconButton>
                                            <IconButton onClick={() => handleDeleteConfirmation(employee)} color="error"><Delete /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Employee Add/Edit Dialog */}
                    <Dialog open={openDialog} onClose={handleDialogClose}>
                        <DialogTitle>{editMode ? 'ແກ້ໄຂຂໍ້ມູນພະນັກງານ' : 'ເພີ່ມພະນັກງານ'}</DialogTitle>
                        <DialogContent>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="ຊື່ ແລະ ນາມສະກຸນ"
                                        fullWidth
                                        value={currentEmployee.docname || currentEmployee.empname || ''}
                                        onChange={(e) => setCurrentEmployee({ ...currentEmployee, [fieldKey]: e.target.value })}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PersonIcon sx={{ color: 'action.active' }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel id="position-select-label">ຕຳແໜ່ງ</InputLabel>
                                        <Select
                                            labelId="position-select-label"
                                            id="position-select"
                                            value={currentEmployee.position || ''}
                                            label="ຕຳແໜ່ງ"
                                            onChange={(e) => setCurrentEmployee({ ...currentEmployee, position: e.target.value })}
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    <Work sx={{ color: 'action.active' }} />
                                                </InputAdornment>
                                            }
                                            sx={{ width: '100%', height: '56px' }}
                                        >
                                            <MenuItem value="ຊ່າງຕັດຂົນ">ຊ່າງຕັດຂົນ</MenuItem>
                                            <MenuItem value="ທ່ານໝໍ">ທ່ານໝໍ</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="ເພດ"
                                        fullWidth
                                        value={currentEmployee.gender}
                                        onChange={(e) => setCurrentEmployee({ ...currentEmployee, gender: e.target.value })}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <WcIcon sx={{ color: 'action.active' }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="ທີ່ຢູ່"
                                        fullWidth
                                        value={currentEmployee.address}
                                        onChange={(e) => setCurrentEmployee({ ...currentEmployee, address: e.target.value })}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <HomeIcon sx={{ color: 'action.active' }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="ເບີໂທລະສັບ"
                                        type="tel"
                                        fullWidth
                                        value={currentEmployee.tel}
                                        onChange={(e) => setCurrentEmployee({ ...currentEmployee, tel: e.target.value })}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PhoneIcon sx={{ color: 'action.active' }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="ຊື່ຜູ້ໃຊ້"
                                        fullWidth
                                        value={currentEmployee.username}
                                        onChange={(e) => setCurrentEmployee({ ...currentEmployee, username: e.target.value })}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AccountCircleIcon sx={{ color: 'action.active' }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="ລະຫັດຜ່ານ"
                                        type="password"
                                        fullWidth
                                        value={currentEmployee.password}
                                        onChange={(e) => setCurrentEmployee({ ...currentEmployee, password: e.target.value })}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockIcon sx={{ color: 'action.active' }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDialogClose} color="error">ຍົກເລີກ</Button>
                            <Button onClick={handleSaveEmployee} sx={{ bgcolor: '#1976d2', color: 'white', '&:hover': { bgcolor: '#1565c0' } }}>ບັນທຶກ</Button>
                        </DialogActions>
                    </Dialog>

                    {/* Delete Confirmation Dialog */}
                    <Dialog
                        open={deleteDialogOpen}
                        onClose={handleCancelDelete}
                        PaperProps={{
                            sx: {
                                borderRadius: 2,
                                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                minWidth: '400px'
                            }
                        }}
                    >
                        <DialogTitle sx={{
                            bgcolor: '#d32f2f',
                            color: 'white',
                            px: 3,
                            py: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <Delete fontSize="medium" />
                            ຢືນຢັນການລົບຂໍ້ມູນພະນັກງານ
                        </DialogTitle>
                        <DialogContent sx={{ p: 3, mt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar sx={{ bgcolor: '#ffebee', color: '#d32f2f', mr: 2 }}>
                                    <Person fontSize="medium" />
                                </Avatar>
                                <Typography variant="h6">
                                    {employeeToDelete ? (employeeToDelete.docname || employeeToDelete.empname) : ''}
                                </Typography>
                            </Box>
                            <Typography sx={{ color: 'text.secondary', mb: 1 }}>
                                ທ່ານກຳລັງຈະລົບຂໍ້ມູນພະນັກງານນີ້ອອກຈາກລະບົບ
                            </Typography>
                            <Typography sx={{
                                bgcolor: '#fffde7',
                                p: 2,
                                borderRadius: 1,
                                color: '#ff6d00',
                                borderLeft: '4px solid #ff6d00',
                                fontSize: '0.9rem'
                            }}>
                                <b>ໝາຍເຫດ:</b> ການດຳເນີນການນີ້ບໍ່ສາມາດຍົກເລີກໄດ້ ແລະ ຂໍ້ມູນທັງໝົດຂອງພະນັກງານຄົນນີ້ຈະຖືກລົບອອກຈາກລະບົບຖາວອນ
                            </Typography>
                        </DialogContent>
                        <DialogActions sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                            <Button
                                onClick={handleCancelDelete}
                                sx={{
                                    bgcolor: '#e0e0e0',
                                    color: 'text.primary',
                                    px: 3,
                                    '&:hover': { bgcolor: '#bdbdbd' }
                                }}
                            >
                                ຍົກເລີກ
                            </Button>
                            <Button
                                onClick={handleConfirmDelete}
                                variant="contained"
                                color="error"
                                startIcon={<Delete />}
                                sx={{
                                    px: 3,
                                    bgcolor: '#d32f2f',
                                    '&:hover': { bgcolor: '#b71c1c' }
                                }}
                            >
                                ຢືນຢັນການລົບ
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Snackbar for notifications */}
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

export default EmployeeManagement;