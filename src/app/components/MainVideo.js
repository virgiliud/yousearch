import React from 'react';

const MainVideo = ({ selectedVideo }) => (
  <div className={`px-2 ${selectedVideo ? 'w-full lg:w-2/3' : 'hidden'}`}>
    {selectedVideo && 
      <div className="w-full p-4 border rounded-lg shadow-lg">
        <div className="relative overflow-hidden mb-4" style={{ paddingBottom: '56.25%' }}>
          <iframe 
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${selectedVideo.id.videoId}`}
            title="video"
            allowFullScreen
          ></iframe>
        </div>
        <h2 className="text-2xl mb-2">{selectedVideo.snippet.title}</h2>
        <p className="text-gray-700 text-base mb-4">{selectedVideo.snippet.description}</p> 
      </div>
    }
  </div>
);

export default MainVideo;
