// src/components/Player/MatchPlayer.jsx
import React, { useState } from 'react';
import VideoPlayer from '../player/VideoPlayer';
import VideoPlayerButtons from '../player/VideoPlayerButtons';
import { generateStreamUrl } from '../../utils/streamUtils';

const MatchPlayer = ({ match, authKey, isFullscreen, tg }) => {
  const [selectedStream, setSelectedStream] = useState(null);
  const [currentStreamUrl, setCurrentStreamUrl] = useState('');

  const handleStreamSelect = React.useCallback(
    (stream, streamUrl = '') => {
      setSelectedStream(stream);

      // If streamUrl is provided, use it directly
      if (streamUrl) {
        setCurrentStreamUrl(streamUrl);
      } else {
        // Otherwise generate the URL
        const generatedUrl = generateStreamUrl(stream.url, stream.name, authKey);
        setCurrentStreamUrl(generatedUrl);
      }
    },
    [authKey]
  );
  // Set default stream when match loads
  React.useEffect(() => {
    if (match?.links?.length > 0 && !selectedStream) {
      const defaultStream = match.links.find(link => link.name === 'VN HD 1') || match.links[0];
      handleStreamSelect(defaultStream);
    }
  }, [match, selectedStream, handleStreamSelect]);

  const reloadApp = () => {
    window.location.reload();
  };

  if (match.links.length === 0) {
    return (
      <div className="timer-mm">
        No streams available for this match. Please click <a href='#' className='text-red-500' onClick={reloadApp}>reload</a>.
      </div>
    );
  }

  return (
    <div id="match-player">
      {currentStreamUrl && (
        <VideoPlayer
          streamUrl={currentStreamUrl}
          isFullscreen={isFullscreen}
          tg={tg}
        />
      )}

      <VideoPlayerButtons
        streams={match.links}
        selectedStream={selectedStream}
        onStreamSelect={handleStreamSelect}
        authKey={authKey}
      />
    </div>
  );
};

export default MatchPlayer;