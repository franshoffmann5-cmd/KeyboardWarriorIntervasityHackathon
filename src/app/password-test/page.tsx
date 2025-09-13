/**
 * Password Strength Analyzer Test Page
 * This is for testing and demonstrating the new password strength system
 */

"use client"

import { useState } from 'react';
import { analyzePasswordStrength, getStrengthColor, getXpMultiplier } from '@/lib/password-strength';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function PasswordTestPage() {
  const [password, setPassword] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);

  const testPasswords = [
    'password',
    'password123',
    'MyPassword1!',
    'correct horse battery staple',
    'Tr0ub4dor&3',
    'qwerty123',
    'P@ssw0rd!2023',
    'MySecurePassphrase2024!',
    'a',
    '123456789',
    'MyVeryLongAndComplexPassphrase2024WithNumbers!@#'
  ];

  const handleAnalyze = () => {
    if (password) {
      const result = analyzePasswordStrength(password);
      setAnalysis(result);
    }
  };

  const handleTestPassword = (testPwd: string) => {
    setPassword(testPwd);
    const result = analyzePasswordStrength(testPwd);
    setAnalysis(result);
  };

  return (
    <div className="min-h-screen bg-blueprint p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-pixel text-blueprint-cyan mb-8 text-center">
          FORTIFY PASSWORD STRENGTH ANALYZER
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-blueprint-dark border-2 border-blueprint-cyan p-6">
            <h2 className="text-xl font-pixel text-blueprint-cyan mb-4">TEST PASSWORD</h2>
            
            <div className="space-y-4">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password to analyze..."
                className="font-pixel"
              />
              
              <Button 
                onClick={handleAnalyze}
                className="w-full font-pixel bg-blueprint-cyan text-blueprint hover:bg-blueprint-cyan/80"
              >
                ANALYZE STRENGTH
              </Button>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-pixel text-blueprint-cyan mb-3">TEST EXAMPLES:</h3>
              <div className="space-y-2">
                {testPasswords.map((testPwd, index) => (
                  <button
                    key={index}
                    onClick={() => handleTestPassword(testPwd)}
                    className="block w-full text-left p-2 text-xs font-pixel text-blueprint-text hover:bg-blueprint-cyan/10 border border-blueprint-cyan/30 hover:border-blueprint-cyan transition-colors"
                  >
                    {testPwd}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-blueprint-dark border-2 border-blueprint-cyan p-6">
            <h2 className="text-xl font-pixel text-blueprint-cyan mb-4">ANALYSIS RESULTS</h2>
            
            {analysis ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className={`font-pixel text-2xl mb-2 ${getStrengthColor(analysis.score)}`}>
                    {analysis.label}
                  </div>
                  
                  <div className="flex justify-center gap-1 mb-4">
                    {Array.from({ length: 4 }, (_, i) => (
                      <div
                        key={i}
                        className={`h-3 w-12 border border-blueprint-cyan ${
                          i < analysis.score ? "bg-blueprint-cyan" : "bg-transparent"
                        }`}
                      />
                    ))}
                  </div>
                  
                  <div className="text-blueprint-cyan font-pixel text-lg">
                    SCORE: {analysis.score}/4
                  </div>
                </div>

                <div>
                  <h3 className="text-blueprint-cyan font-pixel text-sm mb-3">ANALYSIS DETAILS:</h3>
                  <ul className="space-y-2">
                    {analysis.reasons.map((reason: string, index: number) => (
                      <li key={index} className="text-blueprint-text font-pixel text-xs flex items-start">
                        <span className="text-blueprint-cyan mr-2">•</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blueprint/50 border border-blueprint-cyan p-3">
                  <h3 className="text-blueprint-cyan font-pixel text-sm mb-2">GAMIFICATION STATS:</h3>
                  <div className="text-blueprint-text font-pixel text-xs space-y-1">
                    <div>XP Multiplier: {getXpMultiplier(analysis.score)}x</div>
                    <div>Base XP (20): {Math.round(20 * getXpMultiplier(analysis.score))} XP</div>
                    <div>Duplicate Penalty (50%): {Math.round(20 * getXpMultiplier(analysis.score) * 0.5)} XP</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-blueprint-text font-pixel text-sm text-center py-8">
                Enter a password to see detailed analysis
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-blueprint-dark border-2 border-blueprint-cyan p-6">
          <h2 className="text-xl font-pixel text-blueprint-cyan mb-4">SCORING SYSTEM</h2>
          <div className="grid md:grid-cols-5 gap-4 text-center">
            <div className="border border-red-500 p-3">
              <div className="text-red-400 font-pixel text-sm mb-2">0 - TERRIBLE</div>
              <div className="text-blueprint-text font-pixel text-xs">
                Common/blacklisted, extremely weak, very short
              </div>
            </div>
            <div className="border border-red-400 p-3">
              <div className="text-red-400 font-pixel text-sm mb-2">1 - WEAK</div>
              <div className="text-blueprint-text font-pixel text-xs">
                Some effort, but short, predictable, or reused
              </div>
            </div>
            <div className="border border-orange-400 p-3">
              <div className="text-orange-400 font-pixel text-sm mb-2">2 - FAIR</div>
              <div className="text-blueprint-text font-pixel text-xs">
                Okay for low-risk accounts, lacking length or uniqueness
              </div>
            </div>
            <div className="border border-yellow-400 p-3">
              <div className="text-yellow-400 font-pixel text-sm mb-2">3 - STRONG</div>
              <div className="text-blueprint-text font-pixel text-xs">
                Long enough, good variety, not reused, no obvious patterns
              </div>
            </div>
            <div className="border border-green-400 p-3">
              <div className="text-green-400 font-pixel text-sm mb-2">4 - VERY STRONG</div>
              <div className="text-blueprint-text font-pixel text-xs">
                Long passphrase or highly random, unique per site, excellent entropy
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
