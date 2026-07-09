/**
 * i18n.js — translation keys specific to the Net Salary Calculator subproject.
 *
 * Kept local to the project folder so project content/copy changes don't
 * require touching the shared js/i18n.js dictionary. Registered into the
 * global i18n system via registerTranslations() before the DOMContentLoaded
 * handler in js/main.js applies translations to the page.
 */
export default {
  en: {
    project: {
      netSalaryCalculator: {
        category: "Software Engineering",
        title: "Net Salary Calculator",
        subtitle: "A web application for calculating net salary based on gross income, taxes, and deductions.",
        tags: {
          0: "JavaScript",
          1: "Web App",
          2: "Finance",
        },
        section: {
          stage1: "Stage 1: Mandatory Deductions",
          stage2: "Stage 2: Income Tax (IRRF)",
          stage3: "Stage 3: Net Salary",
          grossSalaryLabel: "Gross Salary",
          grossSalaryPlaceholder: "Enter your gross salary",
          inssLabel: "INSS (Social Security)",
          fgtsLabel: "FGTS (Fund)",
          privateRetirementLabel: "Private Retirement Fund",
          privateRetirementPercentageLabel: "Private Retirement Percentage (%)",
          privateRetirementPercentagePlaceholder: "Enter the percentage",
          otherDeductionsLabel: "Other Deductions",
          otherDeductionsPlaceholder: "Enter any other deductions",
          irffLabel: "IRRF (Income Tax Withheld)",
          irffBaseLabel: "IRRF Base",
          netSalaryLabel: "Net Salary",
          netSalaryDescription: "Gross Salary - INSS - IRRF - Private Retirement - Other Deductions",
          currency: "R$",
        },
      },
    },
  },
  pt: {
    project: {
      netSalaryCalculator: {
        category: "Engenharia de Software",
        title: "Calculadora de Salário Líquido",
        subtitle: "Uma aplicação web para calcular o salário líquido com base no salário bruto, impostos e descontos.",
        tags: {
          0: "JavaScript",
          1: "Web App",
          2: "Finanças",
        },
        section: {
          stage1: "Etapa 1: Descontos Obrigatórios",
          stage2: "Etapa 2: Imposto de Renda (IRRF)",
          stage3: "Etapa 3: Salário Líquido",
          grossSalaryLabel: "Salário Bruto",
          grossSalaryPlaceholder: "Digite seu salário bruto",
          inssLabel: "INSS (Seguridade Social)",
          fgtsLabel: "FGTS (Fundo de Garantia)",
          privateRetirementLabel: "Fundo de Previdência Privada",
          privateRetirementPercentageLabel: "Porcentagem de Previdência Privada (%)",
          privateRetirementPercentagePlaceholder: "Digite a porcentagem",
          otherDeductionsLabel: "Demais Deduções",
          otherDeductionsPlaceholder: "Digite outras deduções",
          irffLabel: "IRRF (Imposto de Renda Retido na Fonte)",
          irffBaseLabel: "Base de Cálculo do IRRF",
          netSalaryLabel: "Salário Líquido",
          netSalaryDescription: "Salário Bruto - INSS - IRRF - Previdência Privada - Demais Deduções",
          currency: "R$",
        }
      },
    },
  },
};
