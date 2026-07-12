/** Translations specific to the Background Remover project. */
export default {
  en: {
    project: {
      backgroundRemover: {
        category: "Software Engineering",
        meta: {
          title: "Background Remover — Adrian Felipe Nogueira Batista",
          description: "A browser-based interface that removes image backgrounds locally and exports a transparent PNG.",
        },
        title: "Background Remover",
        subtitle: "Drop an image, process it in the browser, and download a transparent PNG without sending the file to a server.",
        tags: { 0: "Web App", 1: "Image Processing", 2: "Client-Side" },
        workspace: {
          status: "Client-side processing",
          note: "The image never leaves your browser.",
        },
        upload: {
          kicker: "Input",
          title: "Source image",
          action: "Drop image here",
          hint: "or select a PNG, JPG, WEBP file",
          replace: "Drop another image to replace",
          fileLabel: "Selected file",
          invalid: "Choose a valid image file.",
        },
        controls: {
          process: "Remove background",
        },
        result: {
          kicker: "Output",
          title: "Transparent result",
          placeholder: "Transparent preview area",
          detail: "An AI-generated subject mask appears here after local processing. The first run downloads and caches the model.",
          processing: "Removing background locally...",
          status: "Waiting for an image",
          download: "Download PNG",
        },
        articleLink: "Read how background removal works",
        article: {
          breadcrumb: "Article",
          meta: {
            title: "How the Client-Side Background Remover Works — Adrian Felipe Nogueira Batista",
            description: "A practical explanation of the browser-only background removal workflow used in this project.",
          },
          title: "How the Client-Side Background Remover Works",
          subtitle: "A practical overview of the local neural-segmentation workflow used to generate a subject mask and export a transparent PNG.",
          tags: { 0: "Guide", 1: "Image Processing", 2: "Client-Side" },
          overview: {
            title: "What this tool does",
            p1: "Background removal separates the main subject of an image from the pixels that form the background. The output keeps the subject and turns the background transparent so the image can be reused in documents, product pages, or visual compositions.",
            p2: "This project runs entirely in the browser. The file is decoded locally, analyzed with canvas APIs, and exported as a PNG without sending the image to a server.",
          },
          process: {
            title: "Local processing stages",
            p1: "The implementation uses IMG.LY's IS-Net neural segmentation engine through ONNX Runtime. The model identifies the foreground subject from the complete image instead of relying on a sampled background color.",
            p2: "The first run downloads and caches the model and WebAssembly runtime. Inference then runs on the user's device, using WebGPU when available and automatically falling back to the CPU.",
            steps: {
              0: { title: "Load", text: "Read the selected file directly in the browser and scale it to a processing canvas." },
              1: { title: "Segment", text: "Run the IS-Net neural model locally to identify the foreground subject." },
              2: { title: "Mask", text: "Convert the model output into a detailed alpha mask, including complex subject edges." },
              3: { title: "Export", text: "Apply the mask, preserve the subject, and export a transparent PNG for download." },
            },
          },
          usage: {
            title: "How to use this interface",
            intro: "The workflow is intentionally direct so the tool stays usable on desktop and mobile.",
            steps: {
              0: "Drop an image into the source panel or click the area to choose a file. The file picker only accepts image formats.",
              1: "Select Remove background to load the AI model and run the local segmentation step.",
              2: "Review the result on the checkerboard surface. The preview is rendered locally in the browser.",
              3: "When the output looks correct, download the generated PNG with transparency preserved.",
            },
            outro: "Best results come from images with a clear subject and a background that is reasonably distinct from the foreground.",
          },
          notes: {
            title: "Implementation notes",
            p1: "The image stays on the user's device. Only the engine runtime and neural model are downloaded from the provider's CDN, then cached by the browser for later runs.",
            p2: "Neural segmentation handles complex scenes and similar foreground/background colors substantially better than the previous color-based heuristic. Fine hair, transparent objects, and motion blur can still produce imperfect edges.",
          },
          openTool: "Open Background Remover",
        },
      },
    },
  },
  pt: {
    project: {
      backgroundRemover: {
        category: "Engenharia de Software",
        meta: {
          title: "Removedor de Fundo — Adrian Felipe Nogueira Batista",
          description: "Uma interface baseada no navegador que remove fundos localmente e exporta um PNG transparente.",
        },
        title: "Removedor de Fundo",
        subtitle: "Solte uma imagem, processe no navegador e baixe um PNG transparente sem enviar o arquivo para um servidor.",
        tags: { 0: "Web App", 1: "Processamento de Imagens", 2: "Cliente" },
        workspace: {
          status: "Processamento no cliente",
          note: "A imagem nunca sai do seu navegador.",
        },
        upload: {
          kicker: "Entrada",
          title: "Imagem de origem",
          action: "Solte a imagem aqui",
          hint: "ou selecione um arquivo PNG, JPG, WEBP",
          replace: "Solte outra imagem para substituir",
          fileLabel: "Arquivo selecionado",
          invalid: "Escolha um arquivo de imagem válido.",
        },
        controls: {
          process: "Remover fundo",
        },
        result: {
          kicker: "Saída",
          title: "Resultado transparente",
          placeholder: "Área de prévia transparente",
          detail: "Uma máscara do assunto gerada por IA aparece aqui após o processamento local. A primeira execução baixa e armazena o modelo em cache.",
          processing: "Removendo o fundo localmente...",
          status: "Aguardando uma imagem",
          download: "Baixar PNG",
        },
        articleLink: "Entenda como funciona a remoção de fundo",
        article: {
          breadcrumb: "Artigo",
          meta: {
            title: "Como o Removedor de Fundo Client-Side Funciona — Adrian Felipe Nogueira Batista",
            description: "Uma explicação prática do fluxo de remoção de fundo executado inteiramente no navegador neste projeto.",
          },
          title: "Como o Removedor de Fundo Client-Side Funciona",
          subtitle: "Uma visão prática do fluxo local de segmentação neural usado para gerar a máscara do assunto e exportar um PNG transparente.",
          tags: { 0: "Guia", 1: "Processamento de Imagens", 2: "Cliente" },
          overview: {
            title: "O que esta ferramenta faz",
            p1: "A remoção de fundo separa o assunto principal de uma imagem dos pixels que formam o fundo. O resultado preserva o assunto e torna o fundo transparente, permitindo reutilizar a imagem em documentos, páginas de produto ou composições visuais.",
            p2: "Este projeto roda inteiramente no navegador. O arquivo é decodificado localmente, analisado com APIs de canvas e exportado como PNG sem enviar a imagem para um servidor.",
          },
          process: {
            title: "Etapas do processamento local",
            p1: "A implementação usa o mecanismo de segmentação neural IS-Net da IMG.LY por meio do ONNX Runtime. O modelo identifica o assunto em primeiro plano a partir da imagem completa, sem depender de uma amostra da cor do fundo.",
            p2: "A primeira execução baixa e armazena em cache o modelo e o runtime WebAssembly. A inferência roda no dispositivo do usuário, usando WebGPU quando disponível e alternando automaticamente para CPU quando necessário.",
            steps: {
              0: { title: "Carregar", text: "Ler o arquivo selecionado diretamente no navegador e redimensioná-lo para a área de processamento." },
              1: { title: "Segmentar", text: "Executar localmente o modelo neural IS-Net para identificar o assunto em primeiro plano." },
              2: { title: "Máscara", text: "Converter a saída do modelo em uma máscara alfa detalhada, incluindo contornos complexos do assunto." },
              3: { title: "Exportar", text: "Aplicar a máscara, preservar o assunto e exportar um PNG transparente para download." },
            },
          },
          usage: {
            title: "Como utilizar esta interface",
            intro: "O fluxo foi mantido direto para continuar utilizável em desktop e mobile.",
            steps: {
              0: "Solte uma imagem no painel de entrada ou clique na área para escolher um arquivo. O seletor aceita apenas formatos de imagem.",
              1: "Selecione Remover fundo para carregar o modelo de IA e iniciar a segmentação local.",
              2: "Revise o resultado sobre a superfície quadriculada. A prévia é renderizada localmente no navegador.",
              3: "Quando o resultado estiver correto, faça o download do PNG gerado com transparência preservada.",
            },
            outro: "Os melhores resultados aparecem em imagens com assunto claro e fundo razoavelmente distinto do primeiro plano.",
          },
          notes: {
            title: "Notas de implementação",
            p1: "A imagem permanece no dispositivo do usuário. Apenas o runtime e o modelo neural são baixados do CDN do fornecedor e armazenados em cache pelo navegador para execuções posteriores.",
            p2: "A segmentação neural trata cenas complexas e cores semelhantes entre fundo e primeiro plano muito melhor do que a heurística anterior. Cabelos finos, objetos transparentes e desfoque de movimento ainda podem gerar contornos imperfeitos.",
          },
          openTool: "Abrir Removedor de Fundo",
        },
      },
    },
  },
};
