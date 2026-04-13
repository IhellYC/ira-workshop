import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Card,
  Row,
  Col,
  Spin,
  Result,
  Button,
  Statistic,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { getStockProfile, getFinancials } from '../services/api';
import type { StockProfile, FinancialData } from '../types';
import FinancialTable from '../components/FinancialTable';

const { Title, Paragraph, Text } = Typography;

function formatLargeNumber(value: number | null | undefined): string {
  if (value == null) return 'N/A';
  const abs = Math.abs(value);
  if (abs >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  return value.toLocaleString();
}

export default function FundamentalPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<StockProfile | null>(null);
  const [financials, setFinancials] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) return;
    setLoading(true);
    setError(null);

    Promise.all([getStockProfile(symbol), getFinancials(symbol)])
      .then(([profileData, financialData]) => {
        setProfile(profileData);
        setFinancials(financialData);
      })
      .catch((err) => {
        setError(err?.message ?? '数据加载失败');
      })
      .finally(() => setLoading(false));
  }, [symbol]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  if (error || !profile || !financials) {
    return (
      <Result
        status="error"
        title="加载失败"
        subTitle={error ?? '无法获取数据'}
        extra={<Button onClick={() => navigate(-1)}>返回</Button>}
      />
    );
  }

  const chartOption = {
    tooltip: {
      trigger: 'axis' as const,
      formatter(params: Array<{ seriesName: string; value: number; axisValue: string }>) {
        if (!Array.isArray(params)) return '';
        const header = params[0]?.axisValue ?? '';
        const lines = params.map(
          (p) => `${p.seriesName}: ${formatLargeNumber(p.value)}`,
        );
        return [header, ...lines].join('<br/>');
      },
    },
    legend: { data: ['营收', '净利润'] },
    xAxis: {
      type: 'category' as const,
      data: financials.dates ?? [],
    },
    yAxis: {
      type: 'value' as const,
      axisLabel: {
        formatter(value: number) {
          return formatLargeNumber(value);
        },
      },
    },
    series: [
      {
        name: '营收',
        type: 'bar',
        data: financials.revenue ?? [],
        itemStyle: { color: '#1677ff' },
      },
      {
        name: '净利润',
        type: 'bar',
        data: financials.netIncome ?? [],
        itemStyle: { color: '#52c41a' },
      },
    ],
  };

  return (
    <div style={{ padding: 24 }}>
      {/* 顶部导航 */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{ marginRight: 12 }}
        >
          返回
        </Button>
        <Title level={3} style={{ margin: 0 }}>
          {symbol} - {profile.name} 基本面分析
        </Title>
      </div>

      {/* 公司概况 */}
      <Card title="公司概况" style={{ marginBottom: 24 }}>
        <Title level={4} style={{ marginTop: 0 }}>
          {profile.name}
        </Title>
        <Text type="secondary">
          行业: {profile.sector} / {profile.industry}
        </Text>
        <Paragraph
          ellipsis={{ rows: 3, expandable: true, symbol: '展开' }}
          style={{ marginTop: 12 }}
        >
          {profile.description}
        </Paragraph>
      </Card>

      {/* 核心估值指标 */}
      <Card title="核心估值指标" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={6}>
            <Card variant="borderless">
              <Statistic
                title="市盈率 (PE)"
                value={financials.peRatio ?? undefined}
                precision={2}
                formatter={(val) => (financials.peRatio != null ? String(val) : 'N/A')}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card variant="borderless">
              <Statistic
                title="市净率 (PB)"
                value={financials.pbRatio ?? undefined}
                precision={2}
                formatter={(val) => (financials.pbRatio != null ? String(val) : 'N/A')}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card variant="borderless">
              <Statistic
                title="毛利率"
                value={financials.grossMargin != null ? financials.grossMargin * 100 : undefined}
                precision={2}
                suffix="%"
                formatter={(val) =>
                  financials.grossMargin != null ? `${val}` : 'N/A'
                }
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card variant="borderless">
              <Statistic
                title="净利率"
                value={financials.profitMargin != null ? financials.profitMargin * 100 : undefined}
                precision={2}
                suffix="%"
                formatter={(val) =>
                  financials.profitMargin != null ? `${val}` : 'N/A'
                }
              />
            </Card>
          </Col>
        </Row>
      </Card>

      {/* 财务趋势图 + 表格 */}
      <Row gutter={24}>
        <Col xs={24} lg={14}>
          <Card title="财务数据趋势" style={{ marginBottom: 24 }}>
            <ReactECharts option={chartOption} style={{ height: 380 }} />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="财务数据表格" style={{ marginBottom: 24 }}>
            <FinancialTable data={financials} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
