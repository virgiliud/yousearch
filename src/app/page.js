"use client"

import React, { useState } from 'react';

import SearchBar from './components/SearchBar';
import VideoList from './components/VideoList';
import MainVideo from './components/MainVideo';
import WatchLater from './components/WatchLater';
import ErrorMessage from './components/ErrorMessage';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [videos, setVideos] = useState([]);
  const [savedVideos, setSavedVideos] = useState([]);
  const [sort, setSort] = useState('relevance');
  const [sortLabel, setSortLabel] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);

  async function fetchVideos(term, sort, pageToken = '') {
    if (!term) return; // Exit of no search term

    setLoading(true);
  
    try {
      const maxResults = 6;
      
      let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        term
      )}&order=${sort}&maxResults=${maxResults}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`;
  
      if (pageToken) {
        url += `&pageToken=${pageToken}`;
      }
      
      // Get the response
      const response = await fetch(url);      

      // Check for HTTP errors
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(`API Error: ${errorResponse.error.message} (Code: ${errorResponse.error.code})`);
      }

      // Parse the data as JSON
      const data = await response.json();
      
      // If no search results
      if (data.items.length === 0) throw new Error('No search results found');
  
      // Append or replace video list based on the page token
      if (pageToken) {
        setVideos(prevVideos => {
          // Create a new map with IDs as the keys
          const existingIds = new Map(prevVideos.map(video => [video.id.videoId, video]));

          // Filter out any new videos that already exist based on their ID
          const uniqueNewVideos = data.items.filter(video => !existingIds.has(video.id.videoId));

          // Append the unique new videos to the previous list
          return [...prevVideos, ...uniqueNewVideos];
        });
      } else {
        setVideos(data.items); // Replace with new search results if there's no page token
      }
  
      setNextPageToken(data.nextPageToken);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  // Fetch videos with a new search
  const handleSearch = () => {
    setVideos([]);
    setSelectedVideo(null); 
    setNextPageToken(null); 
    fetchVideos(searchTerm, sort); // Fetch new videos and clear previous state
  }

  // Toggle dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Sort options
  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'date', label: 'Date' },
    { value: 'viewCount', label: 'Views' },
  ];

  // Handle option click
  const handleOptionClick = (option) => {
    setSort(option.value);
    setSortLabel(option.label)
    setDropdownOpen(false); // Close dropdown
  };

  // Fetch videos when "Load More" is clicked
  const handleLoadMore = () => {
    fetchVideos(searchTerm, sort, nextPageToken);
  }

  // Save video
  const saveVideo = (video) => {
    setSavedVideos((prevSavedVideos) => {
      // Check if the video is already saved
      if (prevSavedVideos.find((savedVideos) => savedVideos.id.videoId === video.id.videoId)) {
        return prevSavedVideos; // Return the current saved videos unchanged
      }
      return [...prevSavedVideos, video]; // Add the new video to the saved list
    });
  }

  // Remove video from saved
  const removeFromSaved = (videoId) => {
    setSavedVideos(savedVideos.filter((video) => video.id.videoId !== videoId));
  };
  
  return (
    <div className="container max-w-[1280px] mx-auto p-4 mb-6">
      <SearchBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        toggleDropdown={toggleDropdown}
        dropdownOpen={dropdownOpen}
        sortOptions={sortOptions}
        handleOptionClick={handleOptionClick}
        sort={sort}
        sortLabel={sortLabel}
      />

      <ErrorMessage
        error={error}
        setError={setError}  
      />

      <div className={`flex ${selectedVideo ? 'flex-col-reverse lg:flex-row' : ''}`}>
        <VideoList 
          videos={videos} 
          setSelectedVideo={setSelectedVideo} 
          saveVideo={saveVideo} 
          selectedVideo={selectedVideo}
          handleLoadMore={handleLoadMore}
          nextPageToken={nextPageToken}
          loading={loading}
        />
        
        <MainVideo 
          selectedVideo={selectedVideo} 
        />        
      </div>

      <WatchLater
        savedVideos={savedVideos} 
        setSelectedVideo={setSelectedVideo} 
        selectedVideo={selectedVideo}
        removeFromSaved={removeFromSaved} 
      />   
    </div>
  );
  
}
