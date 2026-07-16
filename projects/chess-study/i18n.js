/** Translations specific to the Chess Study Environment project. */
export default {
  en: {
    project: {
      chessStudy: {
        meta: {
          title: "Chess Study Environment — Adrian Felipe Nogueira Batista",
          description:
            "Study chess books and their PGN game collections together in a private, browser-based workspace.",
        },
        title: "Chess Study",
        subtitle: "Book and game analysis workspace",
        back: "Projects",
        privacy: "Files stay in this browser.",
        loadPdf: "Load PDF",
        loadPgn: "Load PGN",
        replacePdf: "Replace PDF",
        replacePgn: "Replace PGN",
        clear: "Clear study",
        tabs: {
          label: "Workspace panels",
          games: "Games",
          board: "Board",
          book: "Book",
        },
        games: {
          title: "Games",
          searchLabel: "Filter games",
          searchPlaceholder: "Player, event, ECO…",
          emptyTitle: "No PGN loaded",
          emptyText:
            "Load a PGN file to browse its games, annotations, and variations.",
          noResults: "No games match this filter.",
        },
        board: {
          title: "Game board",
          emptyTitle: "Choose a PGN",
          emptyText:
            "The selected game's position, moves, comments, and variations will appear here.",
          dropPgn: "Drop a PGN file to load the games",
          white: "White",
          black: "Black",
          event: "Event",
          date: "Date",
          round: "Round",
          result: "Result",
          first: "Initial position",
          previous: "Previous move",
          next: "Next move",
          last: "Final position",
          flip: "Flip board",
          moves: "Moves and annotations",
          initial: "Start",
          position: "Current position",
        },
        book: {
          title: "Book",
          emptyTitle: "No PDF loaded",
          emptyText:
            "Load a two-column chess book. The reader displays one column at a time.",
          dropPdf: "Drop a PDF file to load the book",
          previous: "Previous column",
          next: "Next column",
          page: "Page",
          of: "of",
          left: "Left",
          right: "Right",
          full: "Full page",
          zoomOut: "Zoom out",
          zoomIn: "Zoom in",
          fit: "Fit column",
          settings: "Column calibration",
          split: "Column split",
          innerMargin: "Center trim",
          outerMargin: "Outer trim",
          reset: "Reset calibration",
          regionLabel: "Reading region",
        },
        ocr: {
          scan: "Scan diagrams",
          close: "Close",
          candidatesTitle: "Choose the matching position",
          candidatesText:
            "Choose which corresponding PGN game or position to open.",
        },
        articleLink: "Read the implementation notes",
        article: {
          breadcrumb: "Article",
          meta: {
            title:
              "Chess Study Architecture — Adrian Felipe Nogueira Batista",
            description:
              "Architecture and implementation notes for combining annotated PGN navigation with a one-column PDF reader.",
          },
          title: "Building a Local Chess Book Study Workspace",
          subtitle:
            "A client-side architecture for studying annotated games beside two-column chess books.",
          tags: {
            0: "JavaScript",
            1: "PDF.js",
            2: "Chess",
          },
          problem: {
            title: "The study problem",
            p1:
              "Many chess books separate explanation from replay. The reader follows a dense two-column PDF while switching to another application to locate and navigate the referenced game.",
            p2:
              "This project places the game collection, current board position, and one readable book column in the same workspace without uploading the source files.",
          },
          architecture: {
            title: "Application architecture",
            p1:
              "The application remains a static set of HTML, CSS, and ES modules. PDF.js renders local PDF bytes, cm-pgn parses annotated multi-game PGNs, and cm-chessboard displays each parsed FEN position.",
            p2:
              "A local recognition pipeline detects printed diagrams on the active PDF page, classifies each square as empty, White, or Black, and ranks positions from the loaded PGN before navigating to a high-confidence match.",
          },
          pdf: {
            title: "Rendering one PDF column",
            p1:
              "A PDF page is rendered through a translated canvas transform so only the selected reading region appears. The sequence advances left column, right column, then the next page.",
            p2:
              "Books and scans do not always split at exactly half the page, so the reader stores adjustable split, center-trim, and outer-trim values for the active book.",
          },
          privacy: {
            title: "Local data and persistence",
            p1:
              "Selected PDF and PGN files are processed in the browser. IndexedDB provides best-effort restoration of the active study, while a clear action removes the stored session.",
            p2:
              "All imported headers, comments, and filenames are rendered as text rather than executable markup.",
          },
          limitations: {
            title: "Current limitations",
            items: {
              0: "Diagram recognition currently targets axis-aligned monochrome printed boards; unfamiliar styles may require candidate confirmation.",
              1: "No engine analysis or PGN editing.",
              2: "Automatic matching requires the exact diagram position to exist in the loaded PGN.",
              3: "Browser storage may be cleared or evicted by the browser.",
            },
          },
          openTool: "Open Chess Study",
        },
      },
    },
  },
  pt: {
    project: {
      chessStudy: {
        meta: {
          title: "Ambiente de Estudo de Xadrez — Adrian Felipe Nogueira Batista",
          description:
            "Estude livros de xadrez e suas coleções de partidas PGN em um ambiente privado executado no navegador.",
        },
        title: "Estudo de Xadrez",
        subtitle: "Ambiente para livro e análise de partidas",
        back: "Projetos",
        privacy: "Os arquivos permanecem neste navegador.",
        loadPdf: "Carregar PDF",
        loadPgn: "Carregar PGN",
        replacePdf: "Trocar PDF",
        replacePgn: "Trocar PGN",
        clear: "Limpar estudo",
        tabs: {
          label: "Painéis do ambiente",
          games: "Partidas",
          board: "Tabuleiro",
          book: "Livro",
        },
        games: {
          title: "Partidas",
          searchLabel: "Filtrar partidas",
          searchPlaceholder: "Jogador, evento, ECO…",
          emptyTitle: "Nenhum PGN carregado",
          emptyText:
            "Carregue um arquivo PGN para navegar pelas partidas, anotações e variantes.",
          noResults: "Nenhuma partida corresponde ao filtro.",
        },
        board: {
          title: "Tabuleiro da partida",
          emptyTitle: "Escolha um PGN",
          emptyText:
            "A posição, os lances, comentários e variantes da partida selecionada aparecerão aqui.",
          dropPgn: "Solte um arquivo PGN para carregar as partidas",
          white: "Brancas",
          black: "Pretas",
          event: "Evento",
          date: "Data",
          round: "Rodada",
          result: "Resultado",
          first: "Posição inicial",
          previous: "Lance anterior",
          next: "Próximo lance",
          last: "Posição final",
          flip: "Inverter tabuleiro",
          moves: "Lances e anotações",
          initial: "Início",
          position: "Posição atual",
        },
        book: {
          title: "Livro",
          emptyTitle: "Nenhum PDF carregado",
          emptyText:
            "Carregue um livro de xadrez em duas colunas. O leitor exibe uma coluna por vez.",
          dropPdf: "Solte um arquivo PDF para carregar o livro",
          previous: "Coluna anterior",
          next: "Próxima coluna",
          page: "Página",
          of: "de",
          left: "Esquerda",
          right: "Direita",
          full: "Página inteira",
          zoomOut: "Reduzir zoom",
          zoomIn: "Aumentar zoom",
          fit: "Ajustar coluna",
          settings: "Calibração das colunas",
          split: "Divisão das colunas",
          innerMargin: "Recorte central",
          outerMargin: "Recorte externo",
          reset: "Restaurar calibração",
          regionLabel: "Região de leitura",
        },
        ocr: {
          scan: "Detectar diagramas",
          close: "Fechar",
          candidatesTitle: "Escolha a posição correspondente",
          candidatesText:
            "Escolha qual partida ou posição correspondente do PGN abrir.",
        },
        articleLink: "Leia as notas de implementação",
        article: {
          breadcrumb: "Artigo",
          meta: {
            title:
              "Arquitetura do Estudo de Xadrez — Adrian Felipe Nogueira Batista",
            description:
              "Arquitetura e notas de implementação para combinar navegação de PGNs anotados com um leitor de PDF por coluna.",
          },
          title: "Construindo um Ambiente Local para Estudo de Livros de Xadrez",
          subtitle:
            "Uma arquitetura client-side para estudar partidas anotadas ao lado de livros de xadrez em duas colunas.",
          tags: {
            0: "JavaScript",
            1: "PDF.js",
            2: "Xadrez",
          },
          problem: {
            title: "O problema de estudo",
            p1:
              "Muitos livros de xadrez separam a explicação da reprodução. O leitor acompanha um PDF denso em duas colunas enquanto troca para outro aplicativo para localizar e navegar pela partida citada.",
            p2:
              "Este projeto coloca a coleção de partidas, a posição atual do tabuleiro e uma coluna legível do livro no mesmo ambiente, sem enviar os arquivos de origem.",
          },
          architecture: {
            title: "Arquitetura da aplicação",
            p1:
              "A aplicação permanece um conjunto estático de HTML, CSS e módulos ES. PDF.js renderiza os bytes locais do PDF, cm-pgn interpreta PGNs anotados com várias partidas e cm-chessboard exibe cada posição FEN.",
            p2:
              "Um pipeline local detecta diagramas impressos na página atual do PDF, classifica cada casa como vazia, branca ou preta e ordena as posições do PGN carregado antes de navegar para uma correspondência de alta confiança.",
          },
          pdf: {
            title: "Renderizando uma coluna do PDF",
            p1:
              "A página do PDF é renderizada por meio de uma transformação deslocada no canvas, de modo que apenas a região de leitura selecionada apareça. A sequência avança pela coluna esquerda, coluna direita e então pela próxima página.",
            p2:
              "Livros e digitalizações nem sempre se dividem exatamente no meio, portanto o leitor armazena ajustes de divisão, recorte central e recorte externo para o livro ativo.",
          },
          privacy: {
            title: "Dados locais e persistência",
            p1:
              "Os arquivos PDF e PGN selecionados são processados no navegador. O IndexedDB oferece restauração de melhor esforço para o estudo ativo, enquanto uma ação de limpeza remove a sessão armazenada.",
            p2:
              "Cabeçalhos, comentários e nomes de arquivos importados são renderizados como texto, nunca como marcação executável.",
          },
          limitations: {
            title: "Limitações atuais",
            items: {
              0: "O reconhecimento atualmente prioriza diagramas monocromáticos e alinhados; estilos desconhecidos podem exigir confirmação.",
              1: "Sem análise por engine ou edição de PGN.",
              2: "A correspondência automática exige que a posição exata do diagrama exista no PGN carregado.",
              3: "O armazenamento pode ser removido pelo navegador.",
            },
          },
          openTool: "Abrir Estudo de Xadrez",
        },
      },
    },
  },
};
