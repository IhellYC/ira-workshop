import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ConfigProvider, Layout, Menu, theme } from 'antd';
import {
  HomeOutlined,
  FundOutlined,
  LineChartOutlined,
  ReadOutlined,
} from '@ant-design/icons';
import Dashboard from './pages/Dashboard';
import FundamentalPage from './pages/FundamentalPage';
import TechnicalPage from './pages/TechnicalPage';
import NewsPage from './pages/NewsPage';

const { Sider, Content } = Layout;

const menuItems = [
  { key: '/', icon: <HomeOutlined />, label: '首页' },
  { key: '/fundamental', icon: <FundOutlined />, label: '基本面分析' },
  { key: '/technical', icon: <LineChartOutlined />, label: '技术面分析' },
  { key: '/news', icon: <ReadOutlined />, label: '市场资讯' },
];

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedKey = '/' + (location.pathname.split('/')[1] || '');

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="dark" width={220}>
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          AI投研助手
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Content style={{ margin: 16, background: '#fff', borderRadius: 8 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/fundamental/:symbol" element={<FundamentalPage />} />
            <Route path="/technical/:symbol" element={<TechnicalPage />} />
            <Route path="/news/:symbol" element={<NewsPage />} />
            <Route path="/news" element={<NewsPage />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff',
        },
      }}
    >
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </ConfigProvider>
  );
}
