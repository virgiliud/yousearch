import React from 'react';
import { Tooltip } from 'react-tooltip';
import { Clock } from 'react-feather';

const VideoList = ({ videos, setSelectedVideo, saveVideo, selectedVideo, handleLoadMore, nextPageToken }) => (
  <div className={`px-2 ${selectedVideo ? 'w-full lg:w-1/3' : 'w-full'}`}>       
    {/* On small screens, show horizontal scrollbar */}
    <div className={`${selectedVideo ? 'flex' : ''} lg:block overflow-x-auto lg:overflow-x-hidden lg:overflow-y-auto`}>
      <ul className={`${selectedVideo ? 'flex' : ''} lg:flex-col space-x-4 lg:space-x-0 mb-4`}>
        {videos.length > 0 ? (
          videos.map((video) => (
            <li 
              key={video.id.videoId} 
              onClick={() => setSelectedVideo(video)} 
              className="flex-none w-60 lg:w-full lg:flex items-start lg:mb-0 bg-white rounded-lg cursor-pointer group hover:bg-gray-100 p-2"
            >
              <div className={`${selectedVideo ? 'lg:w-36' : 'lg:w-72'} shrink-0 mb-2 lg:mb-0 lg:mr-4 lg:mr-2 relative`}>
                <div data-tooltip-id={`watchLaterTooltip-${video.id.videoId}`} data-tooltip-content="Watch Later" className="absolute top-0 right-0 m-1 p-1 bg-black rounded opacity-0 group-hover:opacity-100 z-10">
                  <Clock 
                    className="text-white hover:text-blue-500" 
                    size={20} 
                    onClick={(event) => {
                      event.stopPropagation();
                      saveVideo(video);
                    }} 
                    title="Watch Later"
                  />

                  <Tooltip id={`watchLaterTooltip-${video.id.videoId}`} />
                </div>

                <img 
                  src={`https://img.youtube.com/vi/${video.id.videoId}/mqdefault.jpg`} 
                  alt={video.snippet.title} 
                  className="w-full rounded-lg" 
                />                     
              </div>

              <div>
                <h5 className="text-sm font-semibold lg:line-clamp-2">{video.snippet.title}</h5>
                <p className="text-gray-500 text-sm mb-2">{video.snippet.channelTitle}</p>                    
              </div>                    
            </li>
          ))
        ) : (
          <div className="text-gray-500 text-center lg:text-left">
            Enter a search term to find videos.
          </div>
        )}
      </ul>

      <button 
        onClick={handleLoadMore} 
        className={`${!nextPageToken ? 'hidden' : ''} bg-blue-500 text-white p-2 rounded w-full`}
      >
        Load More
      </button>
    </div>
  </div>
);

export default VideoList;
