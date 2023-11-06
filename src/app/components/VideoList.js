import React from 'react';
import { Tooltip } from 'react-tooltip';
import { Clock } from 'react-feather';
import Title from './Title';

const VideoList = ({ videos, setSelectedVideo, saveVideo, selectedVideo, handleLoadMore, nextPageToken, loading }) => (
  <div className={`${selectedVideo ? 'w-full lg:w-1/3' : 'w-full'}`}>  
    <Title 
      text="Video Results" 
      shouldDisplay={videos.length > 0} 
    />

    <div>
      <ul className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 ${selectedVideo ? ' pr-4 lg:block' : ''} -mx-2`}>
        {videos.length > 0 ? (
          videos.map((video) => (
            <li 
              key={video.id.videoId} 
              onClick={() => setSelectedVideo(video)} 
              className={`${video.id.videoId === selectedVideo?.id?.videoId ? 'bg-gray-100' : 'bg-white'} flex-none lg:w-full 
              ${selectedVideo ? 'lg:flex' : ''} items-start rounded-lg cursor-pointer group hover:bg-gray-100 mb-2 p-2`}
            >
              <div className={`${selectedVideo ? 'lg:w-36 lg:mr-4 shrink-0' : 'mb-2'} relative`}>
                <div 
                  data-tooltip-id={`watchLaterTooltip-${video.id.videoId}`} 
                  data-tooltip-content="Watch Later" 
                  className="absolute top-0 right-0 m-1 p-1 bg-black rounded opacity-0 group-hover:opacity-100 z-10"
                  onClick={(event) => {
                    event.stopPropagation();
                    saveVideo(video);
                  }} 
                >
                  <Clock 
                    className="text-white hover:text-blue-500" 
                    size={20} 
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
                <h5 className="text-sm font-semibold line-clamp-2 mt-2 lg:mt-0">{video.snippet.title}</h5>
                <p className="text-gray-500 text-sm mb-2">{video.snippet.channelTitle}</p>                    
              </div>                    
            </li>
          ))
        ) : (
          <div className="text-gray-500 text-center p-2 lg:text-left">
            { loading ? 'Loading...' : 'Enter a search term to find videos' }       
          </div>
        )}
      </ul>

      <button
        onClick={handleLoadMore}
        disabled={loading} 
        className={`${
          !nextPageToken ? 'hidden' : '' // Hide if no next page token
        } text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900 mt-2 p-2 rounded w-full transition-opacity duration-150 ease-in-out`}
      >
        {loading ? 'Loading...' : 'Load More'}
      </button>
    </div>
  </div>
);

export default VideoList;
