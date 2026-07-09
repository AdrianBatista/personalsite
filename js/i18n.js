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
    nav: {
      skip: "Skip to content",
      brand: "AFNB",
      about: "About",
      portfolio: "Portfolio",
      publications: "Publications",
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
      intro: "Projects organized by domain, not by technology.",
      categories: {
        software: {
          title: "Software Engineering",
          items: {
            0: {
              title: "Internal Process Automation Tool",
              desc: "Placeholder — a web application that replaced a manual spreadsheet-based workflow. Add real project details here.",
              tags: "Web Application",
            },
            1: {
              title: "Engineering Data API",
              desc: "Placeholder — a REST API exposing engineering datasets to internal tools. Add real project details here.",
              tags: "API",
            },
          },
        },
        electrical: {
          title: "Electrical Engineering",
          items: {
            0: {
              title: "Instrumentation Monitoring Panel",
              desc: "Placeholder — a supervisory panel for instrumentation signals. Add real project details here.",
              tags: "Instrumentation",
            },
            1: {
              title: "Embedded Control Module",
              desc: "Placeholder — an embedded system for a specific automation task. Add real project details here.",
              tags: "Embedded Systems",
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
              title: "GitHub Repositories",
              desc: "Placeholder — link to public repositories once finalized.",
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
      },
      articles: {
        title: "Technical Articles",
        items: {
          0: "Engineering automation with Python",
          1: "Industrial software architecture",
          2: "Building engineering applications",
          3: "SQL for engineering systems",
        },
        placeholderNote: "Placeholder titles — add links once articles are published.",
      },
      notes: {
        title: "Study Notes",
        placeholderNote:
          "Placeholder — smaller notes documenting ongoing learning will be listed here.",
      },
    },
    technologies: {
      heading: "Technologies",
      intro: "Grouped by purpose, not as a technology list.",
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
      intro: "A timeline, not a résumé.",
      items: {
        0: { role: "Industrial Automation", period: "Technical Education" },
        1: { role: "Electrical Engineering", period: "Undergraduate Degree" },
        2: { role: "Engineering Internship" },
        3: { role: "Software Developer" },
        4: { role: "Senior Software Development Analyst" },
      },
    },
    philosophy: {
      heading: "Philosophy",
      quote:
        "I believe the best engineering solutions emerge when software and engineering work together. My goal is to create tools that automate technical processes, simplify complex workflows and allow engineers to focus on solving real problems.",
    },
    contact: {
      heading: "Contact",
      intro: "Minimal, direct.",
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
    nav: {
      skip: "Pular para o conteúdo",
      brand: "AFNB",
      about: "Sobre",
      portfolio: "Portfólio",
      publications: "Publicações",
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
      intro: "Projetos organizados por domínio, não por tecnologia.",
      categories: {
        software: {
          title: "Engenharia de Software",
          items: {
            0: {
              title: "Ferramenta de Automação de Processos Internos",
              desc: "Placeholder — uma aplicação web que substituiu um processo manual baseado em planilhas. Adicionar detalhes reais do projeto aqui.",
              tags: "Aplicação Web",
            },
            1: {
              title: "API de Dados de Engenharia",
              desc: "Placeholder — uma API REST que expõe dados de engenharia para ferramentas internas. Adicionar detalhes reais do projeto aqui.",
              tags: "API",
            },
          },
        },
        electrical: {
          title: "Engenharia Elétrica",
          items: {
            0: {
              title: "Painel de Monitoramento de Instrumentação",
              desc: "Placeholder — um painel supervisório para sinais de instrumentação. Adicionar detalhes reais do projeto aqui.",
              tags: "Instrumentação",
            },
            1: {
              title: "Módulo de Controle Embarcado",
              desc: "Placeholder — um sistema embarcado para uma tarefa específica de automação. Adicionar detalhes reais do projeto aqui.",
              tags: "Sistemas Embarcados",
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
              title: "Repositórios no GitHub",
              desc: "Placeholder — link para repositórios públicos assim que finalizados.",
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
      },
      articles: {
        title: "Artigos Técnicos",
        items: {
          0: "Automação de engenharia com Python",
          1: "Arquitetura de software industrial",
          2: "Construindo aplicações de engenharia",
          3: "SQL para sistemas de engenharia",
        },
        placeholderNote: "Títulos placeholder — adicionar links quando os artigos forem publicados.",
      },
      notes: {
        title: "Notas de Estudo",
        placeholderNote:
          "Placeholder — notas menores documentando aprendizado contínuo serão listadas aqui.",
      },
    },
    technologies: {
      heading: "Tecnologias",
      intro: "Agrupadas por finalidade, não como uma lista de tecnologias.",
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
      intro: "Uma linha do tempo, não um currículo.",
      items: {
        0: { role: "Automação Industrial", period: "Educação Técnica" },
        1: { role: "Engenharia Elétrica", period: "Graduação" },
        2: { role: "Estágio em Engenharia" },
        3: { role: "Desenvolvedor de Software" },
        4: { role: "Analista Sênior de Desenvolvimento de Software" },
      },
    },
    philosophy: {
      heading: "Filosofia",
      quote:
        "Acredito que as melhores soluções de engenharia surgem quando software e engenharia trabalham juntos. Meu objetivo é criar ferramentas que automatizem processos técnicos, simplifiquem fluxos de trabalho complexos e permitam que engenheiros foquem em resolver problemas reais.",
    },
    contact: {
      heading: "Contato",
      intro: "Mínimo, direto.",
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

  document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
    const value = getPath(dict, el.getAttribute("data-i18n-aria-label"));
    if (typeof value === "string") {
      el.setAttribute("aria-label", value);
    }
  });

  document.documentElement.lang = lang;

  document.querySelectorAll("[data-lang-option]").forEach((el) => {
    el.classList.toggle("is-active", el.getAttribute("data-lang-option") === lang);
  });
}

function persistLanguage(lang) {
  window.localStorage.setItem(STORAGE_KEY, lang);

  const url = new URL(window.location.href);
  url.searchParams.set(QUERY_PARAM, lang);
  window.history.replaceState({}, "", url);
}

let currentLang = DEFAULT_LANG;

export function setLanguage(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) return;
  currentLang = lang;
  applyTranslations(currentLang);
  persistLanguage(currentLang);
}

export function getLanguage() {
  return currentLang;
}

export function initI18n() {
  currentLang = resolveLanguage();
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
