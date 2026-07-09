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
 * IRRF brackets and rates for 2026
 * Progressiva (progressive) calculation with deduction
 */
const IRRF_BRACKETS = [
  { limit: 2428.80, rate: 0, deduction: 0 },
  { limit: 2826.65, rate: 0.075, deduction: 182.16 },
  { limit: 3751.05, rate: 0.15, deduction: 394.16 },
  { limit: 4664.68, rate: 0.225, deduction: 675.49 },
  { limit: Infinity, rate: 0.275, deduction: 908.73 },
];

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
 * Calculate IRRF based on progressive brackets
 * IRRF is calculated on the base (gross salary - INSS - private retirement)
 * @param {number} irffBase
 * @returns {number} IRRF amount
 */
function calculateIRRF(irffBase) {
  if (irffBase <= 0) return 0;

  for (const bracket of IRRF_BRACKETS) {
    if (irffBase <= bracket.limit) {
      return Math.max(0, irffBase * bracket.rate - bracket.deduction);
    }
  }

  return 0;
}

/**
 * Calculate Net Salary
 * Net Salary = Gross Salary - INSS - IRRF - Private Retirement - Other Deductions
 * (Note: FGTS is not deducted from net salary, it's a separate employer contribution)
 * @param {number} grossSalary
 * @param {number} inss
 * @param {number} irrf
 * @param {number} privateRetirement
 * @param {number} otherDeductions
 * @returns {number} Net Salary amount
 */
function calculateNetSalary(grossSalary, inss, irrf, privateRetirement, otherDeductions) {
  if (grossSalary <= 0) return 0;
  return Math.max(0, grossSalary - inss - irrf - privateRetirement - otherDeductions);
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
  const otherDeductionsInput = document.getElementById("other-deductions");

  const grossSalary = parseFloat(grossSalaryInput.value) || 0;
  const privateRetirementPercentage =
    parseFloat(privateRetirementPercentageInput.value) || 0;
  const otherDeductions = parseFloat(otherDeductionsInput.value) || 0;

  // Calculate deductions
  const inss = calculateINSS(grossSalary);
  const fgts = calculateFGTS(grossSalary);
  const privateRetirement = calculatePrivateRetirement(
    grossSalary,
    privateRetirementPercentage
  );

  // Calculate IRRF base (gross salary - INSS - private retirement)
  const irffBase = grossSalary - inss - privateRetirement;
  const irrf = calculateIRRF(irffBase);

  // Calculate Net Salary (gross salary - INSS - IRRF - Private Retirement - Other Deductions)
  const netSalary = calculateNetSalary(grossSalary, inss, irrf, privateRetirement, otherDeductions);

  // Update DOM
  document.getElementById("inss-value").textContent = formatCurrency(inss);
  document.getElementById("fgts-value").textContent = formatCurrency(fgts);
  document.getElementById("private-retirement-value").textContent =
    formatCurrency(privateRetirement);
  document.getElementById("other-deductions-value").textContent =
    formatCurrency(otherDeductions);
  document.getElementById("irrf-base-value").textContent =
    formatCurrency(irffBase);
  document.getElementById("irrf-value").textContent = formatCurrency(irrf);
  document.getElementById("net-salary-value").textContent =
    formatCurrency(netSalary);
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
  const otherDeductionsInput = document.getElementById("other-deductions");

  if (!grossSalaryInput || !privateRetirementPercentageInput || !otherDeductionsInput) {
    console.warn("Calculator inputs not found in DOM");
    return;
  }

  // Attach event listeners
  grossSalaryInput.addEventListener("input", updateCalculations);
  privateRetirementPercentageInput.addEventListener("input", updateCalculations);
  otherDeductionsInput.addEventListener("input", updateCalculations);

  // Initial calculation
  updateCalculations();
}

/**
 * Export calculation functions for testing or external use
 */
export { calculateINSS, calculateFGTS, calculatePrivateRetirement, calculateIRRF, calculateNetSalary, formatCurrency };
