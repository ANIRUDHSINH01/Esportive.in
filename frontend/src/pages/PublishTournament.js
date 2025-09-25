import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const PublishTournament = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    game: '',
    prizePool: '',
    description: '',
    rules: '',
    registrationLink: '',
    imageUrl: '',
    maxParticipants: 100,
    registrationDeadline: '',
    tournamentDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const games = [
    'BGMI',
    'Free Fire',
    'CODM',
    'Clash Of Clans',
    'Clash Royale',
    'Brawl Stars',
    'Pokemon Unite'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.post('/api/tournaments', formData);
      setMessage('Tournament published successfully!');
      setFormData({
        title: '',
        game: '',
        prizePool: '',
        description: '',
        rules: '',
        registrationLink: '',
        imageUrl: '',
        maxParticipants: 100,
        registrationDeadline: '',
        tournamentDate: ''
      });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to publish tournament');
    }
    setLoading(false);
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-400">You need admin privileges to publish tournaments.</p>
          <p className="text-sm text-gray-500 mt-4">Contact admin to get publishing rights.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 pt-24 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Publish Tournament</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Tournament Title</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:border-red-500"
            placeholder="Enter tournament title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Game</label>
          <select
            name="game"
            required
            value={formData.game}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:border-red-500"
          >
            <option value="">Select a game</option>
            {games.map(game => (
              <option key={game} value={game}>{game}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Prize Pool</label>
          <input
            type="text"
            name="prizePool"
            required
            value={formData.prizePool}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:border-red-500"
            placeholder="e.g., ₹10,000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:border-red-500"
            placeholder="Tournament description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Rules</label>
          <textarea
            name="rules"
            required
            value={formData.rules}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:border-red-500"
            placeholder="Tournament rules and regulations"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Registration Link</label>
          <input
            type="url"
            name="registrationLink"
            required
            value={formData.registrationLink}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:border-red-500"
            placeholder="https://example.com/register"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Image URL (Optional)</label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:border-red-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Max Participants</label>
          <input
            type="number"
            name="maxParticipants"
            min="1"
            value={formData.maxParticipants}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:border-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Registration Deadline</label>
          <input
            type="datetime-local"
            name="registrationDeadline"
            required
            value={formData.registrationDeadline}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:border-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tournament Date</label>
          <input
            type="datetime-local"
            name="tournamentDate"
            required
            value={formData.tournamentDate}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:border-red-500"
          />
        </div>

        {message && (
          <div className={`text-center p-3 rounded-md ${message.includes('success') ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-md transition-colors"
        >
          {loading ? 'Publishing...' : 'Publish Tournament'}
        </button>
      </form>
    </div>
  );
};

export default PublishTournament;