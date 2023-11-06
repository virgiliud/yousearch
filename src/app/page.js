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
  const [error, setError] = useState(null);

  // To do: add key to env
  async function fetchVideos(term, sort, pageToken = '') {
    if (!term) return; // If no search term, exit the function
  
    try {
      const maxResults = 2;
      let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        term
      )}&order=${sort}&maxResults=${maxResults}&key=AIzaSyCrSqbzxSTiNWD-fIBkxOhVGuS3KyP7eJg`;
  
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
        setVideos(prevVideos => {
          // Create a new map with IDs as the keys for quick lookup
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
    }
  }

  // Function to fetch videos with a new search
  const handleSearch = () => {
    setVideos([]);
    setSelectedVideo(null); // Clear the selected video when a new search is made
    setNextPageToken(null); // Clear the nextPageToken for a fresh search
    fetchVideos(searchTerm, sort); // Fetch new videos and clear previous state
  }

  // Toggle dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Define your sort options with both value and label
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

  // Function to fetch videos when "Load More" is clicked
  const handleLoadMore = () => {
    fetchVideos(searchTerm, sort, nextPageToken);
  }

  const saveVideo = (video) => {
    setSavedVideos((prevSavedVideos) => {
      // Check if the video is already saved
      if (prevSavedVideos.find((savedVideos) => savedVideos.id.videoId === video.id.videoId)) {
        return prevSavedVideos; // Return the current saved videos unchanged
      }
      return [...prevSavedVideos, video]; // Add the new video to the saved list
    });
  }

  const removeFromSaved = (videoId) => {
    setSavedVideos(savedVideos.filter((video) => video.id.videoId !== videoId));
  };
  
  return (
    <div className="container mx-auto p-4">
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

      <div className={`flex ${selectedVideo ? 'flex-col lg:flex-row' : ''}`}>
        <VideoList 
          videos={videos} 
          setSelectedVideo={setSelectedVideo} 
          saveVideo={saveVideo} 
          selectedVideo={selectedVideo}
          handleLoadMore={handleLoadMore}
          nextPageToken={nextPageToken}
        />

        <MainVideo selectedVideo={selectedVideo} />        
      </div>

      <WatchLater
        savedVideos={savedVideos} 
        setSelectedVideo={setSelectedVideo} 
        removeFromSaved={removeFromSaved} 
      />   
    </div>
  );
  
}
