import { useState } from 'react';
import { List, Card, Empty, Skeleton, Typography } from 'antd';
import type { NewsItem } from '../types';

const { Text, Paragraph } = Typography;

interface NewsListProps {
  items: NewsItem[];
  loading?: boolean;
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (hours < 1) return '刚刚';
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return date.toLocaleDateString('zh-CN');
}

export default function NewsList({ items, loading }: NewsListProps) {
  const [hiddenImages, setHiddenImages] = useState<Set<string>>(new Set());

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} style={{ borderRadius: 8 }}>
            <Skeleton active avatar={{ shape: 'square', size: 80 }} paragraph={{ rows: 2 }} />
          </Card>
        ))}
      </div>
    );
  }

  if (!items.length) {
    return <Empty description="暂无新闻" style={{ marginTop: 60 }} />;
  }

  return (
    <List
      dataSource={items}
      split={false}
      renderItem={(item) => {
        const showImage = item.thumbnail && !hiddenImages.has(item.url);
        return (
          <List.Item style={{ padding: '6px 0', border: 'none' }}>
            <Card
              hoverable
              style={{ width: '100%', borderRadius: 8, overflow: 'hidden' }}
              styles={{ body: { padding: 16 } }}
              onClick={() => window.open(item.url, '_blank', 'noopener,noreferrer')}
            >
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                {showImage && (
                  <img
                    src={item.thumbnail}
                    alt=""
                    style={{
                      width: 120,
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: 6,
                      flexShrink: 0,
                    }}
                    onError={() =>
                      setHiddenImages((prev) => new Set(prev).add(item.url))
                    }
                  />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Text strong style={{ fontSize: 15, display: 'block', marginBottom: 4 }}>
                    {item.title}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    来源: {item.source} · {formatTime(item.publishedAt)}
                  </Text>
                  {item.summary && (
                    <Paragraph
                      type="secondary"
                      ellipsis={{ rows: 2 }}
                      style={{ marginTop: 6, marginBottom: 0, fontSize: 13 }}
                    >
                      {item.summary}
                    </Paragraph>
                  )}
                </div>
              </div>
            </Card>
          </List.Item>
        );
      }}
    />
  );
}
