/**
 * calculator.js — Net Salary Calculator logic
 *
 * Handles all calculations for INSS, FGTS, IR, and other deductions.
 * Updates the DOM in real-time as user inputs change.
 */

/**
 * INSS brackets and rates for 2026
 * Progressiva (progressive) calculation
 */
const INSS_BRACKETS = [
  { limit: 1621.00, rate: 0.075 },
  { limit: 2902.84, rate: 0.09 },
  { limit: 4354.27, rate: 0.12 },
  { limit: 8475.55, rate: 0.14 },
];

/**
 * FGTS rate
 */
const FGTS_RATE = 0.08;

/**
 * Calculate INSS based on progressive brackets
 * @param {number} grossSalary
 * @returns {number} INSS amount
 */
function calculateINSS(grossSalary) {
  if (grossSalary <= 0) return 0;

  let inss = 0;
  let previousLimit = 0;

  for (const bracket of INSS_BRACKETS) {
    if (grossSalary <= previousLimit) break;

    const limitedSalary = Math.min(grossSalary, bracket.limit);
    const taxableAmount = limitedSalary - previousLimit;
    inss += taxableAmount * bracket.rate;

    previousLimit = bracket.limit;
  }

  return inss;
}

/**
 * Calculate FGTS
 * @param {number} grossSalary
 * @returns {number} FGTS amount
 */
function calculateFGTS(grossSalary) {
  if (grossSalary <= 0) return 0;
  return grossSalary * FGTS_RATE;
}

/**
 * Calculate Private Retirement Fund
 * @param {number} grossSalary
 * @param {number} percentageRate
 * @returns {number} Private Retirement amount
 */
function calculatePrivateRetirement(grossSalary, percentageRate) {
  if (grossSalary <= 0 || percentageRate <= 0) return 0;
  return grossSalary * (percentageRate / 100);
}

/**
 * Format number to Brazilian currency display
 * @param {number} value
 * @returns {string}
 */
function formatCurrency(value) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Update all calculator results based on input values
 */
function updateCalculations() {
  const grossSalaryInput = document.getElementById("gross-salary");
  const privateRetirementPercentageInput = document.getElementById(
    "private-retirement-percentage"
  );

  const grossSalary = parseFloat(grossSalaryInput.value) || 0;
  const privateRetirementPercentage =
    parseFloat(privateRetirementPercentageInput.value) || 0;

  // Calculate deductions
  const inss = calculateINSS(grossSalary);
  const fgts = calculateFGTS(grossSalary);
  const privateRetirement = calculatePrivateRetirement(
    grossSalary,
    privateRetirementPercentage
  );

  // Update DOM
  document.getElementById("inss-value").textContent = formatCurrency(inss);
  document.getElementById("fgts-value").textContent = formatCurrency(fgts);
  document.getElementById("private-retirement-value").textContent =
    formatCurrency(privateRetirement);
}

/**
 * Initialize calculator
 * Called when the DOM is ready
 */
export function initCalculator() {
  const grossSalaryInput = document.getElementById("gross-salary");
  const privateRetirementPercentageInput = document.getElementById(
    "private-retirement-percentage"
  );

  if (!grossSalaryInput || !privateRetirementPercentageInput) {
    console.warn("Calculator inputs not found in DOM");
    return;
  }

  // Attach event listeners
  grossSalaryInput.addEventListener("input", updateCalculations);
  privateRetirementPercentageInput.addEventListener("input", updateCalculations);

  // Initial calculation
  updateCalculations();
}

/**
 * Export calculation functions for testing or external use
 */
export { calculateINSS, calculateFGTS, calculatePrivateRetirement, formatCurrency };
