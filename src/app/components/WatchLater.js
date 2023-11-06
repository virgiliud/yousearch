import React from 'react';
import { Tooltip } from 'react-tooltip';
import { X } from 'react-feather';

const WatchLater = ({ savedVideos, setSelectedVideo, removeFromSaved }) => (
  <>
  {savedVideos.length > 0 &&
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Watch Later</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4">
        {savedVideos.map((video) => (
          <div 
            key={video.id.videoId} 
            onClick={() => setSelectedVideo(video)} 
            className="bg-white rounded-lg cursor-pointer group hover:bg-gray-100 p-2"
          >
            <div className="relative">
              <div data-tooltip-id={`removeTooltip-${video.id.videoId}`} data-tooltip-content="Remove" className="bg-black absolute top-0 right-0 m-1 p-1 rounded z-10 opacity-0 group-hover:opacity-100">
                <X 
                  className="text-white hover:text-red-500" 
                  size={20} 
                  onClick={(event) => {
                    event.stopPropagation();
                    removeFromSaved(video.id.videoId);
                  }} 
                  title="Remove from Watch Later"
                />

                <Tooltip id={`removeTooltip-${video.id.videoId}`} />
              </div>

              

              <img src={`http://img.youtube.com/vi/${video.id.videoId}/mqdefault.jpg`} alt={video.snippet.title} className="w-full rounded-lg" />
            </div>
            
            <h5 className="text-md mt-2 font-semibold">{video.snippet.title}</h5>
            <p className="text-sm text-gray-600">{video.snippet.channelTitle}</p>
          </div>
        ))}
      </div>
    </div>
  }
  </>
);

export default WatchLater;
