/**
 * i18n.js — translation dictionary and language resolution/toggle logic.
 *
 * Language resolution priority:
 *   1. `?language=` query param (explicit override, also persisted)
 *   2. localStorage `site-lang` (previously saved choice)
 *   3. `navigator.language` prefix
 *   4. fallback `en`
 */

const STORAGE_KEY = "site-lang";
const QUERY_PARAM = "language";
const SUPPORTED_LANGS = ["en", "pt"];
const DEFAULT_LANG = "en";

const translations = {
  en: {
    meta: {
      title: "Adrian Felipe Nogueira Batista — Engineer",
      description: "Electrical Engineer specialized in software development for engineering. Engineering better solutions through software.",
    },
    nav: {
      skip: "Skip to content",
      brand: "AFNB",
      about: "About",
      portfolio: "Portfolio",
      publications: "Publications",
      articles: "Articles",
      projects: "Projects",
      technologies: "Technologies",
      experience: "Experience",
      philosophy: "Philosophy",
      contact: "Contact",
      langToggleLabel: "Switch language",
      menuToggleLabel: "Toggle navigation menu",
    },
    hero: {
      eyebrow: "Electrical Engineer • Software Engineer",
      name: "Adrian Felipe Nogueira Batista",
      statement:
        "Developing software solutions for engineering, industrial processes and technical applications.",
    },
    about: {
      heading: "About",
      intro:
        "The value isn't in knowing multiple programming languages — it's in understanding engineering problems deeply enough to build software that engineers actually use.",
      steps: {
        0: {
          label: "Industrial Automation",
          desc: "Started in automation, working directly with industrial control and instrumentation.",
        },
        1: {
          label: "Electrical Engineering",
          desc: "Built a formal engineering foundation — power systems, instrumentation, and technical rigor.",
        },
        2: {
          label: "Software Development",
          desc: "Moved into software to solve engineering problems that manual processes couldn't scale.",
        },
        3: {
          label: "Engineering Software",
          desc: "Now builds software specifically for engineering and industrial workflows.",
        },
      },
    },
    portfolio: {
      heading: "Engineering Portfolio",
      intro: "Software, electrical, and research work developed throughout a career spanning industrial automation, power systems, and enterprise software engineering.",
      categories: {
        software: {
          title: "Software Engineering",
          items: {
            0: {
              title: "Web & Desktop Applications for Engineering Operations",
              desc: "Full-stack applications developed in PHP/Laravel, C#/.NET, and Python/Django with React.js frontends and SQL Server/MySQL databases. Built to support engineering teams — automating workflows, integrating technical data, and improving operational efficiency.",
              tags: "Full-Stack Development",
            },
            1: {
              title: "Creo Toolkit Applications",
              desc: "Specialized software solutions built with Creo Toolkit to improve power transformer design workflows. Deployed across hundreds of users in the organization, bridging CAD automation and engineering processes.",
              tags: "CAD Integration",
            },
          },
        },
        electrical: {
          title: "Electrical Engineering",
          items: {
            0: {
              title: "Industrial Automation & Control Systems",
              desc: "Technical foundation in industrial automation — control systems design, instrumentation integration, and PLC-based process automation. Early career focus on bridging hardware and software in automated industrial environments.",
              tags: "Industrial Control",
            },
            1: {
              title: "Power Transformer Engineering & Analysis",
              desc: "Engineering support for power transformers — technical documentation, failure analysis, design optimization, and testing workflows. Applied AI/neural networks methodology for dissolved gas analysis (DGA) diagnostic systems.",
              tags: "Power Systems",
            },
          },
        },
        research: {
          title: "Research",
          items: {
            0: {
              title: "Undergraduate Thesis",
              desc: "See Publications & Studies for the full academic record.",
              tags: "Academic",
            },
          },
        },
        opensource: {
          title: "Open Source",
          items: {
            0: {
              title: "Personal Projects & Contributions",
              desc: "Public repositories on GitHub showcasing technical experiments, utilities, and contributions to engineering-focused projects.",
              tags: "GitHub",
            },
          },
        },
      },
    },
    publications: {
      heading: "Publications & Studies",
      academic: {
        title: "Academic",
        desc: "Undergraduate thesis, deposited in the UNESP institutional repository.",
        linkLabel: "View thesis repository",
        thesisTitle:
          "\"Diagnóstico de faltas incipientes em transformadores de potência baseado na análise de gases dissolvidos no óleo isolante empregando redes neurais artificiais\"",
        summary:
          "The dissolved gasses analysis in transformer's oil is a methodology used in present days to diagnostic faults in power transformers. This work's objective is to use artificial neural networks to create an alternative method of dissolved gasses analysis in transformer's oil with technical standard IEC 60599 as base. Thereby, it is proposed to analyze the data obtained with several types of network training methods to verify which method and which network configuration has better efficiency with the expected results. In that way, it was possible to achieve a 91% efficiency, indicating that the used method has potential to be used in dissolved gasses analysis in power transformers.",
      },
      articles: {},
      notes: {},
    },
    projects: {
      breadcrumb: "Projects",
      title: "Projects",
      description: "Software applications, tools, and utilities developed to solve engineering and technical challenges.",
      meta: {
        title: "Projects — Adrian Felipe Nogueira Batista",
        description: "Software engineering projects, tools, and applications developed for engineering workflows and industrial processes.",
      },
      empty: "No projects available yet.",
      items: {
        netSalaryCalculator: {
          title: "Net Salary Calculator",
          desc: "A web application for calculating net salary based on gross income, taxes, and deductions.",
          category: "Software Engineering",
          tags: {
            0: "JavaScript",
            1: "Web App",
            2: "Finance",
          },
        },
        backgroundRemover: {
          title: "Background Remover",
          desc: "A browser-based tool that removes image backgrounds locally and exports a transparent PNG.",
          category: "Software Engineering",
          tags: { 0: "Web App", 1: "Image Processing", 2: "Client-Side" },
        },
        uuidGenerator: {
          title: "UUID Generator",
          desc: "A browser-based UUID generator with version 4 as the default and version 1 and 7 options.",
          category: "Software Engineering",
          tags: { 0: "JavaScript", 1: "Web Tool", 2: "RFC 9562" },
        },
        chessStudy: {
          title: "Chess Study Environment",
          desc: "A private browser workspace that combines annotated PGN navigation with a one-column-at-a-time chess book reader.",
          category: "Software Engineering",
          tags: { 0: "JavaScript", 1: "PDF.js", 2: "Chess" },
        },
      },
    },
    articles: {
      title: "Articles",
      description: "Technical notes and project documentation for the tools published on this site.",
      meta: {
        title: "Articles — Adrian Felipe Nogueira Batista",
        description: "Technical articles and project documentation by Adrian Felipe Nogueira Batista.",
      },
      items: {
        netSalary: {
          category: "Payroll guide",
          title: "How Net Salary Is Calculated",
          description: "An explanation of the deductions, tax stages, and estimate produced by the Net Salary Calculator.",
        },
        backgroundRemover: {
          category: "Image processing",
          title: "How the Client-Side Background Remover Works",
          description: "A practical overview of the local neural-segmentation workflow used to export transparent PNG images.",
        },
        uuidGenerator: {
          category: "Distributed systems",
          title: "UUID: History, Motivation, Versions and Usage",
          description: "A practical guide to the history, structure, versions, and correct use of UUIDs.",
        },
        chessStudy: {
          category: "Interactive documents",
          title: "Building a Local Chess Book Study Workspace",
          description: "Architecture notes for combining annotated PGN navigation with a calibrated one-column PDF reader.",
        },
      },
    },
    technologies: {
      heading: "Technologies",
      intro: "A toolkit built for engineering environments — developed and applied across industrial automation, power systems, and enterprise software.",
      groups: {
        programming: { title: "Programming" },
        frameworks: { title: "Frameworks" },
        database: { title: "Database" },
        engineering: { title: "Engineering" },
        infrastructure: { title: "Infrastructure" },
      },
    },
    experience: {
      heading: "Experience",
      intro: "From industrial automation training to senior engineering software development — a career grounded in technical depth and real engineering challenges.",
      items: {
        0: {
          role: "Industrial Automation",
          period: "Jan 2014 – Jan 2015",
          desc: "Technical course in Industrial Automation — foundational training in industrial control systems and automation.",
        },
        1: {
          role: "Electrical Engineering",
          period: "Jan 2016 – Jan 2021",
          desc: "Bachelor's degree in Electrical and Electronics Engineering.",
        },
        2: {
          role: "Engineering Internship",
          period: "Feb 2021 – Sep 2022",
          desc: "Contributed to engineering projects in the transformer service department — assisted in developing and testing engineering solutions, and supported technical documentation.",
        },
        3: {
          role: "Mid-level Software Developer",
          period: "Sep 2022 – Dec 2024",
          desc: "Designed and developed web and desktop applications (PHP/Laravel, C#/.NET, Python/Django) with React.js interfaces, and managed SQL Server/MySQL databases to support engineering operations.",
        },
        4: {
          role: "Senior Software Development Analyst",
          period: "Aug 2024 – Present",
          desc: "Designs and implements software solutions for engineering processes, including Creo Toolkit applications that improve the power transformer design workflow, alongside web/desktop applications used by hundreds of users across the organization.",
        },
      },
    },
    philosophy: {
      heading: "Philosophy",
      quote:
        "I believe the best engineering solutions emerge when software and engineering work together. My goal is to create tools that automate technical processes, simplify complex workflows and allow engineers to focus on solving real problems.",
    },
    contact: {
      heading: "Contact",
      intro: "Open to technical conversations, collaboration opportunities, or discussing engineering software challenges.",
      linkedinLabel: "LinkedIn",
      githubLabel: "GitHub",
      emailLabel: "Email",
    },
    footer: {
      rights: "© 2026 Adrian Felipe Nogueira Batista.",
      tagline: "Engineering better solutions through software.",
    },
  },

  pt: {
    meta: {
      title: "Adrian Felipe Nogueira Batista — Engenheiro",
      description: "Engenheiro Eletricista especializado em desenvolvimento de software para engenharia. Transformando processos de engenharia por meio do desenvolvimento de software.",
    },
    nav: {
      skip: "Pular para o conteúdo",
      brand: "AFNB",
      about: "Sobre",
      portfolio: "Portfólio",
      publications: "Publicações",
      articles: "Artigos",
      projects: "Projetos",
      technologies: "Tecnologias",
      experience: "Experiência",
      philosophy: "Filosofia",
      contact: "Contato",
      langToggleLabel: "Alterar idioma",
      menuToggleLabel: "Abrir menu de navegação",
    },
    hero: {
      eyebrow: "Engenheiro Eletricista • Engenheiro de Software",
      name: "Adrian Felipe Nogueira Batista",
      statement:
        "Desenvolvendo soluções de software para engenharia, processos industriais e aplicações técnicas.",
    },
    about: {
      heading: "Sobre",
      intro:
        "O diferencial não está em conhecer múltiplas linguagens de programação — está em entender problemas de engenharia a fundo o suficiente para construir software que engenheiros realmente utilizam.",
      steps: {
        0: {
          label: "Automação Industrial",
          desc: "Início na automação, atuando diretamente com controle industrial e instrumentação.",
        },
        1: {
          label: "Engenharia Elétrica",
          desc: "Construção de uma base formal de engenharia — sistemas de potência, instrumentação e rigor técnico.",
        },
        2: {
          label: "Desenvolvimento de Software",
          desc: "Transição para software para resolver problemas de engenharia que processos manuais não conseguiam escalar.",
        },
        3: {
          label: "Software para Engenharia",
          desc: "Atualmente desenvolve software voltado especificamente para fluxos de engenharia e indústria.",
        },
      },
    },
    portfolio: {
      heading: "Portfólio de Engenharia",
      intro: "Trabalhos de software, elétrica e pesquisa desenvolvidos ao longo de uma carreira que abrange automação industrial, sistemas de potência e engenharia de software corporativo.",
      categories: {
        software: {
          title: "Engenharia de Software",
          items: {
            0: {
              title: "Aplicações Web e Desktop para Operações de Engenharia",
              desc: "Aplicações full-stack desenvolvidas em PHP/Laravel, C#/.NET e Python/Django com frontends React.js e bancos de dados SQL Server/MySQL. Construídas para suportar equipes de engenharia — automatizando fluxos, integrando dados técnicos e melhorando eficiência operacional.",
              tags: "Desenvolvimento Full-Stack",
            },
            1: {
              title: "Aplicações Creo Toolkit",
              desc: "Soluções de software especializadas construídas com Creo Toolkit para melhorar fluxos de design de transformadores de potência. Implantadas em centenas de usuários na organização, conectando automação CAD e processos de engenharia.",
              tags: "Integração CAD",
            },
          },
        },
        electrical: {
          title: "Engenharia Elétrica",
          items: {
            0: {
              title: "Automação Industrial & Sistemas de Controle",
              desc: "Base técnica em automação industrial — design de sistemas de controle, integração de instrumentação e automação de processos baseada em CLPs. Foco em conectar hardware e software em ambientes industriais automatizados.",
              tags: "Controle Industrial",
            },
            1: {
              title: "Engenharia & Análise de Transformadores de Potência",
              desc: "Suporte técnico em transformadores de potência — documentação técnica, análise de falhas, otimização de design e fluxos de testes. Aplicação de metodologia com IA/redes neurais para sistemas de diagnóstico por análise de gases dissolvidos (DGA).",
              tags: "Sistemas de Potência",
            },
          },
        },
        research: {
          title: "Pesquisa",
          items: {
            0: {
              title: "Trabalho de Conclusão de Curso",
              desc: "Consulte Publicações & Estudos para o registro acadêmico completo.",
              tags: "Acadêmico",
            },
          },
        },
        opensource: {
          title: "Código Aberto",
          items: {
            0: {
              title: "Projetos Pessoais & Contribuições",
              desc: "Repositórios públicos no GitHub apresentando experimentos técnicos, utilitários e contribuições em projetos focados em engenharia.",
              tags: "GitHub",
            },
          },
        },
      },
    },
    publications: {
      heading: "Publicações & Estudos",
      academic: {
        title: "Acadêmico",
        desc: "Trabalho de conclusão de curso, depositado no repositório institucional da UNESP.",
        linkLabel: "Ver repositório do TCC",
        thesisTitle:
          "\"Diagnóstico de faltas incipientes em transformadores de potência baseado na análise de gases dissolvidos no óleo isolante empregando redes neurais artificiais\"",
        summary:
          "A análise de gases dissolvidos no óleo isolante é uma metodologia utilizada atualmente para diagnosticar falhas em transformadores de potência. Este trabalho tem como objetivo utilizar redes neurais artificiais para criar um método alternativo de análise de gases dissolvidos no óleo do transformador, tendo como base a norma técnica IEC 60599. Assim, propõe-se analisar os dados obtidos com diversos métodos de treinamento de rede, verificando qual método e qual configuração de rede apresenta melhor eficiência frente aos resultados esperados. Dessa forma, foi possível atingir uma eficiência de 91%, indicando que o método utilizado tem potencial para ser aplicado na análise de gases dissolvidos em transformadores de potência.",
      },
      articles: {},
      notes: {},
    },
    projects: {
      breadcrumb: "Projetos",
      title: "Projetos",
      description: "Aplicações de software, ferramentas e utilitários desenvolvidos para resolver desafios de engenharia e técnicos.",
      meta: {
        title: "Projetos — Adrian Felipe Nogueira Batista",
        description: "Projetos de engenharia de software, ferramentas e aplicações desenvolvidas para fluxos de trabalho de engenharia e processos industriais.",
      },
      empty: "Nenhum projeto disponível no momento.",
      items: {
        netSalaryCalculator: {
          title: "Calculadora de Salário Líquido",
          desc: "Uma aplicação web para calcular salário líquido baseado em rendimento bruto, impostos e deduções.",
          category: "Engenharia de Software",
          tags: {
            0: "JavaScript",
            1: "Web App",
            2: "Finanças",
          },
        },
        backgroundRemover: {
          title: "Removedor de Fundo",
          desc: "Uma ferramenta executada no navegador que remove fundos localmente e exporta um PNG transparente.",
          category: "Engenharia de Software",
          tags: { 0: "Web App", 1: "Processamento de Imagens", 2: "Cliente" },
        },
        uuidGenerator: {
          title: "Gerador de UUID",
          desc: "Um gerador de UUID no navegador, com versão 4 padrão e opções das versões 1 e 7.",
          category: "Engenharia de Software",
          tags: { 0: "JavaScript", 1: "Ferramenta Web", 2: "RFC 9562" },
        },
        chessStudy: {
          title: "Ambiente de Estudo de Xadrez",
          desc: "Um ambiente privado no navegador que combina navegação por PGNs anotados com um leitor de livros por coluna.",
          category: "Engenharia de Software",
          tags: { 0: "JavaScript", 1: "PDF.js", 2: "Xadrez" },
        },
      },
    },
    articles: {
      title: "Artigos",
      description: "Notas técnicas e documentação dos projetos publicados neste site.",
      meta: {
        title: "Artigos — Adrian Felipe Nogueira Batista",
        description: "Artigos técnicos e documentação de projetos de Adrian Felipe Nogueira Batista.",
      },
      items: {
        netSalary: {
          category: "Guia de folha de pagamento",
          title: "Como o Salário Líquido É Calculado",
          description: "Uma explicação das deduções, etapas tributárias e estimativa produzida pela Calculadora de Salário Líquido.",
        },
        backgroundRemover: {
          category: "Processamento de imagens",
          title: "Como o Removedor de Fundo Client-Side Funciona",
          description: "Uma visão prática do fluxo local de segmentação neural usado para exportar imagens PNG transparentes.",
        },
        uuidGenerator: {
          category: "Sistemas distribuídos",
          title: "UUID: História, Motivação, Versões e Uso",
          description: "Um guia prático sobre a história, estrutura, versões e uso correto de UUIDs.",
        },
        chessStudy: {
          category: "Documentos interativos",
          title: "Construindo um Ambiente Local para Estudo de Livros de Xadrez",
          description: "Notas de arquitetura para combinar navegação de PGNs anotados com um leitor de PDF por coluna calibrável.",
        },
      },
    },
    technologies: {
      heading: "Tecnologias",
      intro: "Um conjunto de ferramentas construído para ambientes de engenharia — desenvolvido e aplicado em automação industrial, sistemas de potência e software corporativo.",
      groups: {
        programming: { title: "Linguagens" },
        frameworks: { title: "Frameworks" },
        database: { title: "Banco de Dados" },
        engineering: { title: "Engenharia" },
        infrastructure: { title: "Infraestrutura" },
      },
    },
    experience: {
      heading: "Experiência",
      intro: "Da formação em automação industrial ao desenvolvimento sênior de software para engenharia — uma trajetória fundamentada em profundidade técnica e desafios reais.",
      items: {
        0: {
          role: "Automação Industrial",
          period: "Jan 2014 – Jan 2015",
          desc: "Curso técnico em Automação Industrial — formação inicial em sistemas de controle industrial e automação.",
        },
        1: {
          role: "Engenharia Elétrica",
          period: "Jan 2016 – Jan 2021",
          desc: "Bacharelado em Engenharia Elétrica e Eletrônica.",
        },
        2: {
          role: "Estágio em Engenharia",
          period: "Fev 2021 – Set 2022",
          desc: "Contribuiu com projetos de engenharia no departamento de serviços de transformadores — auxiliou no desenvolvimento e teste de soluções de engenharia e apoiou a documentação técnica.",
        },
        3: {
          role: "Desenvolvedor de Software Pleno",
          period: "Set 2022 – Dez 2024",
          desc: "Projetou e desenvolveu aplicações web e desktop (PHP/Laravel, C#/.NET, Python/Django) com interfaces em React.js, e administrou bancos de dados SQL Server/MySQL para apoiar operações de engenharia.",
        },
        4: {
          role: "Analista Sênior de Desenvolvimento de Software",
          period: "Ago 2024 – Presente",
          desc: "Projeta e implementa soluções de software para processos de engenharia, incluindo aplicações em Creo Toolkit que aprimoram o fluxo de projeto de transformadores de potência, além de aplicações web/desktop utilizadas por centenas de usuários na organização.",
        },
      },
    },
    philosophy: {
      heading: "Filosofia",
      quote:
        "Acredito que as melhores soluções de engenharia surgem quando software e engenharia trabalham juntos. Meu objetivo é criar ferramentas que automatizem processos técnicos, simplifiquem fluxos de trabalho complexos e permitam que engenheiros foquem em resolver problemas reais.",
    },
    contact: {
      heading: "Contato",
      intro: "Aberto a conversas técnicas, oportunidades de colaboração ou discussões sobre desafios de software para engenharia.",
      linkedinLabel: "LinkedIn",
      githubLabel: "GitHub",
      emailLabel: "E-mail",
    },
    footer: {
      rights: "© 2026 Adrian Felipe Nogueira Batista.",
      tagline: "Transformando processos de engenharia por meio do desenvolvimento de software.",
    },
  },
};

function getPath(obj, path) {
  return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function deepMerge(target, source) {
  Object.keys(source).forEach((key) => {
    if (isPlainObject(source[key]) && isPlainObject(target[key])) {
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  });
  return target;
}

/**
 * Registers additional translation keys (e.g. from a subproject page's own
 * i18n module) by deep-merging them into the shared dictionary. Safe to call
 * before or after `initI18n()` — if translations were already applied to the
 * DOM, they are re-applied with the newly merged keys.
 *
 * Expected shape: { en: { ... }, pt: { ... } }
 */
export function registerTranslations(extra) {
  SUPPORTED_LANGS.forEach((lang) => {
    if (isPlainObject(extra[lang])) {
      translations[lang] = translations[lang] || {};
      deepMerge(translations[lang], extra[lang]);
    }
  });

  if (i18nInitialized) {
    applyTranslations(currentLang);
  }
}

function resolveLanguage() {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get(QUERY_PARAM);
  if (fromQuery && SUPPORTED_LANGS.includes(fromQuery)) {
    return fromQuery;
  }

  const fromStorage = window.localStorage.getItem(STORAGE_KEY);
  if (fromStorage && SUPPORTED_LANGS.includes(fromStorage)) {
    return fromStorage;
  }

  const navLang = (navigator.language || DEFAULT_LANG).slice(0, 2).toLowerCase();
  if (SUPPORTED_LANGS.includes(navLang)) {
    return navLang;
  }

  return DEFAULT_LANG;
}

function applyTranslations(lang) {
  const dict = translations[lang] || translations[DEFAULT_LANG];

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const value = getPath(dict, el.getAttribute("data-i18n"));
    if (typeof value === "string") {
      el.textContent = value;
    }
  });

  document.querySelectorAll("[data-i18n-content]").forEach((el) => {
    const value = getPath(dict, el.getAttribute("data-i18n-content"));
    if (typeof value === "string") {
      el.setAttribute("content", value);
    }
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
    const value = getPath(dict, el.getAttribute("data-i18n-aria-label"));
    if (typeof value === "string") {
      el.setAttribute("aria-label", value);
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const value = getPath(dict, el.getAttribute("data-i18n-placeholder"));
    if (typeof value === "string") {
      el.setAttribute("placeholder", value);
    }
  });

  document.documentElement.lang = lang;

  document.querySelectorAll("[data-lang-option]").forEach((el) => {
    el.classList.toggle("is-active", el.getAttribute("data-lang-option") === lang);
  });

  if (typeof window !== "undefined") {
    window.applyTranslations = () => applyTranslations(currentLang);
  }
}

function persistLanguage(lang) {
  window.localStorage.setItem(STORAGE_KEY, lang);

  const url = new URL(window.location.href);
  url.searchParams.set(QUERY_PARAM, lang);
  window.history.replaceState({}, "", url);
}

let currentLang = DEFAULT_LANG;
let i18nInitialized = false;

export function setLanguage(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) return;
  currentLang = lang;
  applyTranslations(currentLang);
  persistLanguage(currentLang);
  document.dispatchEvent(new Event("languageChange"));
}

export function getLanguage() {
  return currentLang;
}

export function initI18n() {
  currentLang = resolveLanguage();
  i18nInitialized = true;
  applyTranslations(currentLang);
  persistLanguage(currentLang);

  const toggle = document.getElementById("lang-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const next = currentLang === "en" ? "pt" : "en";
      setLanguage(next);
    });
  }
}
