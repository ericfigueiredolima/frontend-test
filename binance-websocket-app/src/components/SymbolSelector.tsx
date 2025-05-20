import React, { useEffect, useState } from 'react';
import { getExchangeInfo, type SymbolInfo } from '../services/binance';

interface SymbolSelectorProps {
  onSymbolsSelect: (symbols: string[]) => void;
  selectedSymbols: string[];
}

const SymbolSelector: React.FC<SymbolSelectorProps> = ({ onSymbolsSelect, selectedSymbols }) => {
  const [availableSymbols, setAvailableSymbols] = useState<SymbolInfo[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchSymbols = async () => {
      const symbols = await getExchangeInfo();
      setAvailableSymbols(symbols.filter(s => s.status === 'TRADING')); // Filtra apenas os que estão em trading
    };
    fetchSymbols();
  }, []);

  const handleToggleSymbol = (symbol: string) => {
    if (selectedSymbols.includes(symbol)) {
      onSymbolsSelect(selectedSymbols.filter(s => s !== symbol));
    } else {
      onSymbolsSelect([...selectedSymbols, symbol]);
    }
  };

  const filteredSymbols = availableSymbols.filter(s =>
    s.symbol.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <span className="search-icon">🔍</span>
      </div>

      <div className="symbol-list">
        {filteredSymbols.map(symbolInfo => (
          <div key={symbolInfo.symbol} className="symbol-item">
            {/* NOVO AJUSTE AQUI: INPUT VEM ANTES DO LABEL */}
            <input
              type="checkbox"
              id={`symbol-${symbolInfo.symbol}`}
              checked={selectedSymbols.includes(symbolInfo.symbol)}
              onChange={() => handleToggleSymbol(symbolInfo.symbol)}
            />
            {/* O label agora só envolve o texto do símbolo */}
            <label htmlFor={`symbol-${symbolInfo.symbol}`}>{symbolInfo.symbol}</label>
          </div>
        ))}
      </div>
    </>
  );
};

export default SymbolSelector;