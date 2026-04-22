export const learningSessionFinishedMessages = [
  'Great job! You’ve completed this set.',
  'All words learned — feel free to take a break.',
  'You did it 🎉 All words learned.',
  'Set complete! Time for a break 😌',
  'You crushed this set 💪',
  'Great progress — all words learned. Keep it up!',
  'All words are learned — take a well-deserved break.',
  'You’ve learned everything here. Time for a short break.',
];

export const getRandomFinishMessage = () => {
  const index = Math.floor(Math.random() * learningSessionFinishedMessages.length);

  return learningSessionFinishedMessages[index];
};
