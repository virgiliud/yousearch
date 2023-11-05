"use client"

import React, { useState } from 'react';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [videos, setVideos] = useState([]);
  const [order, setOrder] = useState('relevance');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null); 
  const [error, setError] = useState(null);

  // To do: add key to env
  async function fetchVideos(term, order, pageToken = '') {
    if (!term) return; // If no search term, exit the function

    // Inside the fetchVideos function
    console.log('Fetching videos with token:', pageToken); // Log the current page token

  
    try {
      const maxResults = 10;
      let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        term
      )}&order=${order}&maxResults=${maxResults}&key=AIzaSyCbGMoFO_byFkJfoYBK8HbuyGrx2jBifkc`;
  
      if (pageToken) {
        url += `&pageToken=${pageToken}`;
      }
  
      const response = await fetch(url);      

      // Check for HTTP errors
      if (!response.ok) {
        // If we can parse the error as JSON, then we should do so to get more information about the issue.
        const errorResponse = await response.json();
        throw new Error(`API Error: ${errorResponse.error.message} (Code: ${errorResponse.error.code})`);
      }

      const data = await response.json();
  
      if (data.items.length === 0) throw new Error('No search results found');
  
      // Conditional to append or replace video list based on the presence of a page token
      if (pageToken) {
        setVideos(prevVideos => [...prevVideos, ...data.items]);
      } else {
        setVideos(data.items); // Replace with new search results if there's no page token
      }
  
      setNextPageToken(data.nextPageToken);
      setError(null);

      // After fetching data within the fetchVideos function
      console.log('New nextPageToken:', data.nextPageToken);
      console.log('Received videos count:', data.items.length);

      console.log(term, order);


    } catch (error) {
      console.log(error.message);
      setError(error.message);
    }
  }

  // Function to fetch videos with a new search
  const handleSearch = () => {
    setVideos([]);
    setSelectedVideo(null); // Clear the selected video when a new search is made
    setNextPageToken(null); // Clear the nextPageToken for a fresh search
    fetchVideos(searchTerm, order); // Fetch new videos and clear previous state
  };

  // Function to fetch videos when "Load More" is clicked
  function handleLoadMore() {
    fetchVideos(searchTerm, order, nextPageToken);
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-wrap justify-center mb-8">
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded mr-2 flex-grow w-full sm:w-auto"
          placeholder="Search for videos..."
        />

        <button 
          onClick={handleSearch} 
          className="bg-blue-500 text-white p-2 rounded w-full sm:w-auto mt-2 sm:mt-0 sm:ml-2"
        >
          Search
        </button>
      </div>

      <div className="flex mb-4">
        <select 
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="relevance">Relevance</option>
          <option value="date">Date</option>
          <option value="viewCount">View Count</option>
        </select>
        <button 
          onClick={handleSearch} 
          className="bg-blue-500 text-white p-2 rounded ml-2"
        >
          Sort
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5 flex justify-between" role="alert">
          <div>
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
          <div>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
              <span className="text-xl">&times;</span>
            </button>
          </div>
        </div>
      )}

  
      <div className={`flex ${selectedVideo ? 'flex-col lg:flex-row' : ''} -mx-2`}>
        {/* Video List */}
        <div className={`px-2 ${selectedVideo ? 'w-full lg:w-1/3' : 'w-full'}`}>
          {/* On small screens, show horizontal scrollbar */}
          <div className={`${selectedVideo ? 'flex' : ''} lg:block overflow-x-auto lg:overflow-x-hidden lg:overflow-y-auto`}>
            <ul className={`${selectedVideo ? 'flex' : ''} lg:flex-col space-x-4 lg:space-x-0 mb-4`}>
              {videos.length > 0 ? (
                videos.map((video) => (
                  <li 
                    key={video.id.videoId} 
                    onClick={() => setSelectedVideo(video)} 
                    className="flex-none w-60 lg:w-full lg:flex items-start lg:mb-0 bg-white rounded-lg cursor-pointer hover:bg-gray-100 p-2"
                  >
                    <img 
                      src={`http://img.youtube.com/vi/${video.id.videoId}/mqdefault.jpg`} 
                      alt={video.snippet.title} 
                      className={`${selectedVideo ? 'lg:w-36' : 'lg:w-72'} w-full object-cover rounded-lg mb-2 lg:mb-0 mr-4 lg:mr-2`} 
                    />
                    <div className="flex flex-col justify-between leading-normal">
                      <h5 className="text-sm font-semibold">{video.snippet.title}</h5>
                      <p className="text-gray-500 text-sm">{video.snippet.channelTitle}</p>
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
  
        {/* Selected Video Details */}
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
      </div>
    </div>
  );
  
}
