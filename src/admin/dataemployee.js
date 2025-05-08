import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    CssBaseline,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Grid,
    Button,
    Avatar,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    useTheme,
    styled,
    Container
} from '@mui/material';
import {
    Edit,
    Delete,
    AddCircle,
    Home,
    Person,
    People,
    CalendarMonth,
    Pets,
    Bathtub, 
    ContentCut,
    Vaccines,
    Menu,
    ChevronRight,
    Notifications,
    Close,
    Logout,
    Phone,
    Email,
    Work
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
    { icon: <People />, label: 'ຂໍ້ມູນພະນັກງານ', path: '/dataemployee', active: true },
    { icon: <People />, label: 'ຂໍ້ມູນລູກຄ້າ', path: '/datacustomer' },
    { icon: <CalendarMonth />, label: 'ຂໍ້ມູນການຈອງ', path: '/databooking' },
    { icon: <Pets />, label: 'ຝາກສັດລ້ຽງ', path: '/petboarding'},
    { icon: <Bathtub />, label: 'ອາບນ້ຳສັດລ້ຽງ', path: '/bathpet'},
    { icon: <ContentCut />, label: 'ຕັດຂົນສັດລ້ຽງ', path: '/petbar'},
    { icon: <Vaccines />, label: 'ປິ່ນປົວສັດລ້ຽງ'},
];

const EmployeeManagement = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [employeeData, setEmployeeData] = useState([
        { id: 1, name: 'ທ. ສົມສະໄໝ ພອນວິໄລ', position: 'ສັດຕະວະແພດ', phone: '020 1234 5678', email: 'somsamai@drpvet.la', status: 'Active' },
        { id: 2, name: 'ນ. ມະນີຈັນ ວົງສະວົງ', position: 'ພະຍາບານ', phone: '020 2345 6789', email: 'manychan@drpvet.la', status: 'Active' },
        { id: 3, name: 'ທ. ສົມພອນ ພູມີໄຊ', position: 'ຜູ້ຊ່ວຍສັດຕະວະແພດ', phone: '020 3456 7890', email: 'somphon@drpvet.la', status: 'Leave' },
    ]);
    const [currentEmployee, setCurrentEmployee] = useState({ name: '', position: '', phone: '', email: '', status: '' });

    const handleDialogOpen = (employee = null) => {
        if (employee) {
            setCurrentEmployee(employee);
            setEditMode(true);
        } else {
            setCurrentEmployee({ name: '', position: '', phone: '', email: '', status: '' });
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
        setOpenDialog(false);
    };

    const handleDeleteEmployee = (id) => setEmployeeData(prevData => prevData.filter(item => item.id !== id));

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
                                    <TableCell>ຕຳແໜ່ງ</TableCell>
                                    <TableCell>ເບີໂທລະສັບ</TableCell>
                                    <TableCell>ອີເມວ</TableCell>
                                    <TableCell>ສະຖານະ</TableCell>
                                    <TableCell>ຈັດການ</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {employeeData.map((employee) => (
                                    <TableRow key={employee.id}>
                                        <TableCell>{employee.name}</TableCell>
                                        <TableCell>{employee.position}</TableCell>
                                        <TableCell>{employee.phone}</TableCell>
                                        <TableCell>{employee.email}</TableCell>
                                        <TableCell>{employee.status === 'Active' ? 'ເຮັດວຽກຢູ່' : employee.status === 'Leave' ? 'ພັກວຽກ' : employee.status === 'Resigned' ? 'ລາອອກ' : employee.status}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleDialogOpen(employee)} sx={{ color: '#1976d2' }}><Edit /></IconButton>
                                            <IconButton onClick={() => handleDeleteEmployee(employee.id)} color="error"><Delete /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Dialog open={openDialog} onClose={handleDialogClose}>
                        <DialogTitle>{editMode ? 'ແກ້ໄຂຂໍ້ມູນພະນັກງານ' : 'ເພີ່ມພະນັກງານ'}</DialogTitle>
                        <DialogContent>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="ຊື່ ແລະ ນາມສະກຸນ"
                                        fullWidth
                                        value={currentEmployee.name}
                                        onChange={(e) => setCurrentEmployee({ ...currentEmployee, name: e.target.value })}
                                        InputProps={{
                                            startAdornment: (
                                                <Person sx={{ color: 'action.active', mr: 1 }} />
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="ຕຳແໜ່ງ"
                                        fullWidth
                                        value={currentEmployee.position}
                                        onChange={(e) => setCurrentEmployee({ ...currentEmployee, position: e.target.value })}
                                        InputProps={{
                                            startAdornment: (
                                                <Work sx={{ color: 'action.active', mr: 1 }} />
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="ເບີໂທລະສັບ"
                                        fullWidth
                                        value={currentEmployee.phone}
                                        onChange={(e) => setCurrentEmployee({ ...currentEmployee, phone: e.target.value })}
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
                                        value={currentEmployee.email}
                                        onChange={(e) => setCurrentEmployee({ ...currentEmployee, email: e.target.value })}
                                        InputProps={{
                                            startAdornment: (
                                                <Email sx={{ color: 'action.active', mr: 1 }} />
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>ສະຖານະ</InputLabel>
                                        <Select
                                            value={currentEmployee.status}
                                            onChange={(e) => setCurrentEmployee({ ...currentEmployee, status: e.target.value })}
                                            label="ສະຖານະ"
                                        >
                                            <MenuItem value="Active">ເຮັດວຽກຢູ່</MenuItem>
                                            <MenuItem value="Leave">ພັກວຽກ</MenuItem>
                                            <MenuItem value="Resigned">ລາອອກ</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDialogClose} color="error">ຍົກເລີກ</Button>
                            <Button onClick={handleSaveEmployee} sx={{ bgcolor: '#1976d2', color: 'white', '&:hover': { bgcolor: '#1565c0' } }}>ບັນທຶກ</Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </Box>
        </Box>
    );
};

export default EmployeeManagement;