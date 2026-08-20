// Grade calculation based on total percentage
const calculateGrade = (totalMarks, maxMarks = 100) => {
  const percentage = (totalMarks / maxMarks) * 100;

  if (percentage >= 90) return { grade: 'O', gradePoint: 10 };
  if (percentage >= 80) return { grade: 'A+', gradePoint: 9 };
  if (percentage >= 70) return { grade: 'A', gradePoint: 8 };
  if (percentage >= 60) return { grade: 'B+', gradePoint: 7 };
  if (percentage >= 50) return { grade: 'B', gradePoint: 6 };
  if (percentage >= 40) return { grade: 'C', gradePoint: 5 };
  return { grade: 'F', gradePoint: 0 };
};

// Calculate SGPA from marks array
const calculateSGPA = (marksArray) => {
  let totalCredits = 0;
  let weightedPoints = 0;

  marksArray.forEach((m) => {
    const credits = m.Subject?.credits || 3;
    const { gradePoint } = calculateGrade(parseFloat(m.total_marks));
    totalCredits += credits;
    weightedPoints += credits * gradePoint;
  });

  if (totalCredits === 0) return 0;
  return parseFloat((weightedPoints / totalCredits).toFixed(2));
};

module.exports = { calculateGrade, calculateSGPA };
