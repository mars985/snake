interface StatsBarProps {
  score: number;
  time: number;
  highScore: number;
}

function StatsBar({ score, time, highScore }: StatsBarProps) {
  return (
    <div className="grid grid-cols-3 ml-5 mr-5 py-2 text-lg">
      <div className="text-left">Score: {score}</div>

      <div className="text-center">Time: {time}</div>

      <div className="text-right">High Score: {highScore}</div>
    </div>
  );
}

export default StatsBar;
