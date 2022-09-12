export interface QuizResultProps {
  result: {
    total: number;
    score: number;
  };
}

function QuizResult({ result }: QuizResultProps) {
  return (
    <div className="result-container">
      <div className="result-box">
        <h1>You have completed Your Quiz</h1>
        <h2>
          TOTAL POINTS : {result.score}/{result.total}
        </h2>
      </div>
    </div>
  );
}

export default QuizResult;
