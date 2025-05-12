import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Tabs, 
  Tab, 
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { 
  Download as DownloadIcon, 
  Print as PrintIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Pets as PetsIcon,
  MedicalServices as MedicalServicesIcon,
  ContentCut as ContentCutIcon,
  AttachMoney as AttachMoneyIcon,
  EventNote as EventNoteIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`report-tabpanel-${index}`}
      aria-labelledby={`report-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Main component
const ReportPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reportType, setReportType] = useState('daily');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleReportTypeChange = (event) => {
    setReportType(event.target.value);
  };

  const generateReport = () => {
    // Logic to generate report based on selected parameters
    console.log('Generating report', { tabValue, startDate, endDate, reportType });
  };

  // Mock data for reports
  const servicesData = [
    { id: 1, name: 'ອາບນໍ້າ', count: 145, revenue: 7250000 },
    { id: 2, name: 'ຕັດຂົນ', count: 98, revenue: 6860000 },
    { id: 3, name: 'ອາບນໍ້າ ແລະ ຕັດຂົນ', count: 210, revenue: 18900000 },
    { id: 4, name: 'ປິ່ນປົວ', count: 45, revenue: 5625000 },
  ];

  const animalsData = [
    { id: 1, type: 'ໝາ', count: 325, percentage: 65 },
    { id: 2, type: 'ແມວ', count: 143, percentage: 28.6 },
    { id: 3, type: 'ອື່ນໆ', count: 32, percentage: 6.4 },
  ];

  const dailyIncomeData = [
    { date: '10/05/2025', income: 1250000, count: 25 },
    { date: '11/05/2025', income: 1450000, count: 29 },
    { date: '12/05/2025', income: 980000, count: 18 },
  ];

  const bookingsData = [
    { id: 1, customer: 'ທ. ສົມພອນ', service: 'ຕັດຂົນ', date: '13/05/2025', time: '10:00', status: 'ລໍຖ້າ' },
    { id: 2, customer: 'ນ. ສຸກສະຫວັນ', service: 'ອາບນໍ້າ', date: '13/05/2025', time: '14:30', status: 'ຢືນຢັນ' },
    { id: 3, customer: 'ທ. ວິໄຊ', service: 'ປິ່ນປົວ', date: '14/05/2025', time: '09:15', status: 'ລໍຖ້າ' },
  ];

  const paymentsData = [
    { id: 1, customer: 'ທ. ສົມພອນ', amount: 350000, date: '10/05/2025', method: 'ເງິນສົດ' },
    { id: 2, customer: 'ນ. ສຸກສະຫວັນ', amount: 450000, date: '11/05/2025', method: 'ໂອນເງິນ' },
    { id: 3, customer: 'ທ. ວິໄຊ', amount: 750000, date: '12/05/2025', method: 'BCEL ONE' },
  ];

  // Filter options
  const filterSection = (
    <Box sx={{ mb: 4, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>ປະເພດລາຍງານ</InputLabel>
            <Select
              value={reportType}
              label="ປະເພດລາຍງານ"
              onChange={handleReportTypeChange}
            >
              <MenuItem value="daily">ປະຈໍາວັນ</MenuItem>
              <MenuItem value="weekly">ປະຈໍາອາທິດ</MenuItem>
              <MenuItem value="monthly">ປະຈໍາເດືອນ</MenuItem>
              <MenuItem value="yearly">ປະຈໍາປີ</MenuItem>
              <MenuItem value="custom">ກໍານົດເອງ</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker 
              label="ວັນທີເລີ່ມຕົ້ນ"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              renderInput={(params) => <TextField {...params} size="small" fullWidth />}
              slotProps={{ textField: { size: 'small', fullWidth: true } }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="ວັນທີສິ້ນສຸດ"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              renderInput={(params) => <TextField {...params} size="small" fullWidth />}
              slotProps={{ textField: { size: 'small', fullWidth: true } }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button 
            variant="contained" 
            fullWidth
            onClick={generateReport}
          >
            ສ້າງລາຍງານ
          </Button>
        </Grid>
        <Grid item xs={12} md={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
            <IconButton color="primary" aria-label="download report">
              <DownloadIcon />
            </IconButton>
            <IconButton color="primary" aria-label="print report">
              <PrintIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 3, mb: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          ລາຍງານ
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          ເບິ່ງລາຍງານປະເພດຕ່າງໆ ແລະ ສະຖິຕິສໍາລັບການຕັດສິນໃຈ
        </Typography>

        <Paper sx={{ width: '100%', mt: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<BarChartIcon />} iconPosition="start" label="ປະເພດບໍລິການ" />
            <Tab icon={<PieChartIcon />} iconPosition="start" label="ລາຍງານບໍລິການ" />
            <Tab icon={<PetsIcon />} iconPosition="start" label="ລາຍງານກົງສັດ" />
            <Tab icon={<ContentCutIcon />} iconPosition="start" label="ຈໍານວນສັດຕັດຂົນ" />
            <Tab icon={<MedicalServicesIcon />} iconPosition="start" label="ການປິ່ນປົວ" />
            <Tab icon={<AttachMoneyIcon />} iconPosition="start" label="ລາຍຮັບປະຈໍາວັນ" />
            <Tab icon={<EventNoteIcon />} iconPosition="start" label="ການຈອງນໍາໃຊ້ບໍລິການ" />
            <Tab icon={<ReceiptIcon />} iconPosition="start" label="ການຊໍາລະເງິນ" />
          </Tabs>

          {filterSection}

          {/* Service Type Report */}
          <TabPanel value={tabValue} index={0}>
            <Box>
              <Typography variant="h6" gutterBottom>
                ລາຍງານປະເພດບໍລິການ
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ລໍາດັບ</TableCell>
                          <TableCell>ປະເພດບໍລິການ</TableCell>
                          <TableCell align="right">ຈໍານວນ</TableCell>
                          <TableCell align="right">ລາຍຮັບ (ກີບ)</TableCell>
                          <TableCell align="right">ເປີເຊັນ</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {servicesData.map((row, index) => (
                          <TableRow key={row.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell align="right">{row.count}</TableCell>
                            <TableCell align="right">{row.revenue.toLocaleString()}</TableCell>
                            <TableCell align="right">
                              {Math.round(row.revenue / servicesData.reduce((acc, curr) => acc + curr.revenue, 0) * 100)}%
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={2} align="right" sx={{ fontWeight: 'bold' }}>ລວມ</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                            {servicesData.reduce((acc, curr) => acc + curr.count, 0)}
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                            {servicesData.reduce((acc, curr) => acc + curr.revenue, 0).toLocaleString()}
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>100%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'center',
                      alignItems: 'center',
                      p: 2 
                    }}
                    variant="outlined"
                  >
                    <Typography variant="subtitle1" gutterBottom>
                      ແຜນວາດປະເພດບໍລິການ
                    </Typography>
                    <Box sx={{ mt: 2, width: '100%', height: 250, bgcolor: '#f5f5f5', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <PieChartIcon sx={{ fontSize: 100, color: '#bdbdbd' }} />
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>

          {/* Services Report */}
          <TabPanel value={tabValue} index={1}>
            <Box>
              <Typography variant="h6" gutterBottom>
                ລາຍງານບໍລິການ
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ລໍາດັບ</TableCell>
                          <TableCell>ຊື່ບໍລິການ</TableCell>
                          <TableCell align="right">ຈໍານວນການນໍາໃຊ້</TableCell>
                          <TableCell align="right">ລາຄາ (ກີບ)</TableCell>
                          <TableCell align="right">ລວມລາຍຮັບ (ກີບ)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {servicesData.map((row, index) => (
                          <TableRow key={row.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell align="right">{row.count}</TableCell>
                            <TableCell align="right">{Math.round(row.revenue / row.count).toLocaleString()}</TableCell>
                            <TableCell align="right">{row.revenue.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>

          {/* Animals Report */}
          <TabPanel value={tabValue} index={2}>
            <Box>
              <Typography variant="h6" gutterBottom>
                ລາຍງານກົງສັດ
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ລໍາດັບ</TableCell>
                          <TableCell>ປະເພດສັດ</TableCell>
                          <TableCell align="right">ຈໍານວນ</TableCell>
                          <TableCell align="right">ເປີເຊັນ</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {animalsData.map((row, index) => (
                          <TableRow key={row.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{row.type}</TableCell>
                            <TableCell align="right">{row.count}</TableCell>
                            <TableCell align="right">{row.percentage}%</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={2} align="right" sx={{ fontWeight: 'bold' }}>ລວມ</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                            {animalsData.reduce((acc, curr) => acc + curr.count, 0)}
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>100%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'center',
                      alignItems: 'center',
                      p: 2 
                    }}
                    variant="outlined"
                  >
                    <Typography variant="subtitle1" gutterBottom>
                      ແຜນວາດປະເພດສັດ
                    </Typography>
                    <Box sx={{ mt: 2, width: '100%', height: 250, bgcolor: '#f5f5f5', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <PieChartIcon sx={{ fontSize: 100, color: '#bdbdbd' }} />
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>

          {/* Grooming Report */}
          <TabPanel value={tabValue} index={3}>
            <Box>
              <Typography variant="h6" gutterBottom>
                ລາຍງານຈໍານວນສັດຕັດຂົນທັງຫມົດ
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                              ຈໍານວນການຕັດຂົນທັງຫມົດ
                            </Typography>
                            <Typography variant="h3">
                              308
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              ເພີ່ມຂຶ້ນ 12% ຈາກເດືອນທີ່ຜ່ານມາ
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                              ປະເພດສັດຕັດຂົນຫຼາຍທີ່ສຸດ
                            </Typography>
                            <Typography variant="h3">
                              ໝາ
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              ກວມເອົາ 78% ຂອງການຕັດຂົນທັງຫມົດ
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                              ລາຍຮັບຈາກການຕັດຂົນ
                            </Typography>
                            <Typography variant="h3">
                              25,760,000
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              ກີບ (ເພີ່ມຂຶ້ນ 8% ຈາກເດືອນທີ່ຜ່ານມາ)
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper 
                    sx={{ 
                      p: 2,
                      height: 300,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                    variant="outlined"
                  >
                    <Typography variant="subtitle1" gutterBottom>
                      ສະຖິຕິການຕັດຂົນຕາມເດືອນ
                    </Typography>
                    <Box sx={{ mt: 2, width: '100%', height: 200, bgcolor: '#f5f5f5', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <BarChartIcon sx={{ fontSize: 100, color: '#bdbdbd' }} />
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>

          {/* Treatment Report */}
          <TabPanel value={tabValue} index={4}>
            <Box>
              <Typography variant="h6" gutterBottom>
                ລາຍງານການປິ່ນປົວທັງຫມົດ
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        ຈໍານວນການປິ່ນປົວທັງຫມົດ
                      </Typography>
                      <Typography variant="h3">
                        45
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        ໃນເດືອນນີ້
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        ປະເພດການປິ່ນປົວທີ່ພົບຫຼາຍທີ່ສຸດ
                      </Typography>
                      <Typography variant="h3">
                        ວັກຊີນ
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        ກວມເອົາ 40% ຂອງການປິ່ນປົວທັງຫມົດ
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        ລາຍຮັບຈາກການປິ່ນປົວ
                      </Typography>
                      <Typography variant="h3">
                        5,625,000
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        ກີບ
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ລໍາດັບ</TableCell>
                          <TableCell>ປະເພດການປິ່ນປົວ</TableCell>
                          <TableCell align="right">ຈໍານວນ</TableCell>
                          <TableCell align="right">ລາຄາສະເລ່ຍ (ກີບ)</TableCell>
                          <TableCell align="right">ລວມເງິນ (ກີບ)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>1</TableCell>
                          <TableCell>ວັກຊີນປ້ອງກັນພະຍາດ</TableCell>
                          <TableCell align="right">18</TableCell>
                          <TableCell align="right">125,000</TableCell>
                          <TableCell align="right">2,250,000</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>2</TableCell>
                          <TableCell>ກວດສຸຂະພາບທົ່ວໄປ</TableCell>
                          <TableCell align="right">12</TableCell>
                          <TableCell align="right">75,000</TableCell>
                          <TableCell align="right">900,000</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>3</TableCell>
                          <TableCell>ການຮັກສາບາດແຜ</TableCell>
                          <TableCell align="right">8</TableCell>
                          <TableCell align="right">150,000</TableCell>
                          <TableCell align="right">1,200,000</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>4</TableCell>
                          <TableCell>ການຮັກສາໂລກຜິວໜັງ</TableCell>
                          <TableCell align="right">7</TableCell>
                          <TableCell align="right">175,000</TableCell>
                          <TableCell align="right">1,225,000</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>

          {/* Daily Income Report */}
          <TabPanel value={tabValue} index={5}>
            <Box>
              <Typography variant="h6" gutterBottom>
                ລາຍງານລາຍຮັບປະຈໍາວັນ
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ລໍາດັບ</TableCell>
                          <TableCell>ວັນທີ</TableCell>
                          <TableCell align="right">ຈໍານວນລູກຄ້າ</TableCell>
                          <TableCell align="right">ລາຍຮັບ (ກີບ)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dailyIncomeData.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{row.date}</TableCell>
                            <TableCell align="right">{row.count}</TableCell>
                            <TableCell align="right">{row.income.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={2} align="right" sx={{ fontWeight: 'bold' }}>ລວມ</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                            {dailyIncomeData.reduce((acc, curr) => acc + curr.count, 0)}
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                            {dailyIncomeData.reduce((acc, curr) => acc + curr.income, 0).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'center',
                      alignItems: 'center',
                      p: 2 
                    }}
                    variant="outlined"
                  >
                    <Typography variant="subtitle1" gutterBottom>
                      ແຜນວາດລາຍຮັບປະຈໍາວັນ
                    </Typography>
                    <Box sx={{ mt: 2, width: '100%', height: 250, bgcolor: '#f5f5f5', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <BarChartIcon sx={{ fontSize: 100, color: '#bdbdbd' }} />
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>

          {/* Booking Report */}
          <TabPanel value={tabValue} index={6}>
            <Box>
              <Typography variant="h6" gutterBottom>
                ລາຍງານຈອງນໍາໃຊ້ບໍລິການ
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        ຈໍານວນການຈອງທັງຫມົດ
                      </Typography>
                      <Typography variant="h3">
                        28
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        ສໍາລັບອາທິດນີ້
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        ສະຖານະການຈອງ
                      </Typography>
                      <Typography variant="h3">
                        18
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        ຢືນຢັນແລ້ວ (64%)
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        ບໍລິການຈອງຫຼາຍທີ່ສຸດ
                      </Typography>
                      <Typography variant="h3">
                        ຕັດຂົນ
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        ກວມເອົາ 45% ຂອງການຈອງທັງຫມົດ
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ລໍາດັບ</TableCell>
                          <TableCell>ລູກຄ້າ</TableCell>
                          <TableCell>ບໍລິການ</TableCell>
                          <TableCell>ວັນທີ</TableCell>
                          <TableCell>ເວລາ</TableCell>
                          <TableCell>ສະຖານະ</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {bookingsData.map((row, index) => (
                          <TableRow key={row.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{row.customer}</TableCell>
                            <TableCell>{row.service}</TableCell>
                            <TableCell>{row.date}</TableCell>
                            <TableCell>{row.time}</TableCell>
                            <TableCell>
                              <Box
                                sx={{
                                  bgcolor: row.status === 'ຢືນຢັນ' ? '#e8f5e9' : '#fff8e1',
                                  color: row.status === 'ຢືນຢັນ' ? '#2e7d32' : '#f57f17',
                                  borderRadius: 1,
                                  px: 1.5,
                                  py: 0.5,
                                  display: 'inline-block'
                                }}
                              >
                                {row.status}
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>

          {/* Payment Report */}
          <TabPanel value={tabValue} index={7}>
            <Box>
              <Typography variant="h6" gutterBottom>
                ລາຍງານການຊໍາລະເງິນ
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        ຈໍານວນການຊໍາລະທັງຫມົດ
                      </Typography>
                      <Typography variant="h3">
                        72
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        ໃນເດືອນນີ້
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        ວິທີການຊໍາລະທີ່ນິຍົມ
                      </Typography>
                      <Typography variant="h3">
                        BCEL ONE
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        ກວມເອົາ 45% ຂອງການຊໍາລະທັງຫມົດ
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        ລາຍຮັບທັງຫມົດ
                      </Typography>
                      <Typography variant="h3">
                        38,635,000
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        ກີບ
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={8}>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ລໍາດັບ</TableCell>
                          <TableCell>ລູກຄ້າ</TableCell>
                          <TableCell align="right">ຈໍານວນເງິນ (ກີບ)</TableCell>
                          <TableCell>ວັນທີ</TableCell>
                          <TableCell>ວິທີການຊໍາລະ</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paymentsData.map((row, index) => (
                          <TableRow key={row.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{row.customer}</TableCell>
                            <TableCell align="right">{row.amount.toLocaleString()}</TableCell>
                            <TableCell>{row.date}</TableCell>
                            <TableCell>{row.method}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={2} align="right" sx={{ fontWeight: 'bold' }}>ລວມ</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                            {paymentsData.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                          </TableCell>
                          <TableCell colSpan={2}></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'center',
                      alignItems: 'center',
                      p: 2 
                    }}
                    variant="outlined"
                  >
                    <Typography variant="subtitle1" gutterBottom>
                      ວິທີການຊໍາລະ
                    </Typography>
                    <Box sx={{ mt: 2, width: '100%', height: 200, bgcolor: '#f5f5f5', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <PieChartIcon sx={{ fontSize: 100, color: '#bdbdbd' }} />
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
};

export default ReportPage;