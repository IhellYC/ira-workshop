import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { FinancialData } from '../types';

interface Props {
  data: FinancialData;
}

interface RowData {
  key: string;
  year: string;
  revenue: string;
  netIncome: string;
  eps: string;
}

function formatLargeNumber(value: number | null | undefined): string {
  if (value == null) return 'N/A';
  const abs = Math.abs(value);
  if (abs >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  return value.toLocaleString();
}

const columns: ColumnsType<RowData> = [
  { title: '年份', dataIndex: 'year', key: 'year', width: 100 },
  { title: '营收', dataIndex: 'revenue', key: 'revenue', align: 'right' },
  { title: '净利润', dataIndex: 'netIncome', key: 'netIncome', align: 'right' },
  { title: 'EPS', dataIndex: 'eps', key: 'eps', align: 'right' },
];

export default function FinancialTable({ data }: Props) {
  const rows: RowData[] = (data.dates ?? []).map((date, i) => ({
    key: date,
    year: date,
    revenue: formatLargeNumber(data.revenue?.[i]),
    netIncome: formatLargeNumber(data.netIncome?.[i]),
    eps: data.eps?.[i] != null ? data.eps[i].toFixed(2) : 'N/A',
  }));

  return (
    <Table<RowData>
      columns={columns}
      dataSource={rows}
      pagination={false}
      size="middle"
      bordered
    />
  );
}
