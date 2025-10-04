// src/components/Common/TelegramButton.jsx
import React from 'react';
import { FaTelegram } from "react-icons/fa";

const TelegramButton = ({ openTelegramChannel }) => {
    return (
        <button
          onClick={openTelegramChannel}
          className="btn text-sm md:text-base px-4 py-2 rounded-lg shadow-lg button h-auto min-h-[44px] no-hover flex items-center gap-2"
        >
            <FaTelegram className="w-6 h-6 md:w-9 md:h-9" strokeWidth={2} />
            <span className="hidden xs:inline">Join Telegram</span>
        </button>
    );
};

export default TelegramButton;
