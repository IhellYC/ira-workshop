import React, { useState } from 'react';
import {
  Card, Button, Spin, Collapse, Input, message, Typography, Divider, Space, Tag, Result
} from 'antd';
import {
  DownloadOutlined, ReloadOutlined, FilePdfOutlined,
  CheckCircleOutlined, LoadingOutlined
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import { startAnalysis, regenerateAnalysis, getPdfDownloadUrl } from '../services/api';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

export default function ResultPage({ taskId, customerName, onBack }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [regenerating, setRegenerating] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const data = await startAnalysis(taskId, customerName);
      setResult(data);
      setAnalyzed(true);
      message.success('分析完成！');
    } catch (err) {
      const detail = err.response?.data?.detail || err.message;
      message.error(`分析失败: ${detail}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!feedback.trim()) {
      message.warning('请输入修改意见');
      return;
    }
    setRegenerating(true);
    try {
      const data = await regenerateAnalysis(taskId, feedback);
      setResult(data);
      setFeedback('');
      message.success('已根据反馈重新生成！');
    } catch (err) {
      const detail = err.response?.data?.detail || err.message;
      message.error(`重新生成失败: ${detail}`);
    } finally {
      setRegenerating(false);
    }
  };

  const handleDownloadPdf = () => {
    window.open(getPdfDownloadUrl(taskId), '_blank');
  };

  if (!analyzed && !loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <FilePdfOutlined style={{ fontSize: 64, color: '#1890ff', marginBottom: 24 }} />
        <Title level={3}>准备就绪</Title>
        <Paragraph type="secondary" style={{ fontSize: 16, marginBottom: 32 }}>
          数据已上传成功，点击下方按钮开始 AI 分析
        </Paragraph>
        <Space size="large">
          <Button onClick={onBack} size="large">返回修改</Button>
          <Button
            type="primary"
            size="large"
            onClick={handleAnalyze}
            style={{ minWidth: 200, height: 48, fontSize: 16 }}
          >
            开始 AI 分析
          </Button>
        </Space>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        <Title level={4} style={{ marginTop: 24 }}>AI 正在分析中...</Title>
        <Paragraph type="secondary">
          正在调用大模型对持仓数据和交易行为进行深度分析，预计需要 1-2 分钟
        </Paragraph>
      </div>
    );
  }

  if (!result) return null;

  const collapseItems = [
    {
      key: 'summary',
      label: (
        <span style={{ fontSize: 16, fontWeight: 600 }}>
          <Tag color="blue">总结</Tag> 综合报告总结
        </span>
      ),
      children: (
        <div className="markdown-content">
          <ReactMarkdown>{result.summary}</ReactMarkdown>
        </div>
      ),
    },
    {
      key: 'asset',
      label: (
        <span style={{ fontSize: 16, fontWeight: 600 }}>
          <Tag color="green">配置</Tag> 资产配置分析
        </span>
      ),
      children: (
        <div className="markdown-content">
          <ReactMarkdown>{result.asset_analysis}</ReactMarkdown>
        </div>
      ),
    },
    {
      key: 'trade',
      label: (
        <span style={{ fontSize: 16, fontWeight: 600 }}>
          <Tag color="orange">交易</Tag> 交易行为分析
        </span>
      ),
      children: (
        <div className="markdown-content">
          <ReactMarkdown>{result.trade_analysis}</ReactMarkdown>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Result
        icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
        title="分析完成"
        subTitle={`客户：${customerName || '客户'} | 任务ID：${taskId}`}
        extra={[
          <Button
            key="pdf"
            type="primary"
            icon={<DownloadOutlined />}
            size="large"
            onClick={handleDownloadPdf}
          >
            下载 PDF 报告
          </Button>,
          <Button key="back" onClick={onBack} size="large">
            重新上传
          </Button>,
        ]}
      />

      <Collapse
        defaultActiveKey={['summary']}
        items={collapseItems}
        style={{ marginBottom: 24 }}
        size="large"
      />

      <Card title="修改意见反馈" style={{ marginBottom: 24 }}>
        <Paragraph type="secondary">
          如需调整分析结果，请在下方输入修改意见，AI 将据此重新生成报告
        </Paragraph>
        <TextArea
          rows={4}
          placeholder="例如：请更关注科技股的风险分析；建议部分需要更具体的操作步骤..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={handleRegenerate}
          loading={regenerating}
          disabled={!feedback.trim()}
          size="large"
        >
          根据反馈重新生成
        </Button>
      </Card>
    </div>
  );
}
