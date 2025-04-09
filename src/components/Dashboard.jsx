import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Await } from 'react-router-dom';

const MoodflixAdmin = () => {
  const [length, setlength] = useState('0')
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    
    movieName: '',
    downloadLink: '',
    releaseYear: '',
    genre: '',
    rating: ''
  });
  const [currentMovie, setCurrentMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });
  const [adminStats, setAdminStats] = useState({
    totalMovies: 0,
    totalDownloads: 0,
    activeUsers: 0
  });

  useEffect(() => { 
    fetchMovies();
    fetchAdminStats();

  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredMovies(movies);
    } else {
      const results = movies.filter(movie => 
        movie.movieName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (movie.genre && movie.genre.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (movie.rating && movie.rating.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (movie.releaseYear && movie.releaseYear.toString().includes(searchTerm))
      );
      setFilteredMovies(results);
    }
  }, [searchTerm, movies]);

  const fetchMovies = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://movieadminpanel-8lmd.onrender.com/api/fetchmovies')
      setMovies(response.data)
      console.log("Fechted movies from db",response.data.length);
      
      
      
      setFilteredMovies(response.data);
      setIsLoading(false);
    


    } catch (error) {
      console.error("Error fetching movies:", error);
      // For demo purposes, create some mock data if API fails
      const mockData = [
        { id: 1, movieName: 'Inception', downloadLink: 'https://example.com/inception', releaseYear: 2010, genre: 'Sci-Fi', rating: 'English', downloads: 245 },
        { id: 2, movieName: 'The Shawshank Redemption', downloadLink: 'https://example.com/shawshank', releaseYear: 1994, genre: 'Drama', rating: 'English', downloads: 312 },
        { id: 3, movieName: 'Parasite', downloadLink: 'https://example.com/parasite', releaseYear: 2019, genre: 'Thriller', rating: 'Korean', downloads: 189 }
      ];
      setMovies(mockData);
      setFilteredMovies(mockData);
      setIsLoading(false);
    }
    
  };

  const fetchAdminStats = async () => {
    try {
       console.log("cheking lenghth",length)
      // This would typically be an API call
      // Mock data for demonstration
      setAdminStats({
        totalMovies: 4,
        totalDownloads: 746,
        activeUsers: 128
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    }
  };

  const addMovie = async (e, formdata) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://movieadminpanel-8lmd.onrender.com/api/movies/add', formdata);
      fetchMovies(); // Refresh the movies list
    } catch (err) {
      console.error(err);
      if (err.response) console.log(err.response.data.message);
      // For demo purposes, add the movie locally if API fails
      addMovieLocally(formdata);
    }
  };

  const addMovieLocally = (formdata) => {
    const newMovie = {
      id: Date.now(),
      movieName: formdata.movieName,
      downloadLink: formdata.downloadLink,
      releaseYear: formdata.releaseYear || '',
      genre: formdata.genre || '',
      rating: formdata.rating || '',
      downloads: 0
    };
    
    setMovies(prevMovies => [...prevMovies, newMovie]);
    setAdminStats(prev => ({
      ...prev,
      totalMovies: prev.totalMovies + 1
    }));
  };

  const updateMovie = async (e, formdata) => {
    e.preventDefault();
    try {
      const res = await axios.put(`https://movieadminpanel-8lmd.onrender.com/api/movies/${currentMovie.id}`, formdata);
      fetchMovies(); // Refresh the movies list
    } catch (err) {
      console.error(err);
      if (err.response) console.log(err.response.data.message);
      // For demo purposes, update the movie locally if API fails
      updateMovieLocally(currentMovie.id, formdata);
    }
  };

  const updateMovieLocally = (id, formdata) => {
    setMovies(prevMovies => 
      prevMovies.map(movie => 
        movie.id === id 
          ? { ...movie, ...formdata }
          : movie
      )
    );
  };

  const deleteMovie = async (id) => {
    try {
      await axios.delete(`https://movieadminpanel-8lmd.onrender.com/api/movies/${id}`);
      fetchMovies(); // Refresh the movies list
    } catch (err) {
      console.error(err);
      // For demo purposes, delete the movie locally if API fails
      deleteMovieLocally(id);
    }
  };

  const deleteMovieLocally = (id) => {
    setMovies(prevMovies => prevMovies.filter(movie => movie.id !== id));
    setAdminStats(prev => ({
      ...prev,
      totalMovies: prev.totalMovies - 1
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.movieName || !formData.downloadLink) {
      alert('Please fill in all required fields');
      return;
    }
    
    addMovie(e, formData);
    
    // Reset form and hide it
    setFormData({ 
      movieName: '', 
      downloadLink: '', 
      releaseYear: '', 
      genre: '', 
      rating: '' 
    });
    setShowAddForm(false);
  };

  const handleEdit = (movie) => {
    setCurrentMovie(movie);
    setFormData({
      movieName: movie.movieName,
      downloadLink: movie.downloadLink,
      releaseYear: movie.releaseYear || '',
      genre: movie.genre || '',
      rating: movie.rating || ''
    });
    setShowEditForm(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.movieName || !formData.downloadLink) {
      alert('Please fill in all required fields');
      return;
    }
    
    updateMovie(e, formData);
    
    // Reset form and hide it
    setFormData({ 
      movieName: '', 
      downloadLink: '', 
      releaseYear: '', 
      genre: '', 
      rating: '' 
    });
    setCurrentMovie(null);
    setShowEditForm(false);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    
    const sortedMovies = [...filteredMovies].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredMovies(sortedMovies);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return (
        <svg className="w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    return sortConfig.direction === 'ascending' ? (
      <svg className="w-4 h-4 ml-1 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 ml-1 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/* Header/Nav */}
      <header className="bg-black py-4 px-6 shadow-md sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg className="w-8 h-8 mr-2 text-red-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2 0h1V9h-1v2zm1-4V5h-1v2h1zM5 5v2H4V5h1zm0 4H4v2h1V9zm-1 4h1v2H4v-2z" clipRule="evenodd" />
            </svg>
            <h1 className="text-2xl font-bold">
              <span className="text-red-600">Moodflix</span>Admin
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
            </div>
            <span className="mr-2 text-gray-400">MovieBuff Team</span>
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-grow">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-200 text-sm">Total Movies</p>
                <h3 className="text-3xl font-bold text-white">{adminStats.totalMovies}</h3>
              </div>
              <div className="bg-indigo-700 p-3 rounded-lg">
                <svg className="w-8 h-8 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-teal-900 to-emerald-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-200 text-sm">Total Downloads</p>
                <h3 className="text-3xl font-bold text-white">{adminStats.totalDownloads}</h3>
              </div>
              <div className="bg-emerald-700 p-3 rounded-lg">
                <svg className="w-8 h-8 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-900 to-orange-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-200 text-sm">Active Users</p>
                <h3 className="text-3xl font-bold text-white">{adminStats.activeUsers}</h3>
              </div>
              <div className="bg-orange-700 p-3 rounded-lg">
                <svg className="w-8 h-8 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-xl font-semibold mb-4 md:mb-0">Movie Management</h2>
            <div className="flex flex-col md:flex-row w-full md:w-auto space-y-4 md:space-y-0 md:space-x-4">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64 p-2 pl-10 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              {/* Add Movie Button */}
              {!showAddForm && !showEditForm && (
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Movie
                </button>
              )}
            </div>
          </div>

          {/* Add Movie Form */}
          {showAddForm && (
            <div className="bg-gray-700 p-6 rounded-lg shadow-inner mb-6 border border-gray-600">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Add New Movie</h3>
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="movieName" className="block text-sm font-medium mb-1 text-gray-300">Movie Name *</label>
                    <input
                      type="text"
                      id="movieName"
                      name="movieName"
                      value={formData.movieName}
                      onChange={handleChange}
                      placeholder="Enter movie title"
                      className="w-full p-3 bg-gray-800 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="downloadLink" className="block text-sm font-medium mb-1 text-gray-300">Download Link *</label>
                    <input
                      type="url"
                      id="downloadLink"
                      name="downloadLink"
                      value={formData.downloadLink}
                      onChange={handleChange}
                      placeholder="https://example.com/movie"
                      className="w-full p-3 bg-gray-800 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="releaseYear" className="block text-sm font-medium mb-1 text-gray-300">Release Year</label>
                    <input
                      type="number"
                      id="releaseYear"
                      name="releaseYear"
                      value={formData.releaseYear}
                      onChange={handleChange}
                      placeholder="2023"
                      className="w-full p-3 bg-gray-800 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="genre" className="block text-sm font-medium mb-1 text-gray-300">Genre</label>
                    <input
                      type="text"
                      id="genre"
                      name="genre"
                      value={formData.genre}
                      onChange={handleChange}
                      placeholder="Action, Drama, Comedy, etc."
                      className="w-full p-3 bg-gray-800 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="rating" className="block text-sm font-medium mb-1 text-gray-300">rating</label>
                    <input
                      type="text"
                      id="rating"
                      name="rating"
                      value={formData.rating}
                      onChange={handleChange}
                      placeholder="English, Spanish, etc."
                      className="w-full p-3 bg-gray-800 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded flex items-center transition duration-200"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Movie
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Edit Movie Form */}
          {showEditForm && currentMovie && (
            <div className="bg-gray-700 p-6 rounded-lg shadow-inner mb-6 border border-gray-600">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Edit Movie: {currentMovie.movieName}</h3>
                <button 
                  onClick={() => {
                    setShowEditForm(false);
                    setCurrentMovie(null);
                    setFormData({ 
                      movieName: '', 
                      downloadLink: '', 
                      releaseYear: '', 
                      genre: '', 
                      rating: '' 
                    });
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleUpdate}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="movieName" className="block text-sm font-medium mb-1 text-gray-300">Movie Name *</label>
                    <input
                      type="text"
                      id="movieName"
                      name="movieName"
                      value={formData.movieName}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-800 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="downloadLink" className="block text-sm font-medium mb-1 text-gray-300">Download Link *</label>
                    <input
                      type="url"
                      id="downloadLink"
                      name="downloadLink"
                      value={formData.downloadLink}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-800 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="releaseYear" className="block text-sm font-medium mb-1 text-gray-300">Release Year</label>
                    <input
                      type="number"
                      id="releaseYear"
                      name="releaseYear"
                      value={formData.releaseYear}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-800 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="genre" className="block text-sm font-medium mb-1 text-gray-300">Genre</label>
                    <input
                      type="text"
                      id="genre"
                      name="genre"
                      value={formData.genre}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-800 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="rating" className="block text-sm font-medium mb-1 text-gray-300">rating</label>
                    <input
                      type="text"
                      id="rating"
                      name="rating"
                      value={formData.rating}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-800 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditForm(false);
                      setCurrentMovie(null);
                      setFormData({ 
                        movieName: '', 
                        downloadLink: '', 
                        releaseYear: '', 
                        genre: '', 
                        rating: '' 
                      });
                    }}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded flex items-center transition duration-200"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Update Movie
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Movies Table */}
          <div  className="overflow-x-auto rounded-lg border border-gray-700">
            <table className="w-full text-left">
              <thead className="bg-gray-700 text-gray-300">
                <tr>
                  <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('id')}>
                    <div className="flex items-center">
                      ID {getSortIcon('_id')}
                    </div>
                  </th>
                  <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('movieName')}>
                    <div className="flex items-center">
                      Movie Name {getSortIcon('movieName')}
                    </div>
                  </th>
                  <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('releaseYear')}>
                    <div className="flex items-center">
                      Year {getSortIcon('releaseYear')}
                    </div>
                  </th>
                  <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('genre')}>
                    <div className="flex items-center">
                      Genre {getSortIcon('genre')}
                    </div>
                  </th>
                  <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('rating')}>
                    <div className="flex items-center">
                      rating {getSortIcon('rating')}
                    </div>
                  </th>
                  <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('downloads')}>
                    <div className="flex items-center">
                      Downloads {getSortIcon('downloads')}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-10 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="animate-spin w-8 h-8 mb-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Loading movies...
                      </div>
                    </td>
                  </tr>
                ) : filteredMovies.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-10 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-10 h-10 mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {searchTerm ? 'No movies matching your search' : 'No movies found'}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredMovies.map((movie) => (
                    // console.log("cheking moviedata",movie)
                    <tr key={movie._id} className="hover:bg-gray-700">
                      <td className="px-4 py-3 text-gray-400">{movie._id}</td>
                      <td className="px-4 py-3 font-medium">{movie.movieName}</td>
                      <td className="px-4 py-3 text-gray-300">{movie.releaseYear}</td>
                      <td className="px-4 py-3">
                        {movie.genre && (
                          <span className="inline-block px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                            {movie.genre}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {movie.rating && (
                          <span className="inline-block px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                            {movie.rating}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                          </svg>
                          {movie.downloads || 0}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center space-x-3">
                          <button 
                            onClick={() => handleEdit(movie)} 
                            className="text-blue-400 hover:text-blue-300 transition"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete "${movie.movieName}"?`)) {
                                deleteMovie(movie.id);
                              }
                            }} 
                            className="text-red-400 hover:text-red-300 transition"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                          <a 
                            href={movie.downloadLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-green-400 hover:text-green-300 transition"
                            title="Download Link"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6 text-gray-400">
            <div>Showing {filteredMovies.length} of {movies.length} movies</div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-3 py-1 bg-red-600 text-white rounded">1</button>
              <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50" disabled>
                Next
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black py-4 text-center text-gray-500 text-sm">
        <p>© 2025 Moodflix Admin Dashboard. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MoodflixAdmin;