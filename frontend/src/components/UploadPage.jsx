import React, { useState } from 'react';
import {
  Upload, Button, Input, Card, message, Table, Space, Typography
} from 'antd';
import {
  UploadOutlined, InboxOutlined
} from '@ant-design/icons';
import { uploadFiles } from '../services/api';

const { Dragger } = Upload;
const { Title, Text } = Typography;

export default function UploadPage({ onUploadSuccess }) {
  const [holdingsFile, setHoldingsFile] = useState(null);
  const [tradesFile, setTradesFile] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleUpload = async () => {
    if (!holdingsFile) {
      message.warning('请上传持仓数据文件');
      return;
    }

    setLoading(true);
    try {
      const result = await uploadFiles(holdingsFile, tradesFile, customerName);
      setPreview(result);
      message.success('文件上传成功！');
      onUploadSuccess(result);
    } catch (err) {
      const detail = err.response?.data?.detail || err.message;
      message.error(`上传失败: ${detail}`);
    } finally {
      setLoading(false);
    }
  };

  const holdingsUploadProps = {
    accept: '.csv,.xlsx,.xls',
    maxCount: 1,
    beforeUpload: (file) => {
      setHoldingsFile(file);
      return false;
    },
    onRemove: () => setHoldingsFile(null),
  };

  const tradesUploadProps = {
    accept: '.csv,.xlsx,.xls',
    maxCount: 1,
    beforeUpload: (file) => {
      setTradesFile(file);
      return false;
    },
    onRemove: () => setTradesFile(null),
  };

  const previewColumns = (data) => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]).map(key => ({
      title: key,
      dataIndex: key,
      key,
      ellipsis: true,
    }));
  };

  return (
    <div>
      <Card style={{ marginBottom: 24 }}>
        <Title level={4} style={{ marginTop: 0 }}>客户信息</Title>
        <Input
          placeholder="请输入客户名称"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          style={{ maxWidth: 400 }}
          size="large"
        />
      </Card>

      <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
        <Card style={{ flex: 1 }} title="持仓数据（必填）">
          <Dragger {...holdingsUploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽上传持仓数据文件</p>
            <p className="ant-upload-hint">支持 CSV、Excel 格式</p>
          </Dragger>
        </Card>

        <Card style={{ flex: 1 }} title="交易记录（选填）">
          <Dragger {...tradesUploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽上传交易记录文件</p>
            <p className="ant-upload-hint">支持 CSV、Excel 格式</p>
          </Dragger>
        </Card>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Button
          type="primary"
          size="large"
          icon={<UploadOutlined />}
          onClick={handleUpload}
          loading={loading}
          disabled={!holdingsFile}
          style={{ minWidth: 200, height: 48, fontSize: 16 }}
        >
          上传并解析文件
        </Button>
      </div>

      {preview && preview.holdings_preview && (
        <Card title="持仓数据预览（前10条）" style={{ marginBottom: 16 }}>
          <Table
            columns={previewColumns(preview.holdings_preview)}
            dataSource={preview.holdings_preview.map((r, i) => ({ ...r, key: i }))}
            pagination={false}
            size="small"
            scroll={{ x: 'max-content' }}
          />
        </Card>
      )}

      {preview && preview.trades_preview && (
        <Card title="交易记录预览（前10条）">
          <Table
            columns={previewColumns(preview.trades_preview)}
            dataSource={preview.trades_preview.map((r, i) => ({ ...r, key: i }))}
            pagination={false}
            size="small"
            scroll={{ x: 'max-content' }}
          />
        </Card>
      )}
    </div>
  );
}
