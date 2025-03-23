'use client';

import React, { useState, useEffect, useRef } from 'react';

interface LogicRule {
  name: string;
  premises: string[];
  conclusion: string;
  description: string;
}

interface LogicalMistake {
  name: string;
  example: string;
  correction: string;
  explanation: string;
}

const SymbolButtons: React.FC<{
  onSymbolClick: (symbol: string) => void;
}> = ({ onSymbolClick }) => {
  const symbols = ['→', '∧', '∨', '¬', '⊢', '∀', '∃', '≡'];
  
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {symbols.map((symbol) => (
        <button
          key={symbol}
          type="button"
          onClick={() => onSymbolClick(symbol)}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
        >
          {symbol}
        </button>
      ))}
    </div>
  );
};

const LogicPracticeApp: React.FC = () => {
  const logicRules: LogicRule[] = [
    {
      name: "Modus Ponens",
      premises: ["P → Q", "P"],
      conclusion: "Q",
      description: "If P implies Q, and P is true, then Q must be true."
    },
    {
      name: "Modus Tollens",
      premises: ["P → Q", "¬Q"],
      conclusion: "¬P",
      description: "If P implies Q, and Q is false, then P must be false."
    },
    {
      name: "Hypothetical Syllogism",
      premises: ["P → Q", "Q → R"],
      conclusion: "P → R",
      description: "If P implies Q and Q implies R, then P implies R."
    },
    {
      name: "Disjunctive Syllogism",
      premises: ["P ∨ Q", "¬P"],
      conclusion: "Q",
      description: "If either P or Q is true, and P is false, then Q must be true."
    },
    {
      name: "Conjunction",
      premises: ["P", "Q"],
      conclusion: "P ∧ Q",
      description: "If P is true and Q is true, then 'P and Q' is true."
    },
    {
      name: "Simplification",
      premises: ["P ∧ Q"],
      conclusion: "P",
      description: "If 'P and Q' is true, then P is true."
    },
    {
      name: "Addition",
      premises: ["P"],
      conclusion: "P ∨ Q",
      description: "If P is true, then 'P or Q' is true."
    },
    {
      name: "Resolution",
      premises: ["P ∨ Q", "¬P ∨ R"],
      conclusion: "Q ∨ R",
      description: "If 'P or Q' is true and 'not P or R' is true, then 'Q or R' is true."
    }
  ];

  const commonMistakes: LogicalMistake[] = [
    {
      name: "Affirming the Consequent",
      example: "If P → Q, Q; therefore P",
      correction: "Invalid: Q could be true for other reasons",
      explanation: "Just because Q is true doesn't mean P caused it. Example: If it rains, the ground is wet. The ground is wet, therefore it rained (wrong - sprinklers could cause wet ground)."
    },
    {
      name: "Denying the Antecedent",
      example: "If P → Q, ¬P; therefore ¬Q",
      correction: "Invalid: Q could still be true for other reasons",
      explanation: "Just because P is false doesn't mean Q must be false. Example: If it's sunny, it's daytime. It's not sunny, therefore it's not daytime (wrong - it could be cloudy during day)."
    },
    {
      name: "Fallacy of Distribution",
      example: "All A are B, therefore all B are A",
      correction: "Invalid: Relationship is not reversible",
      explanation: "The relationship between sets is not always reversible. Example: All dogs are animals, therefore all animals are dogs (wrong)."
    },
    {
      name: "Confusion of Necessity",
      example: "P ∨ Q, P; therefore ¬Q",
      correction: "Invalid: Both P and Q can be true in OR statement",
      explanation: "In an OR statement, both statements can be true. Example: Either it's hot or sunny, it's hot, therefore it's not sunny (wrong - it could be both)."
    },
    {
      name: "Improper Negation",
      example: "¬(P ∧ Q) = ¬P ∧ ¬Q",
      correction: "Correct form: ¬(P ∧ Q) = ¬P ∨ ¬Q",
      explanation: "De Morgan's Law states that the negation of AND becomes OR. Example: Not(both sunny and warm) means either not sunny OR not warm."
    }
  ];

  const [currentRuleIndex, setCurrentRuleIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [answerStatus, setAnswerStatus] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [mode, setMode] = useState('nameToRule');
  const [progressPercentage, setProgressPercentage] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentRuleIndex(0);
    setScore(0);
    setQuestionsAnswered(0);
    setUserAnswer('');
    setFeedback('');
    setAnswerStatus('');
    setShowAnswer(false);
    setProgressPercentage(0);
  }, [mode]);

  const shuffleRules = () => {
    const maxIndex = mode === 'mistakes' ? commonMistakes.length - 1 : logicRules.length - 1;
    const newIndex = Math.floor(Math.random() * (maxIndex + 1));
    setCurrentRuleIndex(newIndex);
    setUserAnswer('');
    setFeedback('');
    setAnswerStatus('');
    setShowAnswer(false);
  };

  const handleSubmit = () => {
    let isCorrect = false;
    const items = mode === 'mistakes' ? commonMistakes : logicRules;
    const currentItem = items[currentRuleIndex];

    if (!currentItem) {
      setCurrentRuleIndex(0);
      return;
    }
    
    if (mode === 'mistakes') {
      const mistakeItem = currentItem as LogicalMistake;
      isCorrect = userAnswer.toLowerCase() === mistakeItem.correction.toLowerCase();
    } else {
      const ruleItem = currentItem as LogicRule;
      isCorrect = mode === 'nameToRule' 
        ? userAnswer.toLowerCase() === ruleItem.name.toLowerCase()
        : userAnswer.toLowerCase() === ruleItem.conclusion.toLowerCase();
    }

    setQuestionsAnswered(questionsAnswered + 1);
    setProgressPercentage((questionsAnswered + 1) * (100 / 10));

    if (isCorrect) {
      setScore(score + 1);
      setAnswerStatus('correct');
      setFeedback('Correct! Well done.');
    } else {
      setAnswerStatus('incorrect');
      if (mode === 'mistakes') {
        const mistakeItem = currentItem as LogicalMistake;
        setFeedback(`Incorrect. The correction is: ${mistakeItem.correction}. ${mistakeItem.explanation}`);
      } else {
        const ruleItem = currentItem as LogicRule;
        setFeedback(`Incorrect. The correct answer is ${mode === 'nameToRule' ? ruleItem.name : ruleItem.conclusion}.`);
      }
    }
    
    setShowAnswer(true);
    
    setTimeout(() => {
      if (questionsAnswered < 9) {
        shuffleRules();
      } else {
        setFeedback(`Quiz complete! Your score: ${score + (isCorrect ? 1 : 0)}/10`);
      }
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !showAnswer && userAnswer.trim()) {
      handleSubmit();
    }
  };

  const insertSymbol = (symbol: string): void => {
    const input = inputRef.current;
    if (!input) return;

    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const newValue = userAnswer.substring(0, start) + symbol + userAnswer.substring(end);
    setUserAnswer(newValue);

    // Set cursor position after the inserted symbol
    setTimeout(() => {
      input.focus();
      input.setSelectionRange(start + symbol.length, start + symbol.length);
    }, 0);
  };

  const renderQuestion = () => {
    if (mode === 'mistakes') {
      const currentMistake = commonMistakes[currentRuleIndex];
      if (!currentMistake) return null;

      return (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Identify the correction:</h3>
            <div className="bg-gray-100 p-3 rounded mb-2">
              <div className="mb-1"><strong>Common Mistake:</strong></div>
              <div className="ml-4 mb-1">{currentMistake.name}</div>
              <div className="ml-4 mb-1">{currentMistake.example}</div>
            </div>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter the correction"
            className="w-full p-2 border rounded mb-4"
            disabled={showAnswer}
          />
          {!showAnswer && <SymbolButtons onSymbolClick={insertSymbol} />}
        </div>
      );
    }

    const currentRule = logicRules[currentRuleIndex];
    if (!currentRule) return null;
    
    if (mode === 'nameToRule') {
      return (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Identify this rule:</h3>
            <div className="bg-gray-100 p-3 rounded mb-2">
              <div className="mb-1"><strong>Premises:</strong></div>
              {currentRule.premises.map((premise, index) => (
                <div key={index} className="ml-4 mb-1">{premise}</div>
              ))}
            </div>
            <div className="bg-gray-100 p-3 rounded">
              <div><strong>Conclusion:</strong> {currentRule.conclusion}</div>
            </div>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter the name of this rule"
            className="w-full p-2 border rounded mb-4"
            disabled={showAnswer}
          />
          {!showAnswer && <SymbolButtons onSymbolClick={insertSymbol} />}
        </div>
      );
    } else {
      return (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Complete this rule: {currentRule.name}</h3>
            <div className="bg-gray-100 p-3 rounded mb-2">
              <div className="mb-1"><strong>Premises:</strong></div>
              {currentRule.premises.map((premise, index) => (
                <div key={index} className="ml-4 mb-1">{premise}</div>
              ))}
            </div>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter the conclusion"
            className="w-full p-2 border rounded mb-4"
            disabled={showAnswer}
          />
          {!showAnswer && <SymbolButtons onSymbolClick={insertSymbol} />}
        </div>
      );
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-md mx-auto">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Logic Rules Practice</h1>
          <p className="text-gray-600">Master inference rules through practice!</p>
          
          <div className="mt-4 flex justify-center gap-2">
            <button 
              onClick={() => setMode('nameToRule')}
              className={`px-4 py-2 rounded ${mode === 'nameToRule' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Identify Rules
            </button>
            <button 
              onClick={() => setMode('ruleToName')}
              className={`px-4 py-2 rounded ${mode === 'ruleToName' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Complete Rules
            </button>
            <button 
              onClick={() => setMode('mistakes')}
              className={`px-4 py-2 rounded ${mode === 'mistakes' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Common Mistakes
            </button>
          </div>
        </header>
        
        <div className="w-full bg-gray-300 rounded-full h-2 mb-6">
          <div 
            className="bg-green-600 h-2 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        <div className="text-right mb-2 text-gray-700">
          Score: {score}/{questionsAnswered}
        </div>

        {renderQuestion()}
        
        {!showAnswer && (
          <button
            onClick={handleSubmit}
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            disabled={!userAnswer.trim()}
          >
            Submit Answer
          </button>
        )}
        
        {showAnswer && (
          <div className={`mt-4 p-3 rounded ${answerStatus === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {feedback}
          </div>
        )}
        
        <div className="mt-8 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Reference Guide</h2>
          <div className="divide-y">
            {mode === 'mistakes' ? (
              commonMistakes.map((mistake, index) => (
                <div key={index} className="py-2">
                  <h3 className="font-semibold">{mistake.name}</h3>
                  <p className="text-sm text-gray-700">{mistake.explanation}</p>
                  <div className="mt-1 text-xs text-gray-500">
                    Example: {mistake.example}
                  </div>
                </div>
              ))
            ) : (
              logicRules.map((rule, index) => (
                <div key={index} className="py-2">
                  <h3 className="font-semibold">{rule.name}</h3>
                  <p className="text-sm text-gray-700">{rule.description}</p>
                  <div className="mt-1 text-xs text-gray-500">
                    {rule.premises.join(", ")} ⊢ {rule.conclusion}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogicPracticeApp;