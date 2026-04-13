import React, { useState } from 'react';
import { Layout, Typography, Steps, ConfigProvider, theme } from 'antd';
import { CloudUploadOutlined, BarChartOutlined } from '@ant-design/icons';
import UploadPage from './components/UploadPage';
import ResultPage from './components/ResultPage';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

function App() {
  const [step, setStep] = useState(0); // 0: 上传, 1: 分析结果
  const [taskData, setTaskData] = useState(null);

  const handleUploadSuccess = (data) => {
    setTaskData(data);
    setStep(1);
  };

  const handleBack = () => {
    setStep(0);
    setTaskData(null);
  };

  const stepItems = [
    { title: '上传数据', icon: <CloudUploadOutlined /> },
    { title: '分析报告', icon: <BarChartOutlined /> },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1565c0',
          borderRadius: 8,
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
        <Header style={{
          background: 'linear-gradient(135deg, #1a237e 0%, #1565c0 100%)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 40px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}>
          <Title level={3} style={{ color: '#fff', margin: 0 }}>
            客户资产分析工具
          </Title>
        </Header>

        <Content style={{ padding: '24px 40px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          <Steps
            current={step}
            items={stepItems}
            style={{ marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}
          />

          {step === 0 && (
            <UploadPage onUploadSuccess={handleUploadSuccess} />
          )}

          {step === 1 && taskData && (
            <ResultPage
              taskId={taskData.task_id}
              customerName={taskData.customer_name}
              onBack={handleBack}
            />
          )}
        </Content>

        <Footer style={{ textAlign: 'center', color: '#999' }}>
          客户资产分析工具 - 仅供内部使用
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
