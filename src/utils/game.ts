import { Verb } from '../types/game';
import { verbs } from '../data/verbs';

// Ses benzerliği analizi için yardımcı fonksiyonlar
function getSoundPattern(word: string): string {
  // Kelimenin son hecesini ve ses yapısını analiz et
  const vowels = 'aeiou';
  let pattern = '';
  let lastVowelIndex = -1;

  // Son heceyi bul
  for (let i = word.length - 1; i >= 0; i--) {
    if (vowels.includes(word[i].toLowerCase())) {
      lastVowelIndex = i;
      break;
    }
  }

  // Ses yapısını oluştur
  for (let i = Math.max(0, lastVowelIndex - 1); i < word.length; i++) {
    const char = word[i].toLowerCase();
    if (vowels.includes(char)) {
      pattern += 'V'; // Vowel
    } else {
      pattern += 'C'; // Consonant
    }
  }

  return pattern;
}

function getSimilarSoundingVerbs(verb: Verb): Verb[] {
  const targetPattern = getSoundPattern(verb.past);
  
  return verbs.filter(v => {
    if (v === verb) return false;
    
    // Ses yapısı benzerliği
    const pattern = getSoundPattern(v.past);
    const patternMatch = pattern === targetPattern;
    
    // Son harf benzerliği
    const endingMatch = v.past.slice(-2) === verb.past.slice(-2);
    
    // Uzunluk benzerliği
    const lengthDiff = Math.abs(v.past.length - verb.past.length);
    const lengthMatch = lengthDiff <= 2;
    
    // Zorluk seviyesi eşleşmesi
    const difficultyMatch = v.difficulty === verb.difficulty;
    
    return (patternMatch || endingMatch) && lengthMatch && difficultyMatch;
  });
}

export function getRandomVerb(usedVerbs: Set<string>): Verb {
  const availableVerbs = verbs.filter(verb => !usedVerbs.has(verb.base));
  
  if (availableVerbs.length === 0) {
    usedVerbs.clear();
    return verbs[Math.floor(Math.random() * verbs.length)];
  }
  
  // Zorluk seviyesine göre ağırlıklı seçim
  const weights = {
    easy: 0.5,    // %50
    medium: 0.35, // %35
    hard: 0.15    // %15
  };
  
  const roll = Math.random();
  const difficulty = 
    roll < weights.easy ? 'easy' :
    roll < weights.easy + weights.medium ? 'medium' : 'hard';
  
  const difficultyVerbs = availableVerbs.filter(v => v.difficulty === difficulty);
  
  // Eğer seçilen zorlukta fiil kalmadıysa, diğer zorluklardan seç
  if (difficultyVerbs.length === 0) {
    return availableVerbs[Math.floor(Math.random() * availableVerbs.length)];
  }
  
  return difficultyVerbs[Math.floor(Math.random() * difficultyVerbs.length)];
}

export function generateOptions(verb: Verb): string[] {
  const options = new Set<string>([verb.past]);
  const similarVerbs = getSimilarSoundingVerbs(verb);
  
  // Benzer ses yapısına sahip fiilleri ekle
  for (const similarVerb of similarVerbs) {
    if (options.size < 4) {
      options.add(similarVerb.past);
    }
  }
  
  // Eğer yeterli benzer fiil bulunamazsa, aynı zorluk seviyesinden rastgele ekle
  while (options.size < 4) {
    const randomVerb = verbs.filter(v => 
      v.difficulty === verb.difficulty && 
      v.past !== verb.past
    )[Math.floor(Math.random() * verbs.length)];
    
    if (randomVerb) {
      options.add(randomVerb.past);
    }
  }
  
  return shuffle(Array.from(options));
}

export function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}