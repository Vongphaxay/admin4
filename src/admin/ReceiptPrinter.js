import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Grid, Divider } from '@mui/material';
import { Print, Close } from '@mui/icons-material';

const ReceiptPrinter = ({ open, onClose, booking }) => {
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('lo-LA', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Current date and time for receipt
  const currentDate = new Date();
  const formattedDateTime = currentDate.toLocaleString('lo-LA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Generate receipt number (timestamp-based)
  const receiptNumber = `DRPVET-${currentDate.getFullYear()}${(currentDate.getMonth() + 1).toString().padStart(2, '0')}${currentDate.getDate().toString().padStart(2, '0')}-${currentDate.getTime().toString().slice(-4)}`;

  const handlePrint = () => {
    const printContent = document.getElementById('receipt-content');
    const originalContents = document.body.innerHTML;
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=600,height=600');
    
    // Create receipt content with styling
    const receiptContent = `
      <!DOCTYPE html>
      <html lang="lo">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ໃບບິນການຊຳລະເງິນ</title>
        <style>
          @page {
            size: 80mm 210mm; /* Standard thermal receipt size */
            margin: 5mm;
          }
          body {
            font-family: 'Phetsarath OT', 'Saysettha OT', 'Noto Sans Lao', sans-serif;
            font-size: 12px;
            line-height: 1.4;
            margin: 0;
            padding: 10px;
          }
          .receipt {
            width: 100%;
            max-width: 300px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            margin-bottom: 15px;
          }
          .logo {
            font-weight: bold;
            font-size: 18px;
            margin-bottom: 5px;
          }
          .contact {
            font-size: 11px;
            margin-bottom: 5px;
          }
          .title {
            font-weight: bold;
            font-size: 16px;
            margin: 15px 0;
            text-align: center;
            border-top: 1px dashed #000;
            border-bottom: 1px dashed #000;
            padding: 5px 0;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
          }
          .info-label {
            font-weight: bold;
          }
          .separator {
            border-top: 1px dashed #000;
            margin: 10px 0;
          }
          .service-details {
            margin: 15px 0;
          }
          .total-row {
            font-weight: bold;
            font-size: 14px;
            margin-top: 10px;
            text-align: right;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 11px;
          }
          .qr-message {
            margin-top: 15px;
            font-size: 10px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <div class="logo">DR. P VETERINARY CLINIC</div>
            <div class="contact">ທີ່ຢູ່: ຕາດຂາວ, ສີສັດຕະນາກ, ນະຄອນຫຼວງວຽງຈັນ</div>
            <div class="contact">ໂທ: 020 XXXXXXXX</div>
          </div>
          
          <div class="title">ໃບບິນການຊຳລະເງິນ</div>
          
          <div class="info-row">
            <span class="info-label">ເລກທີໃບບິນ:</span>
            <span>${receiptNumber}</span>
          </div>
          <div class="info-row">
            <span class="info-label">ວັນທີ:</span>
            <span>${formattedDateTime}</span>
          </div>
          
          <div class="separator"></div>
          
          <div class="info-row">
            <span class="info-label">ຊື່ລູກຄ້າ:</span>
            <span>${booking.customerName || '-'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">ຊື່ສັດລ້ຽງ:</span>
            <span>${booking.petName || '-'}</span>
          </div>
          
          <div class="separator"></div>
          
          <div class="service-details">
            <div class="info-row">
              <span class="info-label">ບໍລິການ:</span>
              <span>${booking.service || '-'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">ວັນທີເລີ່ມ:</span>
              <span>${formatDate(booking.start_date)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">ວັນທີສິ້ນສຸດ:</span>
              <span>${formatDate(booking.stop_date)}</span>
            </div>
          </div>
          
          <div class="separator"></div>
          
          <div class="total-row">
            <span class="info-label">ລວມເງິນ:</span>
            <span>${Number(booking.total).toLocaleString('lo-LA')} ກີບ</span>
          </div>
          
          <div class="separator"></div>
          
          <div class="footer">
            <p>ຂອບໃຈທີ່ໃຊ້ບໍລິການ DR. P VETERINARY CLINIC</p>
            <p>ພວກເຮົາດູແລສັດລ້ຽງຂອງທ່ານດ້ວຍຄວາມຮັກ</p>
          </div>
          
          <div class="qr-message">
            ຫາກມີຂໍ້ສະງົນໃດໆ ສາມາດສະແກນ QR ໄດ້ທີ່ໜ້າຮ້ານ ຫຼື ໂທ: 020 XXXXXXXX
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Write content to the new window and print
    printWindow.document.write(receiptContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Print after a short delay to ensure content is loaded
    setTimeout(() => {
      printWindow.print();
      // Don't close window to allow user to select printer options
    }, 500);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold' }}>
        ພິມໃບບິນ
      </DialogTitle>
      
      <DialogContent>
        <Box id="receipt-content" sx={{ mt: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
          {/* Receipt Header */}
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              DR. P VETERINARY CLINIC
            </Typography>
            <Typography variant="body2">
              ທີ່ຢູ່: ຕາດຂາວ, ສີສັດຕະນາກ, ນະຄອນຫຼວງວຽງຈັນ
            </Typography>
            <Typography variant="body2">
              ໂທ: 020 XXXXXXXX
            </Typography>
          </Box>
          
          <Divider sx={{ my: 1, borderStyle: 'dashed' }} />
          
          <Typography variant="h6" fontWeight="bold" textAlign="center" sx={{ my: 1 }}>
            ໃບບິນການຊຳລະເງິນ
          </Typography>
          
          <Divider sx={{ my: 1, borderStyle: 'dashed' }} />
          
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="body2" fontWeight="bold">ເລກທີໃບບິນ:</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" textAlign="right">{receiptNumber}</Typography>
            </Grid>
            
            <Grid item xs={6}>
              <Typography variant="body2" fontWeight="bold">ວັນທີ:</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" textAlign="right">{formattedDateTime}</Typography>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 1, borderStyle: 'dashed' }} />
          
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="body2" fontWeight="bold">ຊື່ລູກຄ້າ:</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" textAlign="right">{booking.customerName || '-'}</Typography>
            </Grid>
            
            <Grid item xs={6}>
              <Typography variant="body2" fontWeight="bold">ຊື່ສັດລ້ຽງ:</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" textAlign="right">{booking.petName || '-'}</Typography>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 1, borderStyle: 'dashed' }} />
          
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="body2" fontWeight="bold">ບໍລິການ:</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" textAlign="right">{booking.service || '-'}</Typography>
            </Grid>
            
            <Grid item xs={6}>
              <Typography variant="body2" fontWeight="bold">ວັນທີເລີ່ມ:</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" textAlign="right">{formatDate(booking.start_date)}</Typography>
            </Grid>
            
            <Grid item xs={6}>
              <Typography variant="body2" fontWeight="bold">ວັນທີສິ້ນສຸດ:</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" textAlign="right">{formatDate(booking.stop_date)}</Typography>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 1, borderStyle: 'dashed' }} />
          
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="subtitle1" fontWeight="bold">ລວມເງິນ:</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1" fontWeight="bold" textAlign="right">
                {Number(booking.total).toLocaleString('lo-LA')} ກີບ
              </Typography>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 1, borderStyle: 'dashed' }} />
          
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              ຂອບໃຈທີ່ໃຊ້ບໍລິການ DR. P VETERINARY CLINIC
            </Typography>
            <Typography variant="body2">
              ພວກເຮົາດູແລສັດລ້ຽງຂອງທ່ານດ້ວຍຄວາມຮັກ
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          color="error"
          startIcon={<Close />}
        >
          ຍົກເລີກ
        </Button>
        <Button 
          onClick={handlePrint} 
          variant="contained"
          color="primary"
          startIcon={<Print />}
        >
          ພິມໃບບິນ
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ReceiptPrinter.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  booking: PropTypes.object.isRequired
};

export default ReceiptPrinter;