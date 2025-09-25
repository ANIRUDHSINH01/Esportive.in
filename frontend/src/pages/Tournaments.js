import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const games = [
    'BGMI',
    'Free Fire', 
    'CODM',
    'Clash Of Clans',
    'Clash Royale',
    'Brawl Stars',
    'Pokemon Unite'
  ];

  useEffect(() => {
    fetchTournaments();
  }, [currentPage, selectedGame]);

  const fetchTournaments = async () => {
    try {
      const params = {
        page: currentPage,
        limit: 10
      };
      if (selectedGame) params.game = selectedGame;

      const response = await axios.get('/api/tournaments', { params });
      setTournaments(response.data.tournaments);
      setFilteredTournaments(response.data.tournaments);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    }
    setLoading(false);
  };

  const handleGameFilter = (game) => {
    setSelectedGame(game);
    setCurrentPage(1);
  };

  const registerForTournament = async (tournamentId) => {
    try {
      await axios.post(`/api/tournaments/${tournamentId}/register`);
      alert('Successfully registered for tournament!');
      fetchTournaments(); // Refresh to show updated participant count
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-xl">Loading tournaments...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 pt-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Tournaments</h1>
        
        {/* Game Filter */}
        <select
          value={selectedGame}
          onChange={(e) => handleGameFilter(e.target.value)}
          className="px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:border-red-500"
        >
          <option value="">All Games</option>
          {games.map(game => (
            <option key={game} value={game}>{game}</option>
          ))}
        </select>
      </div>

      {/* Tournaments Grid */}
      {filteredTournaments.length === 0 ? (
        <div className="text-center text-gray-500 mt-12">
          {selectedGame ? `No tournaments found for ${selectedGame}` : 'No tournaments available'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((tournament) => (
            <TournamentCard 
              key={tournament._id} 
              tournament={tournament} 
              onRegister={() => registerForTournament(tournament._id)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-800 text-white rounded-md disabled:opacity-50 hover:bg-gray-700"
          >
            Previous
          </button>
          
          <span className="px-4 py-2 text-white">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-800 text-white rounded-md disabled:opacity-50 hover:bg-gray-700"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

const TournamentCard = ({ tournament, onRegister }) => {
  const [showDetails, setShowDetails] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="tournament-card bg-gray-900 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      {!showDetails ? (
        <div className="text-center">
          {tournament.imageUrl && (
            <img 
              src={tournament.imageUrl} 
              alt={tournament.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          )}
          <h3 className="text-xl font-semibold mb-2">{tournament.title}</h3>
          <p className="text-gray-400 mb-2">{tournament.game}</p>
          <div className="mb-4">
            <span className="text-2xl font-bold text-red-600">{tournament.prizePool}</span>
            <p className="text-xs text-gray-500">Prize Pool</p>
          </div>
          <p className="text-sm text-gray-300 mb-4 line-clamp-3">{tournament.description}</p>
          <div className="space-y-2">
            <button
              onClick={() => setShowDetails(true)}
              className="w-full px-4 py-2 text-white border border-gray-600 rounded-full text-sm hover:bg-gray-800 transition-colors"
            >
              Details
            </button>
            <button
              onClick={onRegister}
              className="w-full px-4 py-2 text-white bg-red-600 rounded-full text-sm font-semibold hover:bg-red-700 transition-colors"
            >
              Register ({tournament.currentParticipants}/{tournament.maxParticipants})
            </button>
          </div>
        </div>
      ) : (
        <div className="text-sm space-y-3">
          <h3 className="text-lg font-semibold">{tournament.title}</h3>
          <div><strong>Game:</strong> {tournament.game}</div>
          <div><strong>Prize Pool:</strong> {tournament.prizePool}</div>
          <div><strong>Tournament Date:</strong> {formatDate(tournament.tournamentDate)}</div>
          <div><strong>Registration Deadline:</strong> {formatDate(tournament.registrationDeadline)}</div>
          <div><strong>Participants:</strong> {tournament.currentParticipants}/{tournament.maxParticipants}</div>
          <div><strong>Status:</strong> <span className="capitalize">{tournament.status}</span></div>
          <div><strong>Description:</strong> {tournament.description}</div>
          <div><strong>Rules:</strong> {tournament.rules}</div>
          <div className="space-y-2 mt-4">
            <button
              onClick={() => setShowDetails(false)}
              className="w-full px-4 py-2 text-white border border-gray-600 rounded-full text-sm hover:bg-gray-800 transition-colors"
            >
              Back
            </button>
            <button
              onClick={onRegister}
              className="w-full px-4 py-2 text-white bg-red-600 rounded-full text-sm font-semibold hover:bg-red-700 transition-colors"
            >
              Register Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tournaments;