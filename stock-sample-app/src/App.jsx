
import { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, TextField, Button } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { fetchStockDaily } from './api';
import './App.css';


function App() {
  const STOCK_LIST = [
    // US Stocks
    { label: 'Apple (AAPL)', value: 'AAPL' },
    { label: 'Microsoft (MSFT)', value: 'MSFT' },
    { label: 'Google (GOOGL)', value: 'GOOGL' },
    { label: 'Amazon (AMZN)', value: 'AMZN' },
    { label: 'Tesla (TSLA)', value: 'TSLA' },
    // Indian Stocks
    { label: 'Reliance Industries', value: 'RELIANCE.BSE' },
    { label: 'Tata Consultancy', value: 'TCS.BSE' },
    { label: 'Infosys', value: 'INFY.BSE' },
    { label: 'HDFC Bank', value: 'HDFCBANK.BSE' },
    { label: 'ICICI Bank', value: 'ICICIBANK.BSE' },
    { label: 'State Bank of India', value: 'SBIN.BSE' },
    { label: 'Bharti Airtel', value: 'BHARTIARTL.BSE' },
    { label: 'Larsen & Toubro', value: 'LT.BSE' },
    { label: 'Bajaj Finance', value: 'BAJFINANCE.BSE' },
    { label: 'Asian Paints', value: 'ASIANPAINT.BSE' },
  ];
  const [symbol, setSymbol] = useState(STOCK_LIST[0].value);
  const [inputSymbol, setInputSymbol] = useState(STOCK_LIST[0].value);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  // Fetch data on symbol change
  useEffect(() => {
    getData(symbol);
    // eslint-disable-next-line
  }, [symbol]);

  async function getData(sym) {
    setLoading(true);
    setError(null);
    try {
      const dailyRes = await fetchStockDaily(sym);
      setData(dailyRes);
    } catch (err) {
      setError(err.message);
      setData(null);
    }
    setLoading(false);
  }

  const handleSearch = (e) => {
    e.preventDefault();
    setSymbol(inputSymbol);
  };

  const handleDropdownChange = (e) => {
    setInputSymbol(e.target.value);
    setSymbol(e.target.value);
  };

  const handleRefresh = () => {
    getData(symbol);
  };

  // Prepare chart data
  const chartData = data?.values?.slice().reverse() || [];

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', background: 'linear-gradient(135deg, #e0e7ff 0%, #f0f4f8 100%)', py: { xs: 2, sm: 4, md: 6 }, px: 0 }}>
      <Container maxWidth={false} disableGutters sx={{ px: { xs: 0, sm: 2, md: 4 }, width: '100vw' }}>
        <Paper elevation={6} sx={{
          p: { xs: 1, sm: 2, md: 4 },
          borderRadius: { xs: 0, sm: 3, md: 4 },
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
          bgcolor: 'rgba(255,255,255,0.97)',
          maxWidth: 1400,
          mx: 'auto',
          minHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 2, mb: 2 }}>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#1976d2', letterSpacing: 1, fontSize: { xs: 28, sm: 36, md: 44 } }}>
                Indian Stock Dashboard
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#555', mb: 1, fontSize: { xs: 14, sm: 18 } }}>
                View real-time stock price graphs of selected companies
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: { xs: 1, sm: 0 } }}>
              <TextField
                select
                label="Select Stock"
                value={inputSymbol}
                onChange={handleDropdownChange}
                size="medium"
                sx={{ bgcolor: 'white', borderRadius: 2, minWidth: 200, boxShadow: 1 }}
                SelectProps={{ native: true }}
              >
                {STOCK_LIST.map((stock) => (
                  <option key={stock.value} value={stock.value}>{stock.label}</option>
                ))}
              </TextField>
              <Button onClick={handleRefresh} variant="contained" color="primary" size="large" sx={{ px: 3, fontWeight: 700, borderRadius: 2 }}>
                Refresh
              </Button>
            </Box>
          </Box>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
              <CircularProgress size={48} thickness={5} />
            </Box>
          ) : error ? (
            <Typography color="error" align="center" sx={{ fontWeight: 600, fontSize: 18 }}>{error}</Typography>
          ) : data && data.values ? (
            <>
              <Box sx={{ my: 4, height: 380, bgcolor: 'white', borderRadius: 3, p: 2, boxShadow: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis dataKey="datetime" tick={{ fontSize: 12, fill: '#1976d2' }} minTickGap={20} />
                    <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12, fill: '#1976d2' }} />
                    <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #e0e7ff' }} />
                    <Line type="monotone" dataKey="close" stroke="#1976d2" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
              <TableContainer component={Paper} sx={{ maxHeight: 350, bgcolor: 'white', borderRadius: 3, boxShadow: 1 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#e0e7ff' }}>
                      <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>Date</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: '#1976d2' }}>Open</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: '#1976d2' }}>High</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: '#1976d2' }}>Low</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: '#1976d2' }}>Close</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: '#1976d2' }}>Volume</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {chartData.map((row, idx) => (
                      <TableRow key={idx} hover sx={{ '&:hover': { bgcolor: '#f0f4f8' } }}>
                        <TableCell>{row.datetime}</TableCell>
                        <TableCell align="right">{row.open}</TableCell>
                        <TableCell align="right">{row.high}</TableCell>
                        <TableCell align="right">{row.low}</TableCell>
                        <TableCell align="right">{row.close}</TableCell>
                        <TableCell align="right">{row.volume}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <Typography align="center" color="text.secondary" sx={{ fontSize: 18, fontWeight: 500 }}>Enter a valid stock symbol to view data.</Typography>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default App
