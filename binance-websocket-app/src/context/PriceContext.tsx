import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react'; // Adicione useMemo
import { type TickerData } from '../types/binance';

// Defina uma interface para os dados que você quer exibir na tabela
// (Isso é o que eu estava chamando de watchedSymbolsData antes)
interface FormattedPriceData {
  symbol: string;
  lastPrice: string;
  bidPrice: string;
  askPrice: string;
  priceChangePercent: string; // Ou number, dependendo como você quer formatar
  // Adicione outras propriedades de TickerData que você queira exibir
}

interface PriceContextType {
  prices: Map<string, TickerData>;
  addSymbolToWatch: (symbol: string) => void;
  removeSymbolFromWatch: (symbol: string) => void;
  watchedSymbols: string[];
  watchedSymbolsData: FormattedPriceData[]; // <--- ADICIONADO AQUI
}

const PriceContext = createContext<PriceContextType | undefined>(undefined);

const WEBSOCKET_BASE_URL = 'wss://data-stream.binance.com/stream?streams=';

export const PriceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prices, setPrices] = useState<Map<string, TickerData>>(new Map());
  const [watchedSymbols, setWatchedSymbols] = useState<string[]>([]);
  const ws = useRef<WebSocket | null>(null);

  const connectWebSocket = useCallback((symbols: string[]) => {
    if (ws.current) {
      ws.current.close();
    }

    if (symbols.length === 0) {
      setPrices(new Map()); // Limpa os preços se não houver símbolos
      return;
    }

    // Usar um Set para garantir símbolos únicos e manter a ordem se desejar
    const uniqueSymbols = Array.from(new Set(symbols));
    const streams = uniqueSymbols.map(s => `${s.toLowerCase()}@ticker`).join('/');
    const url = `${WEBSOCKET_BASE_URL}${streams}`;
    console.log('Connecting to WebSocket:', url);

    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log('WebSocket Connected!');
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.data && data.data.s) { // Verifica se é uma atualização de ticker
        setPrices(prevPrices => {
          const newPrices = new Map(prevPrices);
          newPrices.set(data.data.s, data.data);
          return newPrices;
        });
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket Disconnected.');
      // Opcional: Implementar lógica de reconexão
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };
  }, []);

  useEffect(() => {
    connectWebSocket(watchedSymbols);

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [watchedSymbols, connectWebSocket]);

  const addSymbolToWatch = useCallback((symbol: string) => {
    setWatchedSymbols(prev => {
      if (!prev.includes(symbol)) {
        return [...prev, symbol];
      }
      return prev;
    });
  }, []);

  const removeSymbolFromWatch = useCallback((symbol: string) => {
    setWatchedSymbols(prev => prev.filter(s => s !== symbol));
  }, []);

  // <--- NOVO: watchedSymbolsData CALCULADO AQUI ---
  const watchedSymbolsData = useMemo(() => {
    return watchedSymbols.map(symbol => {
      const priceData = prices.get(symbol);
      // Se não houver dados, retorna um placeholder ou dados padrão
      return {
        symbol: symbol,
        lastPrice: priceData?.c ? parseFloat(priceData.c).toFixed(4) : 'N/A', // Last Price
        bidPrice: priceData?.b ? parseFloat(priceData.b).toFixed(4) : 'N/A',   // Bid Price
        askPrice: priceData?.a ? parseFloat(priceData.a).toFixed(4) : 'N/A',   // Ask Price
        priceChangePercent: priceData?.P ? parseFloat(priceData.P).toFixed(2) : 'N/A', // Mantive 2 casas para a porcentagem
        // Adicione outras propriedades conforme necessário da TickerData
      };
    });
  }, [watchedSymbols, prices]);
  // --- FIM DO NOVO ---

  return (
    <PriceContext.Provider value={{ prices, addSymbolToWatch, removeSymbolFromWatch, watchedSymbols, watchedSymbolsData }}> {/* <--- ADICIONADO AQUI */}
      {children}
    </PriceContext.Provider>
  );
};

export const usePrice = () => {
  const context = useContext(PriceContext);
  if (!context) {
    throw new Error('usePrice must be used within a PriceProvider');
  }
  return context;
};