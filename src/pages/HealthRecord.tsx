import React, { useState, useEffect } from 'react';
import { List, Button, Modal, Form, DatePicker, Input, TextArea, Toast } from 'antd-mobile';
import { AddOutline } from 'antd-mobile-icons';

interface HealthRecord {
  id: string;
  date: string;
  bloodPressure: string;
  bloodSugar: string;
  heartRate: string;
  weight: string;
  height: string;
  bmi: string;
  temperature: string;
  oxygenSaturation: string;
  result: string;
  doctorAdvice: string;
  lastModified: string;
}

const HealthRecordPage: React.FC = () => {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<HealthRecord | null>(null);
  const [form] = Form.useForm();

  // 从本地存储加载数据
  useEffect(() => {
    const savedRecords = localStorage.getItem('healthRecords');
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }
  }, []);

  // 保存数据到本地存储
  const saveToLocalStorage = (newRecords: HealthRecord[]) => {
    localStorage.setItem('healthRecords', JSON.stringify(newRecords));
    setRecords(newRecords);
  };

  // 添加新记录
  const handleAddRecord = async () => {
    try {
      const values = await form.validateFields();
      const height = parseFloat(values.height);
      const weight = parseFloat(values.weight);
      const bmi = height && weight ? (weight / ((height / 100) ** 2)).toFixed(1) : '';
      
      const newRecord = {
        id: Date.now().toString(),
        ...values,
        bmi,
        lastModified: new Date().toISOString()
      };
      const newRecords = [...records, newRecord];
      saveToLocalStorage(newRecords);
      setShowAddModal(false);
      form.resetFields();
      Toast.show({
        content: '添加成功',
        duration: 1500,
      });
    } catch (error) {
      Toast.show({
        content: '请填写完整信息',
        duration: 1500,
      });
    }
  };

  // 查看记录详情
  const handleViewRecord = (record: HealthRecord) => {
    setCurrentRecord(record);
    setShowDetailModal(true);
    form.setFieldsValue({
      ...record
    });
  };

  // 编辑记录
  const handleEditRecord = async () => {
    try {
      const values = await form.validateFields();
      const height = parseFloat(values.height);
      const weight = parseFloat(values.weight);
      const bmi = height && weight ? (weight / ((height / 100) ** 2)).toFixed(1) : '';

      const updatedRecord = {
        ...currentRecord,
        ...values,
        bmi,
        lastModified: new Date().toISOString()
      };

      const newRecords = records.map(record =>
        record.id === currentRecord?.id ? updatedRecord : record
      );

      saveToLocalStorage(newRecords);
      setShowDetailModal(false);
      form.resetFields();
      Toast.show({
        content: '更新成功',
        duration: 1500,
      });
    } catch (error) {
      Toast.show({
        content: '请填写完整信息',
        duration: 1500,
      });
    }
  };

  // 删除记录
  const handleDeleteRecord = (id: string) => {
    Modal.confirm({
      content: '确定要删除这条记录吗？',
      onConfirm: () => {
        const newRecords = records.filter(record => record.id !== id);
        saveToLocalStorage(newRecords);
        Toast.show({
          content: '删除成功',
          duration: 1500,
        });
      }
    });
  };

  // 导出健康记录
  const handleExportRecords = () => {
    const dataStr = JSON.stringify(records, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `health_records_${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="health-record-container">
      <div className="header">
        <h2>健康档案</h2>
        <Button
          onClick={() => setShowAddModal(true)}
          color="primary"
          fill="outline"
          size="small"
        >
          <AddOutline /> 添加记录
        </Button>
      </div>

      <List header="体检记录列表">
        {records.map(record => (
          <List.Item
            key={record.id}
            title={record.date}
            description={`血压: ${record.bloodPressure} | 血糖: ${record.bloodSugar}`}
            arrow={false}
            onClick={() => handleViewRecord(record)}
            extra={
              <Button
                color="danger"
                fill="none"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteRecord(record.id);
                }}
              >
                删除
              </Button>
            }
          />
        ))}
      </List>

      {records.length > 0 && (
        <Button
          block
          color="primary"
          fill="outline"
          onClick={handleExportRecords}
          style={{ marginTop: '16px' }}
        >
          导出记录
        </Button>
      )}

      {/* 添加记录弹窗 */}
      <Modal
        visible={showAddModal}
        title="添加体检记录"
        onClose={() => {
          setShowAddModal(false);
          form.resetFields();
        }}
        content={(
          <Form
            form={form}
            layout="vertical"
            footer={null}
          >
            <Form.Item
              name="date"
              label="体检日期"
              rules={[{ required: true }, { pattern: /^\d{4}-\d{2}-\d{2}$/, message: '请按照YYYY-MM-DD格式输入日期' }]}
            >
              <Input placeholder="请输入日期 (格式: YYYY-MM-DD，如2023-04-01)" />
            </Form.Item>
            <Form.Item
              name="bloodPressure"
              label="血压 (mmHg)"
              rules={[{ required: true }, { pattern: /^\d+\/\d+$/, message: '请输入正确的血压格式，如120/80' }]}
            >
              <Input placeholder="例如: 120/80" />
            </Form.Item>
            <Form.Item
              name="bloodSugar"
              label="血糖 (mmol/L)"
              rules={[{ required: true }, { pattern: /^\d+(\.\d+)?$/, message: '请输入有效的血糖数值' }]}
            >
              <Input placeholder="例如: 5.6" />
            </Form.Item>
            <Form.Item
              name="heartRate"
              label="心率 (次/分)"
              rules={[{ required: true }, { pattern: /^\d+$/, message: '请输入有效的心率数值' }]}
            >
              <Input placeholder="例如: 75" />
            </Form.Item>
            <Form.Item
              name="height"
              label="身高 (cm)"
              rules={[{ required: true }, { pattern: /^\d+(\.\d+)?$/, message: '请输入有效的身高数值' }]}
            >
              <Input placeholder="例如: 170" />
            </Form.Item>
            <Form.Item
              name="weight"
              label="体重 (kg)"
              rules={[{ required: true }, { pattern: /^\d+(\.\d+)?$/, message: '请输入有效的体重数值' }]}
            >
              <Input placeholder="例如: 65.5" />
            </Form.Item>
            <Form.Item
              name="result"
              label="体检结果"
              rules={[{ required: true }]}
            >
              <TextArea
                placeholder="请输入体检结果概述"
                rows={3}
              />
            </Form.Item>
            <Form.Item
              name="doctorAdvice"
              label="医生建议"
              rules={[{ required: true }]}
            >
              <TextArea
                placeholder="请输入医生的建议和注意事项"
                rows={3}
              />
            </Form.Item>
          </Form>
        )}
        closeOnAction
        actions={[{
          key: 'confirm',
          text: '确认',
          onClick: handleAddRecord
        }]}
      />

      {/* 记录详情弹窗 */}
      <Modal
        visible={showDetailModal}
        title="体检记录详情"
        onClose={() => setShowDetailModal(false)}
        closeOnAction
        content={currentRecord && (
          <List>
            <List.Item title="体检日期" description={currentRecord.date} />
            <List.Item title="身高" description={`${currentRecord.height} cm`} />
            <List.Item title="体重" description={`${currentRecord.weight} kg`} />
            <List.Item title="BMI" description={currentRecord.bmi} />
            <List.Item title="血压" description={`${currentRecord.bloodPressure} mmHg`} />
            <List.Item title="血糖" description={`${currentRecord.bloodSugar} mmol/L`} />
            <List.Item title="心率" description={`${currentRecord.heartRate} 次/分`} />
            <List.Item title="体检结果" description={currentRecord.result} />
            <List.Item title="医生建议" description={currentRecord.doctorAdvice} />
            <List.Item title="最后修改时间" description={new Date(currentRecord.lastModified).toLocaleString()} />
          </List>
        )}
        actions={[{
          key: 'edit',
          text: '编辑',
          onClick: handleEditRecord
        }, {
          key: 'close',
          text: '关闭',
          onClick: () => setShowDetailModal(false)
        }]}
      />

      {/* 浮动添加按钮 */}
      <div className="fab-container">
        <Button
          className="fab-button"
          color="primary"
          size="large"
          onClick={() => setShowAddModal(true)}
        >
          <AddOutline fontSize={24} />
        </Button>
      </div>

      <style jsx>{`
        .health-record-container {
          padding: var(--spacing-md);
          padding-bottom: 80px;
          position: relative;
          min-height: 100vh;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
        }

        h2 {
          margin: 0;
          font-size: var(--font-size-large);
        }
        
        .fab-container {
          position: fixed;
          bottom: 80px;
          right: 20px;
          z-index: 100;
        }
        
        .fab-button {
          width: 56px;
          height: 56px;
          border-radius: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
};

export default HealthRecordPage;