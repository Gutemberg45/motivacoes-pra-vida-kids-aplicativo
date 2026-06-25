// ==================================================
// ARQUIVO: ia-generator.js
// GERAÇÃO DE HISTÓRIAS – MOTIVAÇÕES PRA VIDA KIDS
// ==================================================

// Configuração com a chave de ambiente
const OPENAI_CONFIG = {
  apiKey: process.env.OPENAI_API_KEY || "",
  modelo: "gpt-3.5-turbo",
  temperatura: 0.7 // Deixa o texto criativo mas adequado para crianças
};

/**
 * Verifica se a configuração está pronta
 */
function configuracaoIaValida() {
  return OPENAI_CONFIG.apiKey.length > 0;
}

/**
 * Monta o texto de instrução enviado para a IA
 * @param {object} dados - perfil e escolhas do usuário
 */
function montarPrompt(dados) {
  const { nome, idade, tema, personagem, tom } = dados;

  return `
  Crie uma história curta, educativa e adequada para crianças de ${idade} anos.
  Nome da criança: ${nome}
  Tema principal: ${tema}
  Personagem principal: ${personagem}
  Tom da história: ${tom}

  Regras importantes:
  - Linguagem simples, clara e positiva
  - Com mensagem de bom caráter, respeito ou motivação
  - Estrutura: início, meio e fim
  - Tamanho médio: aproximadamente 250 a 400 palavras
  - Sem palavras difíceis ou assuntos inadequados
  `;
}

/**
 * Função principal: gera a história completa
 * @param {object} dadosUsuario - tudo o que foi escolhido na tela
 */
async function gerarHistoria(dadosUsuario) {
  if (!configuracaoIaValida()) {
    return {
      sucesso: false,
      mensagem: "❌ Configuração da inteligência artificial não está completa."
    };
  }

  try {
    const resposta = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_CONFIG.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: OPENAI_CONFIG.modelo,
        messages: [
          { role: "system", content: "Você é um contador de histórias especializado em crianças, com linguagem leve e educativa." },
          { role: "user", content: montarPrompt(dadosUsuario) }
        ],
        temperature: OPENAI_CONFIG.temperatura
      })
    });

    const resultado = await resposta.json();

    if (!resposta.ok || !resultado.choices) {
      throw new Error(resultado.error?.message || "Resposta inválida do serviço");
    }

    const textoGerado = resultado.choices[0].message.content.trim();

    return {
      sucesso: true,
      mensagem: "✅ História criada com sucesso!",
      historia: textoGerado
    };

  } catch (erro) {
    let mensagemErro = "❌ Não foi possível gerar a história. Tente novamente.";

    if (erro.message.includes("API key")) {
      mensagemErro = "❌ Chave de acesso da IA inválida ou ausente.";
    } else if (erro.message.includes("limit")) {
      mensagemErro = "❌ Limite de uso atingido no momento — aguarde um pouco.";
    }

    return {
      sucesso: false,
      mensagem: mensagemErro
    };
  }
}

// Exporta para ser usado na página criar‑historia.html
export {
  configuracaoIaValida,
  gerarHistoria
};
