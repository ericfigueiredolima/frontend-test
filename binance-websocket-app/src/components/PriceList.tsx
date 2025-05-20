import { usePrice } from '../context/PriceContext';

function PriceList() {
  const { watchedSymbolsData } = usePrice(); // Agora watchedSymbolsData existe e é tipado!

  return (
    <div className="price-table-container"> {/* Container para a tabela */}
      <table className="price-table"> {/* Classe para a tabela */}
        <thead>
          <tr>
            <th>Símbolo</th> {/* Coloquei 'Símbolo' em português */}
            <th>Último Preço</th>
            <th>Bid Preço</th>
            <th>Ask Preço</th>
            <th>Var. % (24h)</th> {/* Var. % (24h) */}
          </tr>
        </thead>
        <tbody>
          {watchedSymbolsData.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>
                Nenhum símbolo selecionado ou dados não disponíveis.
              </td>
            </tr>
          ) : (
            watchedSymbolsData.map(data => (
              <tr key={data.symbol}>
                <td>{data.symbol}</td>
                <td>{data.lastPrice}</td>
                <td>{data.bidPrice}</td>
                <td>{data.askPrice}</td>
                <td className={`price-change ${parseFloat(data.priceChangePercent) >= 0 ? 'positive' : 'negative'}`}>
                  {data.priceChangePercent !== 'N/A' ? `${data.priceChangePercent}%` : 'N/A'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PriceList;