/**
 * Advanced Password Strength Analyzer for Fortify
 * Scores passwords on a 0-4 scale with detailed reasoning
 */

export interface PasswordAnalysis {
  score: number; // 0-4
  label: string;
  reasons: string[];
}

// Common passwords and patterns to check against
const COMMON_PASSWORDS = new Set([
  'password', 'password123', '123456', '123456789', 'qwerty', 'abc123',
  'password1', '12345678', '111111', '123123', 'admin', 'welcome',
  'monkey', 'dragon', 'letmein', 'trustno1', 'sunshine', 'master',
  'hello', 'freedom', 'whatever', 'qazwsx', '654321', 'jordan23',
  'harley', 'ranger', 'shadow', 'mustang', 'hunter', 'tiger',
  'pussy', 'lovely', 'andrea', 'daniel', 'babygirl', 'lovely',
  'michael', 'ashley', 'nicole', 'jessica', 'joshua', 'pokemon'
]);

const KEYBOARD_PATTERNS = [
  'qwerty', 'qwertyui', 'asdf', 'asdfgh', 'zxcv', 'zxcvbn',
  'qwer', 'wert', 'erty', 'rtyu', 'tyui', 'yuio', 'uiop',
  'asd', 'sdf', 'dfg', 'fgh', 'ghj', 'hjk', 'jkl',
  'zxc', 'xcv', 'cvb', 'vbn', 'bnm'
];

const SEQUENCES = [
  '123', '234', '345', '456', '567', '678', '789', '890',
  'abc', 'bcd', 'cde', 'def', 'efg', 'fgh', 'ghi', 'hij'
];

// Simulate a "seen before" database for reuse detection
const SIMULATED_USER_PASSWORDS = new Set([
  'mypassword123', 'work2023!', 'home123', 'family2023'
]);

/**
 * Check if password contains common sequences or repetitions
 */
function hasSequencesOrRepetition(password: string): { hasIssue: boolean; details: string[] } {
  const details: string[] = [];
  const lower = password.toLowerCase();
  
  // Check for repetition (3+ same characters)
  if (/(.)\1{2,}/.test(password)) {
    details.push('Contains repeated characters');
  }
  
  // Check for keyboard patterns
  for (const pattern of KEYBOARD_PATTERNS) {
    if (lower.includes(pattern)) {
      details.push(`Contains keyboard pattern "${pattern}"`);
      break;
    }
  }
  
  // Check for sequential patterns
  for (const sequence of SEQUENCES) {
    if (lower.includes(sequence) || lower.includes(sequence.split('').reverse().join(''))) {
      details.push(`Contains sequence "${sequence}"`);
      break;
    }
  }
  
  // Check for simple date patterns
  if (/19\d{2}|20\d{2}/.test(password)) {
    details.push('Contains year pattern');
  }
  
  return { hasIssue: details.length > 0, details };
}

/**
 * Check if password appears to be a passphrase
 */
function isPassphrase(password: string): boolean {
  // Look for multiple words (spaces or common word boundaries)
  const wordCount = password.split(/[\s\-_\.]+/).filter(word => word.length > 2).length;
  return wordCount >= 3 && password.length >= 15;
}

/**
 * Calculate character variety score
 */
function getCharacterVariety(password: string): { score: number; missing: string[] } {
  const missing: string[] = [];
  let score = 0;
  
  if (/[a-z]/.test(password)) score++; else missing.push('lowercase letters');
  if (/[A-Z]/.test(password)) score++; else missing.push('uppercase letters');
  if (/\d/.test(password)) score++; else missing.push('numbers');
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password)) score++; else missing.push('symbols');
  
  return { score, missing };
}

/**
 * Advanced entropy calculation considering character sets and patterns
 */
function calculateEntropy(password: string): number {
  const characterSets = [
    { regex: /[a-z]/, size: 26 },
    { regex: /[A-Z]/, size: 26 },
    { regex: /\d/, size: 10 },
    { regex: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/, size: 32 }
  ];
  
  let charsetSize = 0;
  for (const charset of characterSets) {
    if (charset.regex.test(password)) {
      charsetSize += charset.size;
    }
  }
  
  if (charsetSize === 0) return 0;
  
  // Calculate base entropy
  let entropy = password.length * Math.log2(charsetSize);
  
  // Reduce entropy for repetition and patterns
  const uniqueChars = new Set(password.toLowerCase()).size;
  const repetitionPenalty = 1 - (password.length - uniqueChars) / password.length;
  entropy *= repetitionPenalty;
  
  return entropy;
}

/**
 * Main password analysis function
 */
export function analyzePasswordStrength(password: string): PasswordAnalysis {
  if (!password) {
    return {
      score: 0,
      label: 'Terrible',
      reasons: ['No password provided']
    };
  }
  
  const reasons: string[] = [];
  let score = 0;
  let bonusPoints = 0;
  let penalties = 0;
  
  // === LENGTH ANALYSIS ===
  const length = password.length;
  if (length < 8) {
    penalties += 2;
    reasons.push(`Too short (${length} chars, need 8+)`);
  } else if (length < 12) {
    score += 1;
    reasons.push('Decent length');
  } else if (length < 16) {
    score += 2;
    reasons.push('Good length');
  } else {
    score += 3;
    bonusPoints += 1;
    reasons.push('Excellent length');
  }
  
  // === BLACKLIST CHECK ===
  const lowerPassword = password.toLowerCase();
  if (COMMON_PASSWORDS.has(lowerPassword)) {
    penalties += 3;
    reasons.push('Common/blacklisted password');
  }
  
  // === CHARACTER VARIETY ===
  const variety = getCharacterVariety(password);
  if (variety.score >= 4) {
    score += 2;
    reasons.push('Excellent character variety');
  } else if (variety.score >= 3) {
    score += 1;
    reasons.push('Good character variety');
  } else {
    if (variety.missing.length > 0) {
      reasons.push(`Missing: ${variety.missing.slice(0, 2).join(', ')}`);
    }
  }
  
  // === SEQUENCE/PATTERN DETECTION ===
  const sequenceCheck = hasSequencesOrRepetition(password);
  if (sequenceCheck.hasIssue) {
    penalties += 1;
    reasons.push(...sequenceCheck.details.slice(0, 1)); // Just show first issue
  } else {
    bonusPoints += 1;
    reasons.push('No obvious patterns');
  }
  
  // === REUSE SIMULATION ===
  if (SIMULATED_USER_PASSWORDS.has(password)) {
    penalties += 2;
    reasons.push('Password reused from another account');
  } else {
    bonusPoints += 1;
  }
  
  // === PASSPHRASE DETECTION ===
  if (isPassphrase(password)) {
    bonusPoints += 2;
    reasons.push('Strong passphrase detected');
  }
  
  // === ENTROPY BONUS ===
  const entropy = calculateEntropy(password);
  if (entropy >= 60) {
    bonusPoints += 1;
    reasons.push('High entropy');
  } else if (entropy < 30) {
    penalties += 1;
    reasons.push('Low randomness');
  }
  
  // === FINAL SCORE CALCULATION ===
  let finalScore = Math.max(0, score + bonusPoints - penalties);
  finalScore = Math.min(4, finalScore); // Cap at 4
  
  // === SCORE LABELS ===
  const labels = ['Terrible', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  
  // === SCORE-SPECIFIC ADJUSTMENTS ===
  // Ensure very short passwords never get above 1
  if (length < 6) finalScore = Math.min(1, finalScore);
  
  // Ensure blacklisted passwords never get above 0
  if (COMMON_PASSWORDS.has(lowerPassword)) finalScore = 0;
  
  // Clean up reasons - keep most relevant ones
  const cleanedReasons = reasons.slice(0, 4);
  
  // Add summary reason based on final score
  if (finalScore === 0) {
    cleanedReasons.unshift('Extremely vulnerable');
  } else if (finalScore === 4) {
    cleanedReasons.unshift('Cryptographically strong');
  }
  
  return {
    score: finalScore,
    label: labels[finalScore],
    reasons: cleanedReasons
  };
}

/**
 * Helper function to get color class for UI
 */
export function getStrengthColor(score: number): string {
  switch (score) {
    case 0: return 'text-red-500';
    case 1: return 'text-red-400';
    case 2: return 'text-orange-400';
    case 3: return 'text-yellow-400';
    case 4: return 'text-green-400';
    default: return 'text-gray-400';
  }
}

/**
 * Helper function to get XP multiplier based on strength
 */
export function getXpMultiplier(score: number): number {
  const multipliers = [0.5, 0.7, 1.0, 1.5, 2.0];
  return multipliers[score] || 1.0;
}
