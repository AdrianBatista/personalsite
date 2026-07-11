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
        meta: {
          title: "Net Salary Calculator — Adrian Felipe Nogueira Batista",
          description: "A web application for calculating net salary based on gross income, taxes, and deductions.",
        },
        title: "Net Salary Calculator",
        subtitle: "A web application for calculating net salary based on gross income, taxes, and deductions.",
        articleLink: "Read how the calculation works",
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
        article: {
          breadcrumb: "Article",
          meta: { title: "How Net Salary Is Calculated — Adrian Felipe Nogueira Batista", description: "An explanation of net salary, the deductions considered by the calculator, and how to use it." },
          title: "How Net Salary Is Calculated",
          subtitle: "Understand the deductions considered in the estimate and how to use the calculator.",
          tags: { 0: "Guide", 1: "Brazil", 2: "Payroll" },
          overview: { title: "What is net salary?", p1: "Net salary is the estimated amount available after payroll deductions are applied to gross salary. Gross salary is the amount agreed before deductions; it is not necessarily the amount deposited into the employee's account.", p2: "This calculator organizes the estimate into stages: social-security contribution (INSS), optional private retirement, income tax withholding (IRRF), and other deductions entered by the user. It also displays FGTS separately because it is an employer contribution and is not deducted from the employee's net salary." },
          calculation: { title: "How the calculation works", p1: "The calculation starts from gross salary. INSS is calculated progressively: each portion of salary within a configured bracket receives that bracket's rate. This avoids applying the highest rate to the entire salary.", p2: "Private retirement is calculated as the percentage entered by the user multiplied by gross salary. The IRRF base is then gross salary less INSS and private retirement. The calculator applies the rate and fixed deduction configured for the IRRF bracket that contains this base.", formula: "private retirement = gross salary × entered percentage\nIRRF base = gross salary − INSS − private retirement\nIRRF = max(0, IRRF base × rate − bracket deduction)\nnet salary = gross salary − INSS − IRRF − private retirement − other deductions\nFGTS = gross salary × 8% (displayed separately)", cards: { inss: { title: "INSS", text: "Progressive employee contribution, calculated across the configured salary brackets." }, irrf: { title: "IRRF", text: "Tax estimate calculated from the base after INSS and private retirement." }, fgts: { title: "FGTS", text: "Employer deposit shown for reference; it is not subtracted from net salary." } }, note: "Important: the calculator uses the tax tables configured in its source code. Payroll may also include dependent allowances, benefits, collective-agreement rules, absences, advances, and other items not represented here." },
          usage: { title: "How to use the calculator", intro: "Use the fields in the first stage and read the results as an estimate:", steps: { 0: "Enter your monthly gross salary.", 1: "If applicable, enter the percentage deducted for private retirement.", 2: "Add other recurring deductions, such as employee-paid benefits or payroll adjustments.", 3: "Review the INSS, IRRF base, IRRF, and net-salary stages. Values update automatically as you type." }, outro: "For a payment decision or a discrepancy in a payslip, compare the estimate with the employer's payroll statement and seek qualified payroll or accounting guidance when necessary." },
          openCalculator: "Open calculator",
        },
      },
    },
  },
  pt: {
    project: {
      netSalaryCalculator: {
        category: "Engenharia de Software",
        meta: {
          title: "Calculadora de Salário Líquido — Adrian Felipe Nogueira Batista",
          description: "Uma aplicação web para calcular o salário líquido com base no salário bruto, impostos e descontos.",
        },
        title: "Calculadora de Salário Líquido",
        subtitle: "Uma aplicação web para calcular o salário líquido com base no salário bruto, impostos e descontos.",
        articleLink: "Entenda como o cálculo é feito",
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
        },
        article: {
          breadcrumb: "Artigo",
          meta: { title: "Como o Salário Líquido é Calculado — Adrian Felipe Nogueira Batista", description: "Uma explicação sobre salário líquido, os descontos considerados pela calculadora e como utilizá-la." },
          title: "Como o Salário Líquido é Calculado",
          subtitle: "Entenda os descontos considerados na estimativa e como utilizar a calculadora.",
          tags: { 0: "Guia", 1: "Brasil", 2: "Folha de pagamento" },
          overview: { title: "O que é salário líquido?", p1: "Salário líquido é o valor estimado disponível após a aplicação dos descontos em folha sobre o salário bruto. O salário bruto é o valor acordado antes dos descontos; portanto, não corresponde necessariamente ao valor depositado na conta do trabalhador.", p2: "Esta calculadora organiza a estimativa em etapas: contribuição previdenciária (INSS), previdência privada opcional, imposto de renda retido na fonte (IRRF) e demais deduções informadas pelo usuário. O FGTS também é exibido, mas separadamente, pois é um depósito do empregador e não reduz o salário líquido." },
          calculation: { title: "Como a conta é feita", p1: "O cálculo começa pelo salário bruto. O INSS é calculado de forma progressiva: cada parcela do salário que pertence a uma faixa configurada recebe a alíquota daquela faixa. Assim, a maior alíquota não é aplicada a todo o salário.", p2: "A previdência privada é calculada multiplicando o percentual informado pelo salário bruto. Em seguida, a base do IRRF é o salário bruto menos o INSS e a previdência privada. A calculadora aplica a alíquota e a parcela a deduzir configuradas para a faixa de IRRF em que essa base se encontra.", formula: "previdência privada = salário bruto × percentual informado\nbase de IRRF = salário bruto − INSS − previdência privada\nIRRF = máx(0, base de IRRF × alíquota − parcela a deduzir)\nsalário líquido = salário bruto − INSS − IRRF − previdência privada − demais deduções\nFGTS = salário bruto × 8% (exibido separadamente)", cards: { inss: { title: "INSS", text: "Contribuição do empregado calculada progressivamente nas faixas salariais configuradas." }, irrf: { title: "IRRF", text: "Estimativa do imposto calculada a partir da base após INSS e previdência privada." }, fgts: { title: "FGTS", text: "Depósito do empregador exibido como referência; não é subtraído do salário líquido." } }, note: "Importante: a calculadora utiliza as tabelas tributárias configuradas em seu código-fonte. A folha pode incluir dependentes, benefícios, regras de acordo coletivo, faltas, adiantamentos e outros itens que não são representados aqui." },
          usage: { title: "Como utilizar a calculadora", intro: "Preencha os campos da primeira etapa e interprete o resultado como uma estimativa:", steps: { 0: "Informe o seu salário bruto mensal.", 1: "Se aplicável, informe o percentual descontado para previdência privada.", 2: "Adicione outras deduções recorrentes, como benefícios pagos pelo empregado ou ajustes de folha.", 3: "Confira as etapas de INSS, base de IRRF, IRRF e salário líquido. Os valores são atualizados automaticamente enquanto você digita." }, outro: "Para uma decisão de pagamento ou uma divergência no holerite, compare a estimativa com o demonstrativo de pagamento do empregador e procure orientação qualificada de departamento pessoal ou contabilidade quando necessário." },
          openCalculator: "Abrir calculadora",
        },
      },
    },
  },
};
