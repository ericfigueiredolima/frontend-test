import axios from 'axios';

const BINANCE_API_BASE_URL = 'https://api.binance.com/api/v3';

export interface SymbolInfo {
  symbol: string;
  status: string;
  // Adicione outras propriedades que achar relevantes do exchangeInfo, como baseAsset, quoteAsset
}

export const getExchangeInfo = async (): Promise<SymbolInfo[]> => {
  try {
    const response = await axios.get(`${BINANCE_API_BASE_URL}/exchangeInfo`);
    return response.data.symbols;
  } catch (error) {
    console.error('Error fetching exchange info:', error);
    return [];
  }
};