import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Tabs, Button, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getStockNews, getMarketNews } from '../services/api';
import type { NewsItem } from '../types';
import NewsList from '../components/NewsList';

const { Title } = Typography;

const mapNewsItem = (raw: any): NewsItem => ({
  title: raw.title,
  source: raw.source,
  publishedAt: raw.published_at || raw.publishedAt,
  url: raw.url,
  thumbnail: raw.thumbnail,
  summary: raw.summary,
});

export default function NewsPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();

  const [stockNews, setStockNews] = useState<NewsItem[]>([]);
  const [marketNews, setMarketNews] = useState<NewsItem[]>([]);
  const [stockLoading, setStockLoading] = useState(false);
  const [marketLoading, setMarketLoading] = useState(false);

  const stockLoaded = useRef(false);
  const marketLoaded = useRef(false);

  const loadStockNews = useCallback(async () => {
    if (!symbol || stockLoaded.current) return;
    setStockLoading(true);
    try {
      const data = await getStockNews(symbol);
      setStockNews(data.map(mapNewsItem));
      stockLoaded.current = true;
    } catch {
      message.error('加载个股新闻失败');
    } finally {
      setStockLoading(false);
    }
  }, [symbol]);

  const loadMarketNews = useCallback(async () => {
    if (marketLoaded.current) return;
    setMarketLoading(true);
    try {
      const data = await getMarketNews();
      setMarketNews(data.map(mapNewsItem));
      marketLoaded.current = true;
    } catch {
      message.error('加载市场新闻失败');
    } finally {
      setMarketLoading(false);
    }
  }, []);

  // Reset cache when symbol changes
  useEffect(() => {
    stockLoaded.current = false;
    marketLoaded.current = false;
    setStockNews([]);
    setMarketNews([]);
  }, [symbol]);

  // Load initial data
  useEffect(() => {
    if (symbol) {
      loadStockNews();
    } else {
      loadMarketNews();
    }
  }, [symbol, loadStockNews, loadMarketNews]);

  const handleTabChange = (key: string) => {
    if (key === 'stock') {
      loadStockNews();
    } else {
      loadMarketNews();
    }
  };

  const pageTitle = symbol ? `${symbol} 相关资讯` : '市场资讯';

  return (
    <div style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
        />
        <Title level={3} style={{ margin: 0 }}>
          {pageTitle}
        </Title>
      </div>

      {symbol ? (
        <Tabs
          defaultActiveKey="stock"
          onChange={handleTabChange}
          items={[
            {
              key: 'stock',
              label: '个股新闻',
              children: <NewsList items={stockNews} loading={stockLoading} />,
            },
            {
              key: 'market',
              label: '市场热点',
              children: <NewsList items={marketNews} loading={marketLoading} />,
            },
          ]}
        />
      ) : (
        <NewsList items={marketNews} loading={marketLoading} />
      )}
    </div>
  );
}
