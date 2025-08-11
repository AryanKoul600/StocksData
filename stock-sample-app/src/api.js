
// src/api.js
// Fetch stock data from Alpha Vantage

const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';



// Fetch daily time series for a symbol
export async function fetchStockDaily(symbol = 'RELIANCE.BSE', outputsize = 'compact') {
  const url = `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=${outputsize}&apikey=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data['Note']) {
    throw new Error('API call frequency or quota exceeded. Please wait and try again, or check your API key/quota.');
  }
  if (data['Error Message']) {
    throw new Error('Invalid symbol or unsupported market. Please check the symbol and try again.');
  }
  if (!data['Time Series (Daily)']) {
    throw new Error('No daily data found for this symbol. It may not be supported by Alpha Vantage.');
  }
  // Convert Alpha Vantage data to array
  const values = Object.entries(data['Time Series (Daily)']).map(([datetime, obj]) => ({
    datetime,
    open: obj['1. open'],
    high: obj['2. high'],
    low: obj['3. low'],
    close: obj['4. close'],
    volume: obj['5. volume'],
  }));
  return { values };
}

// Search for a symbol using Alpha Vantage SYMBOL_SEARCH endpoint
export async function searchSymbol(keywords) {
  const url = `${BASE_URL}?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(keywords)}&apikey=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data['Note']) {
    throw new Error('API call frequency or quota exceeded. Please wait and try again, or check your API key/quota.');
  }
  if (!data.bestMatches) {
    throw new Error('No symbol matches found.');
  }
  // Return array of best matches
  return data.bestMatches.map(match => ({
    symbol: match['1. symbol'],
    name: match['2. name'],
    region: match['4. region'],
    currency: match['8. currency'],
    type: match['3. type'],
  }));
}
