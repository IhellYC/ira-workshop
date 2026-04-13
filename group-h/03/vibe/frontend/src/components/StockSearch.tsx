import { Input } from 'antd';

interface StockSearchProps {
  onSearch: (symbol: string) => void;
}

export default function StockSearch({ onSearch }: StockSearchProps) {
  const handleSearch = (value: string) => {
    const trimmed = value.trim().toUpperCase();
    if (trimmed) {
      onSearch(trimmed);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Input.Search
        placeholder="输入美股代码，如 AAPL, MSFT, GOOGL"
        enterButton="搜索"
        size="large"
        onSearch={handleSearch}
        style={{ width: 500 }}
      />
    </div>
  );
}
