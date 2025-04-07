import React from 'react';
import { DotLoading } from 'antd-mobile';

const Loading: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#f5f5f5'
    }}>
      <DotLoading color='primary' />
      <div style={{ 
        marginTop: '12px', 
        fontSize: '14px',
        color: '#666'
      }}>
        加载中...
      </div>
    </div>
  );
};

export default Loading; 