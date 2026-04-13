import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Typography, Card, Statistic, Button, Spin, message, Space, Row, Col } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, LineChartOutlined, FundOutlined, ReadOutlined } from '@ant-design/icons';
import StockSearch from '../components/StockSearch';
import { getStockProfile } from '../services/api';
import type { StockProfile } from '../types';

const { Title, Text } = Typography;

function formatMarketCap(value: number): string {
  if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  return value.toLocaleString();
}

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<StockProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async (symbol: string) => {
    setSearchParams({ symbol });
    setLoading(true);
    try {
      const data = await getStockProfile(symbol);
      setProfile(data);
    } catch {
      message.error(`获取 ${symbol} 的股票信息失败，请检查代码是否正确`);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [setSearchParams]);

  useEffect(() => {
    const symbol = searchParams.get('symbol');
    if (symbol) {
      handleSearch(symbol.trim().toUpperCase());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isUp = profile ? profile.changePercent >= 0 : true;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: profile ? 60 : 180, transition: 'padding-top 0.3s ease' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <Title level={1} style={{ marginBottom: 8 }}>AI投研助手</Title>
        <Text type="secondary" style={{ fontSize: 16 }}>输入股票代码，开始你的投资研究</Text>
      </div>

      <StockSearch onSearch={handleSearch} />

      <div style={{ marginTop: 40, width: 600 }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <Spin size="large" />
          </div>
        )}

        {!loading && profile && (
          <>
            <Card
              title={
                <span style={{ fontSize: 18 }}>
                  <Text strong>{profile.symbol}</Text>
                  <Text type="secondary" style={{ marginLeft: 8 }}>{profile.name}</Text>
                </span>
              }
              style={{ marginBottom: 24 }}
            >
              <Row gutter={[24, 16]}>
                <Col span={8}>
                  <Statistic
                    title="当前价格"
                    value={profile.currentPrice}
                    precision={2}
                    prefix="$"
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="涨跌幅"
                    value={profile.changePercent}
                    precision={2}
                    valueStyle={{ color: isUp ? '#3f8600' : '#cf1322' }}
                    prefix={isUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    suffix="%"
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="市值"
                    value={formatMarketCap(profile.marketCap)}
                    prefix="$"
                  />
                </Col>
              </Row>
              <div style={{ marginTop: 16, borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
                <Text type="secondary">行业：</Text>
                <Text>{profile.sector}</Text>
                <Text type="secondary" style={{ marginLeft: 24 }}>板块：</Text>
                <Text>{profile.industry}</Text>
              </div>
            </Card>

            <Space size="middle" style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                type="primary"
                icon={<FundOutlined />}
                size="large"
                onClick={() => navigate(`/fundamental/${profile.symbol}`)}
              >
                基本面分析
              </Button>
              <Button
                type="primary"
                icon={<LineChartOutlined />}
                size="large"
                onClick={() => navigate(`/technical/${profile.symbol}`)}
              >
                技术面分析
              </Button>
              <Button
                type="primary"
                icon={<ReadOutlined />}
                size="large"
                onClick={() => navigate(`/news/${profile.symbol}`)}
              >
                相关资讯
              </Button>
            </Space>
          </>
        )}
      </div>
    </div>
  );
}
