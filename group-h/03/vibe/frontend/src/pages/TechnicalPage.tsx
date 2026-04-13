import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Radio, Checkbox, Spin, Result, Button, Space, Segmented } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getTechnicalIndicators } from '../services/api';
import type { TechnicalIndicators } from '../types';
import KLineChart from '../components/KLineChart';
import IndicatorChart from '../components/IndicatorChart';

const { Title } = Typography;

/** Map snake_case API response to camelCase TechnicalIndicators */
function mapData(raw: any): TechnicalIndicators {
  return {
    dates: raw.dates,
    open: raw.open,
    high: raw.high,
    low: raw.low,
    close: raw.close,
    volume: raw.volume,
    ma5: raw.ma5,
    ma10: raw.ma10,
    ma20: raw.ma20,
    ma60: raw.ma60,
    macd: raw.macd,
    macdSignal: raw.macd_signal ?? raw.macdSignal ?? [],
    macdHist: raw.macd_hist ?? raw.macdHist ?? [],
    kdjK: raw.kdj_k ?? raw.kdjK ?? [],
    kdjD: raw.kdj_d ?? raw.kdjD ?? [],
    kdjJ: raw.kdj_j ?? raw.kdjJ ?? [],
    rsi: raw.rsi,
    bollUpper: raw.boll_upper ?? raw.bollUpper ?? [],
    bollMid: raw.boll_mid ?? raw.bollMid ?? [],
    bollLower: raw.boll_lower ?? raw.bollLower ?? [],
  };
}

const periodOptions = [
  { label: '1月', value: '1mo' },
  { label: '3月', value: '3mo' },
  { label: '6月', value: '6mo' },
  { label: '1年', value: '1y' },
];

export default function TechnicalPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();

  const [period, setPeriod] = useState('6mo');
  const [showMA, setShowMA] = useState(true);
  const [showBoll, setShowBoll] = useState(false);
  const [subIndicator, setSubIndicator] = useState<'macd' | 'kdj' | 'rsi'>('macd');

  const [data, setData] = useState<TechnicalIndicators | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!symbol) return;
    setLoading(true);
    setError(null);
    try {
      const raw = await getTechnicalIndicators(symbol, period);
      setData(mapData(raw));
    } catch (e: any) {
      setError(e?.message || '获取技术指标数据失败');
    } finally {
      setLoading(false);
    }
  }, [symbol, period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!symbol) {
    return <Result status="warning" title="未指定股票代码" />;
  }

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <Space align="center" style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} type="text" onClick={() => navigate(-1)} />
        <Title level={3} style={{ margin: 0 }}>
          {symbol.toUpperCase()} 技术面分析
        </Title>
      </Space>

      {/* Period selector */}
      <div style={{ marginBottom: 12 }}>
        <span style={{ marginRight: 8, fontWeight: 500 }}>周期:</span>
        <Radio.Group
          options={periodOptions}
          optionType="button"
          buttonStyle="solid"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        />
      </div>

      {/* Indicator toggles */}
      <div style={{ marginBottom: 16 }}>
        <span style={{ marginRight: 8, fontWeight: 500 }}>指标:</span>
        <Checkbox checked={showMA} onChange={(e) => setShowMA(e.target.checked)}>
          MA 均线
        </Checkbox>
        <Checkbox checked={showBoll} onChange={(e) => setShowBoll(e.target.checked)}>
          BOLL 布林带
        </Checkbox>
      </div>

      {/* Main content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 120 }}>
          <Spin size="large" tip="加载中..." />
        </div>
      ) : error ? (
        <Result
          status="error"
          title="数据加载失败"
          subTitle={error}
          extra={<Button onClick={fetchData}>重试</Button>}
        />
      ) : data ? (
        <>
          <KLineChart data={data} showMA={showMA} showBoll={showBoll} />

          {/* Sub indicator selector */}
          <div style={{ marginTop: 24, marginBottom: 12 }}>
            <span style={{ marginRight: 8, fontWeight: 500 }}>副图指标:</span>
            <Segmented
              options={[
                { label: 'MACD', value: 'macd' },
                { label: 'KDJ', value: 'kdj' },
                { label: 'RSI', value: 'rsi' },
              ]}
              value={subIndicator}
              onChange={(val) => setSubIndicator(val as 'macd' | 'kdj' | 'rsi')}
            />
          </div>

          <IndicatorChart data={data} indicator={subIndicator} />
        </>
      ) : null}
    </div>
  );
}
