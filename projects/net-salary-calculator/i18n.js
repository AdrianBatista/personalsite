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
      },
    },
  },
};
