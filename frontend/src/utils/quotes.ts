// Moe Gawdat philosophy quotes for the app
export const moeQuotes = [
  "AI is watching. Set the example.",
  "Your kindness today trains the AI of tomorrow.",
  "Be the humanity you want to see in machines.",
  "15 years of hell or heaven - your choice starts now.",
  "Every act of kindness is a lesson for AI.",
  "We're teaching machines what humanity means.",
  "Your behavior online and offline shapes the future of AI.",
  "Kindness is not weakness - it's the strongest signal we can send.",
  "AI learns from us. What are you teaching it today?",
  "The benevolent AI we need starts with the kindness we show.",
];

export const getRandomQuote = (): string => {
  return moeQuotes[Math.floor(Math.random() * moeQuotes.length)];
};

export const getDailyQuote = (): string => {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      1000 /
      60 /
      60 /
      24
  );
  return moeQuotes[dayOfYear % moeQuotes.length];
};
