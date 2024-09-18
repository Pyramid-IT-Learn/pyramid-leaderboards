// Home.tsx
import React, { useState, useEffect } from 'react';
import CustomDropdown from './CustomDropdown';
import { fetchDatabases, fetchCollections } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const [databases, setDatabases] = useState<string[]>([]);
  const [collections, setCollections] = useState<string[]>([]);
  const [selectedDatabase, setSelectedDatabase] = useState<string>('');
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDatabasesData = async () => {
      try {
        const response = await fetchDatabases();
        setDatabases(response.data);
      } catch (error) {
        console.error('Error fetching databases:', error);
      }
    };

    fetchDatabasesData();
  }, []);

  const handleDatabaseChange = async (db: string) => {
    setSelectedDatabase(db);
    try {
      const response = await fetchCollections(db);
      setCollections(response.data);
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  const handleCollectionChange = (collection: string) => {
    setSelectedCollection(collection);
  };

  const handleViewLeaderboard = () => {
    if (selectedDatabase && selectedCollection) {
      navigate(`/pyramid-leaderboards/leaderboard/${selectedDatabase}/${selectedCollection}`);
    }
  };

  return (
    <div className="text-center py-8 px-4 sm:py-16 sm:px-6 animate-fade-in">
      <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-primary-600 text-shadow-glow shadow-primary-700">
        Welcome to Pyramid Ranker
      </h1>
      <p className="text-lg sm:text-xl mb-10 text-dark-300">
        Select a college and batch to view and manage leaderboards.
      </p>
      <div className="flex flex-col items-center space-y-6">
        <CustomDropdown
          options={databases}
          value={selectedDatabase}
          onChange={handleDatabaseChange}
          placeholder="Select College"
        />
        {selectedDatabase && (
          <CustomDropdown
            options={collections}
            value={selectedCollection}
            onChange={handleCollectionChange}
            placeholder="Select Batch"
          />
        )}
        <button
          onClick={handleViewLeaderboard}
          className="bg-primary-600 text-dark-50 font-bold py-3 px-6 rounded-full hover:bg-primary-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!selectedDatabase || !selectedCollection}
        >
          View Leaderboard
        </button>
      </div>
      <p className="text-sm text-dark-200 mt-12">
        App By:{' '}
        <a href="https://www.instagram.com/gabyah92" className="text-primary-400 hover:underline">
          gabyah92
        </a>{' '}
        &{' '}
        <a href="https://github.com/dog-broad" className="text-primary-400 hover:underline">
          Rushyendra
        </a>
      </p>
    </div>
  );
};

export default Home;