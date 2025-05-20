import { PriceProvider } from './context/PriceContext';
import SymbolSelector from './components/SymbolSelector';
import PriceList from './components/PriceList';
import { usePrice } from './context/PriceContext'; // Importar usePrice para passar para SymbolSelector
import './App.css'; // <--- IMPORTANTE: Adicione esta linha para importar seu CSS

function AppContent() {
  const { addSymbolToWatch, removeSymbolFromWatch, watchedSymbols } = usePrice();

  const handleSymbolsSelect = (symbols: string[]) => {
    const symbolsToAdd = symbols.filter(s => !watchedSymbols.includes(s));
    const symbolsToRemove = watchedSymbols.filter(s => !symbols.includes(s));

    symbolsToAdd.forEach(addSymbolToWatch);
    symbolsToRemove.forEach(removeSymbolFromWatch);
  };

  return (
    <div className="app-container"> {/* Container principal para centralizar e estilizar o fundo */}
      <h1 className="main-title">Binance Price Watcher</h1> {/* Adicionado classe para o título */}

      <div className="main-layout-container"> {/* Container Flex para as duas colunas */}

        {/* Card da Sidebar (Filtro de Símbolos) */}
        <div className="sidebar-card">
          <div className="header-section"> {/* Novo div para o cabeçalho "Símbolos Disponíveis" */}
            <h2 className="section-title">Símbolos Disponíveis</h2>
            {/* O campo de busca (Search) e o ícone provavelmente estão dentro de SymbolSelector */}
            {/* Se o input de busca não estiver em SymbolSelector, ele viria aqui, dentro de <div className="search-input-container"> */}
          </div>
          <SymbolSelector
            onSymbolsSelect={handleSymbolsSelect}
            selectedSymbols={watchedSymbols}
          />
          {/* Se você tiver um botão "Add to List" como no exemplo, adicione-o aqui com a classe */}
          {/* <button className="add-to-list-button">Add to List</button> */}
        </div>

        {/* Card do Conteúdo Principal (Tabela de Preços) */}
        <div className="main-content-card">
          <div className="header-section"> {/* Novo div para o cabeçalho "Preços em Tempo Real" */}
            <h2 className="section-title">Preços em Tempo Real</h2>
            {/* Se houver dropdowns ou botões extras no cabeçalho da tabela, eles viriam aqui */}
          </div>
          <PriceList />
        </div>

      </div>
    </div>
  );
}

function App() {
  return (
    <PriceProvider>
      <AppContent />
    </PriceProvider>
  );
}

export default App;