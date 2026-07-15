import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Rating = ({ value, text, color = '#FFD54F' }) => {
  return (
    <div className="rating" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      <span style={{ display: 'flex', gap: '2px' }}>
        {Array.from({ length: 5 }).map((_, index) => {
          const tempValue = index + 0.5;
          return (
            <span key={index} style={{ color }}>
              {value >= index + 1 ? (
                <FaStar />
              ) : value >= tempValue ? (
                <FaStarHalfAlt />
              ) : (
                <FaRegStar />
              )}
            </span>
          );
        })}
      </span>
      {text && <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '5px' }}>{text}</span>}
    </div>
  );
};

export default Rating;
