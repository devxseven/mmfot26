// src/components/Common/ReloadButton.jsx
import React from 'react';
import { TbReload } from "react-icons/tb";

const ReloadButton = ({ reloadApp }) => {
  return (
    <button
      onClick={reloadApp}
      className="btn text-sm md:text-base px-4 py-2 rounded-lg shadow-lg button h-auto min-h-[44px] border no-hover flex items-center gap-2"
    >
      <TbReload className="w-6 h-6 md:w-9 md:h-9" strokeWidth={2} />
    </button>
  );
};

export default ReloadButton;