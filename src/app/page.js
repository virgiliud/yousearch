"use client"

import React, { useState } from 'react';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [error, setError] = useState(null);

  // To do: add key to env
  async function fetchVideos(searchTerm) {
    try {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchTerm}&key=AIzaSyCbGMoFO_byFkJfoYBK8HbuyGrx2jBifkc`);
      if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
      const data = await response.json();
      if (data.items.length === 0) throw new Error('No search results were returned.');
      setVideos(data.items);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center mb-8">
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded mr-2 flex-grow"
          placeholder="Search for videos..."
        />
        <button onClick={() => fetchVideos(searchTerm)} className="bg-blue-500 text-white p-2 rounded">Search</button>
      </div>

      <div className="flex flex-col-reverse md:flex-row">

        <div className="w-full md:w-1/3 flex md:block overflow-x-auto md:overflow-y-auto">
          <div className="mb-4">
            <h1 className="text-xl">Videos</h1>
          </div>

          <ul className="flex md:flex-col space-x-4 md:space-x-0 md:space-y-4">
            {videos.map(video => (
              <li key={video.id.videoId} className="flex-none md:flex mb-4 md:mb-0 cursor-pointer" onClick={() => setSelectedVideo(video)}>
                <img src={`http://img.youtube.com/vi/${video.id.videoId}/mqdefault.jpg`} alt={video.snippet.title} className="w-full md:w-1/3 object-cover h-24 md:h-auto md:mr-2" />
                <div className="flex flex-col justify-center md:w-2/3">
                  <h2 className="text-sm md:text-md">{video.snippet.title}</h2>
                  <p className="text-xs md:text-sm">{video.snippet.channelTitle}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full md:w-2/3 mb-4 md:mb-0">
          {selectedVideo && (
            <div className="w-full p-4 border rounded">
              <h2 className="text-xl mb-2">{selectedVideo.snippet.title}</h2>
              <p className="mb-4">{selectedVideo.snippet.description}</p>

              <div className="relative" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${selectedVideo.id.videoId}`}
                  title={selectedVideo.snippet.title}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
);


}
