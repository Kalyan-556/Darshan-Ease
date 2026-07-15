import React from 'react';

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const renderSkeleton = () => {
    if (type === 'card') {
      return (
        <div className="glass-card" style={{ padding: '20px', minHeight: '300px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div className="skeleton" style={{ height: '180px', width: '100%', borderRadius: '8px' }}></div>
          <div className="skeleton" style={{ height: '24px', width: '70%' }}></div>
          <div className="skeleton" style={{ height: '16px', width: '90%' }}></div>
          <div className="skeleton" style={{ height: '16px', width: '50%' }}></div>
          <div className="skeleton" style={{ height: '40px', width: '100%', marginTop: 'auto', borderRadius: '6px' }}></div>
        </div>
      );
    }

    if (type === 'list') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div className="skeleton" style={{ height: '60px', width: '100%', borderRadius: '8px' }}></div>
          <div className="skeleton" style={{ height: '60px', width: '100%', borderRadius: '8px' }}></div>
          <div className="skeleton" style={{ height: '60px', width: '100%', borderRadius: '8px' }}></div>
        </div>
      );
    }

    if (type === 'table') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="skeleton" style={{ height: '40px', width: '100%', borderRadius: '4px' }}></div>
          <div className="skeleton" style={{ height: '30px', width: '100%', borderRadius: '4px' }}></div>
          <div className="skeleton" style={{ height: '30px', width: '100%', borderRadius: '4px' }}></div>
          <div className="skeleton" style={{ height: '30px', width: '100%', borderRadius: '4px' }}></div>
        </div>
      );
    }

    return <div className="skeleton" style={{ height: '100px', width: '100%' }}></div>;
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <React.Fragment key={i}>
          {renderSkeleton()}
        </React.Fragment>
      ))}
    </>
  );
};

export default SkeletonLoader;
