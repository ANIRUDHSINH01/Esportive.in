import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const response = await axios.get('/api/tournaments?limit=6');
      setTournaments(response.data.tournaments);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative container mx-auto p-8 pt-24 min-h-[400px] flex items-center justify-center bg-gray-900 bg-cover bg-center rounded-lg shadow-lg mt-8">
        <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">
            Welcome to <span className="text-red-600">Esportive</span>
          </h1>
          <p className="text-lg lg:text-xl mb-8 max-w-2xl mx-auto">
            Your ultimate destination for esports tournaments. Join the competition, showcase your skills, and win amazing prizes!
          </p>
          <Link 
            to="/tournaments" 
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300"
          >
            View Tournaments
          </Link>
        </div>
      </div>

      {/* Featured Tournaments */}
      <section className="container mx-auto p-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Tournaments</h2>
        
        {loading ? (
          <div className="text-center">Loading tournaments...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <div key={tournament._id} className="bg-gray-900 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">{tournament.title}</h3>
                  <p className="text-gray-400 mb-2">{tournament.game}</p>
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-red-600">{tournament.prizePool}</span>
                    <p className="text-xs text-gray-500">Prize Pool</p>
                  </div>
                  <p className="text-sm text-gray-300 mb-4">{tournament.description}</p>
                  <Link 
                    to="/login" 
                    className="w-full inline-block px-4 py-2 text-white border-2 border-red-600 rounded-full text-center text-sm font-semibold transition-all duration-300 hover:bg-red-600"
                  >
                    Register Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {tournaments.length === 0 && !loading && (
          <div className="text-center text-gray-500">No tournaments available at the moment.</div>
        )}
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-gray-700">
        <div className="container mx-auto text-center text-gray-400">
          <div className="flex flex-wrap justify-center space-x-4 mb-4 text-xs">
            <a href="/privacy-policy" className="hover:text-white">Privacy Policy</a>
            <a href="/terms-of-use" className="hover:text-white">Terms Of Use</a>
            <a href="/cookie-policy" className="hover:text-white">Cookie Policy</a>
            <a href="/faq" className="hover:text-white">FAQ</a>
          </div>
          <div className="flex justify-center space-x-4 text-lg mb-4">
            <a href="#" className="hover:text-white"><i className="fab fa-instagram"></i></a>
            <a href="#" className="hover:text-white"><i className="fab fa-discord"></i></a>
            <a href="#" className="hover:text-white"><i className="fab fa-youtube"></i></a>
            <a href="#" className="hover:text-white"><i className="fab fa-x-twitter"></i></a>
          </div>
          <p className="text-xs">&copy; 2025 Esportive. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;