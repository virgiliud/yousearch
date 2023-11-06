import React from 'react';
import { Tooltip } from 'react-tooltip';
import { X } from 'react-feather';
import Title from './Title';

const WatchLater = ({ savedVideos, setSelectedVideo, selectedVideo, removeFromSaved }) => {
  
  const handleVideoClick = (video) => {
    setSelectedVideo(video); // Set the selected video
    
    // Scroll to the top of the page
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    }); 
  };

  return (
    <>
    {savedVideos.length > 0 &&
      
      <div className="mt-12">
        <Title 
          text="Watch Later" 
          shouldDisplay={savedVideos.length > 0} 
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 -mx-2">
          {savedVideos.map((video) => (
            <div 
              key={video.id.videoId} 
              onClick={() => handleVideoClick(video)}
              className={`${video.id.videoId === selectedVideo?.id?.videoId ? 'bg-gray-100' : 'bg-white'} rounded-lg cursor-pointer group hover:bg-gray-100 p-2`}
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
              
              <h5 className="text-md mt-2 font-semibold line-clamp-2">{video.snippet.title}</h5>
              <p className="text-sm text-gray-600">{video.snippet.channelTitle}</p>
            </div>
          ))}
        </div>
      </div>
    }
    </>
  )
}

export default WatchLater;
