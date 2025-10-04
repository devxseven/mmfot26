// src/components/Home/ChannelList.jsx
import React from 'react';

const ChannelList = ({ channels, loading, onChannelClick }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="skeleton-card h-24 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (channels.length === 0) {
    return <p className="text-center text-gray-600">No channels found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {channels.map(channel => (
        <div
          key={channel.name}
          className="card shadow-xl cursor-pointer flex items-center justify-center h-24 rounded-lg"
          onClick={() => onChannelClick(channel)}
        >
          <span className="text-sm md:text-lg font-bold text-center">{channel.name}</span>
        </div>
      ))}
    </div>
  );
};

export default ChannelList;