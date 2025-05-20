// src/components/SymbolSelector.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SymbolSelector from './SymbolSelector';

// Mockar a função de serviço
jest.mock('../services/binance', () => ({
  getExchangeInfo: jest.fn(() => Promise.resolve([
    { symbol: 'BTCUSDT', status: 'TRADING' },
    { symbol: 'ETHUSDT', status: 'TRADING' },
    { symbol: 'BNBBTC', status: 'TRADING' },
  ])),
}));

describe('SymbolSelector', () => {
  it('should render available symbols and allow selection', async () => {
    const mockOnSymbolsSelect = jest.fn();
    render(<SymbolSelector onSymbolsSelect={mockOnSymbolsSelect} selectedSymbols={[]} />);

    await waitFor(() => {
      expect(screen.getByText('BTCUSDT')).toBeInTheDocument();
      expect(screen.getByText('ETHUSDT')).toBeInTheDocument();
    });

    const btcCheckbox = screen.getByLabelText('BTCUSDT');
    fireEvent.click(btcCheckbox);

    expect(mockOnSymbolsSelect).toHaveBeenCalledWith(['BTCUSDT']);

    fireEvent.click(screen.getByLabelText('ETHUSDT'));
    expect(mockOnSymbolsSelect).toHaveBeenCalledWith(['ETHUSDT']); // Pode chamar com [BTCUSDT, ETHUSDT] dependendo da implementação do `onSymbolsSelect`
  });

  it('should filter symbols based on input', async () => {
    const mockOnSymbolsSelect = jest.fn();
    render(<SymbolSelector onSymbolsSelect={mockOnSymbolsSelect} selectedSymbols={[]} />);

    await waitFor(() => {
      expect(screen.getByText('BTCUSDT')).toBeInTheDocument();
    });

    const filterInput = screen.getByPlaceholderText('Filtrar símbolos...');
    fireEvent.change(filterInput, { target: { value: 'eth' } });

    expect(screen.queryByText('BTCUSDT')).not.toBeInTheDocument();
    expect(screen.getByText('ETHUSDT')).toBeInTheDocument();
  });
});