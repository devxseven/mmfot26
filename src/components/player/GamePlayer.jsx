import React, { useState } from 'react';
import { HiMiniTrophy } from "react-icons/hi2";
import { IoMdFootball } from "react-icons/io";
import { IoSadOutline } from "react-icons/io5";
import { FaHandshakeSimple } from "react-icons/fa6";
import { GiGoalKeeper } from "react-icons/gi";

const GamePlayer = ({ match }) => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState({ user: 0, ai: 0 });
  const [shots, setShots] = useState(0);
  const [gameResult, setGameResult] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const startGame = (team) => {
    setSelectedTeam(team);
    setGameStarted(true);
    setScore({ user: 0, ai: 0 });
    setShots(0);
    setGameResult(null);
  };

  const shoot = (direction) => {
    if (shots >= 5) return;

    const aiDirection = Math.floor(Math.random() * 3); // 0: left, 1: center, 2: right
    const isGoal = direction !== aiDirection;

    // Calculate new scores
    let newUserScore = score.user;
    let newAiScore = score.ai;

    if (isGoal) {
      newUserScore = score.user + 1;
    }

    // AI's turn
    const aiShootDirection = Math.floor(Math.random() * 3);
    const userSave = Math.floor(Math.random() * 3) !== aiShootDirection;

    if (!userSave) {
      newAiScore = score.ai + 1;
    }

    const newShots = shots + 1;

    // Update all states after calculating final scores
    setScore({ user: newUserScore, ai: newAiScore });
    setShots(newShots);

    if (newShots === 5) {
      if (newUserScore > newAiScore) {
        setGameResult('win');
      } else if (newUserScore < newAiScore) {
        setGameResult('lose');
      } else {
        setGameResult('draw');
      }
    }
  };

  return (
    <div className="prediction-section">
      <div className="text-center mt-4 mb-2">
        <p className="text-lg font-bold">Who Will Win?</p>
      </div>
      <div className="flex justify-center gap-3 items-center">
        <button
          onClick={() => setPrediction('home')}
          className={`custom-card shadow-xl flex flex-col items-center p-3 rounded-lg border ${
            prediction === 'home' ? 'bg-green-600 border-green-600 text-white' : 'border-gray-200'
          }`}
        >
          <img src={match.home_img} alt={match.home_name} className="w-10 h-10 object-contain mb-1" />
        </button>
        <button
          onClick={() => setPrediction('draw')}
          className={`custom-card shadow-xl flex flex-col items-center p-4 rounded-lg border min-w-[80px] ${
            prediction === 'draw' ? 'bg-green-600 border-green-600 text-white' : 'border-gray-200'
          }`}
        >
          <span className="text-2xl font-bold mb-1"> X </span>
        </button>
        <button
          onClick={() => setPrediction('away')}
          className={`custom-card shadow-xl flex flex-col items-center p-3 rounded-lg border ${
            prediction === 'away' ? 'bg-green-600 border-green-600 text-white' : 'border-gray-200'
          }`}
        >
          <img src={match.away_img} alt={match.away_name} className="w-10 h-10 object-contain mb-1" />
        </button>
      </div>

      {/* Penalty Shootout Mini-Game */}
      <div className="mt-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <GiGoalKeeper size={36} />
          <h2 className="text-sm md:text-xl font-bold">Penalty Shootout Challenge</h2>
        </div>
        {!gameStarted ? (
          <div>
            <p className="text-xs md:text-lg mb-4">Choose your team to start the penalty shootout!</p>
            <div className="flex justify-center items-stretch gap-4 text-xs md:text-lg">
              <button
                onClick={() => startGame(match.home_name)}
                className="custom-card shadow-xl w-1/2 md:w-54 flex flex-col items-center p-3 rounded-lg"
              >
                <img src={match.home_img} alt={match.home_name} className="w-12 h-12 object-contain mb-2" />
                <span className="text-xs md:text-base font-bold">{match.home_name}</span>
              </button>
              <button
                onClick={() => startGame(match.away_name)}
                className="custom-card shadow-xl w-1/2 md:w-54 flex flex-col items-center p-3 rounded-lg"
              >
                <img src={match.away_img} alt={match.away_name} className="w-12 h-12 object-contain mb-2" />
                <span className="text-xs md:text-base font-bold">{match.away_name}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="game-container">
            <div className="score-board mb-4">
              <div className="text-xl font-bold">
                {selectedTeam === match.away_name ? (
                  <span>Score: {score.ai} - {score.user}</span>
                ) : (
                  <span>Score: {score.user} - {score.ai}</span>
                )}
              </div>
              <div className="text-sm">Shots: {shots}/5</div>
            </div>

            {!gameResult ? (
              <div className="shooting-controls">
                <p className="mb-2">Choose where to shoot!</p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => shoot(0)}
                    className="custom-card shadow-xl px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Left
                  </button>
                  <button
                    onClick={() => shoot(1)}
                    className="custom-card shadow-xl px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Center
                  </button>
                  <button
                    onClick={() => shoot(2)}
                    className="custom-card shadow-xl px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Right
                  </button>
                </div>
                <div className="custom-card shadow-xl goal-visual mt-4 p-4 rounded-lg w-full md:w-[400px] h-auto mx-auto">
                  <div className="goal-net h-32 border-4 border-gray-400 rounded-lg relative">
                    <IoMdFootball size={36} className="absolute bottom-2 left-1/2 transform -translate-x-1/2" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="game-result">
                <div className={`text-xl font-bold mb-4 ${
                  gameResult === 'win' ? 'text-green-500' :
                  gameResult === 'lose' ? 'text-red-500' : 'text-yellow-500'
                }`}>
                  {gameResult === 'win' ? (
                    <div className="flex items-center justify-center gap-2">
                      <HiMiniTrophy size={24} />
                      <span>{selectedTeam} Won!</span>
                    </div>
                  ) : gameResult === 'lose' ? (
                    <div className="flex items-center justify-center gap-2">
                      <IoSadOutline size={24} />
                      <span>{selectedTeam} Lost!</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <FaHandshakeSimple size={24} />
                      <span>It's a Draw!</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    setGameStarted(false);
                    setSelectedTeam(null);
                  }}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Play Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePlayer;
