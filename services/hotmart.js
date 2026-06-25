// ==================================================
// ARQUIVO: services/hotmart.js
// INTEGRAÇÃO COM HOTMART – MOTIVAÇÕES PRA VIDA KIDS
// ==================================================

// Carrega as configurações das variáveis de ambiente
const HOTMART_CONFIG = {
  clientId: process.env.HOTMART_CLIENT_ID || "",
  clientSecret: process.env.HOTMART_CLIENT_SECRET || "",
  webhookToken: process.env.HOTMART_WEBHOOK_TOKEN || "",
  apiUrl: "https://api-sec-vlc.hotmart.com/v1"
};

/**
 * Verifica se as credenciais estão preenchidas corretamente
 */
function configuracaoValida() {
  return (
    HOTMART_CONFIG.clientId &&
    HOTMART_CONFIG.clientSecret &&
    HOTMART_CONFIG.webhookToken
  );
}

/**
 * Obtém token de acesso para usar a API da Hotmart
 */
async function obterTokenAcesso() {
  if (!configuracaoValida()) {
    throw new Error("❌ Configurações da Hotmart incompletas. Verifique variáveis de ambiente.");
  }

  try {
    const resposta = await fetch(`${HOTMART_CONFIG.apiUrl}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: HOTMART_CONFIG.clientId,
        client_secret: HOTMART_CONFIG.clientSecret
      })
    });

    const dados = await resposta.json();
    if (!resposta.ok) throw new Error(dados.error_description || "Falha ao obter token");

    console.log("✅ Conectado à Hotmart com sucesso");
    return dados.access_token;

  } catch (erro) {
    console.error("❌ Erro de conexão com a Hotmart:", erro.message);
    throw erro;
  }
}

/**
 * Verifica status da compra/assinatura de um usuário
 * @param {string} codigoCompra - Código da transação ou assinatura
 */
async function verificarAcessoUsuario(codigoCompra) {
  try {
    const token = await obterTokenAcesso();

    const resposta = await fetch(`${HOTMART_CONFIG.apiUrl}/sales/${codigoCompra}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      return {
        valido: false,
        mensagem: "❌ Compra ou assinatura não encontrada"
      };
    }

    // Status aceitos: APROVADO, COMPLETADO, ATIVO
    const statusValidos = ["APPROVED", "COMPLETED", "ACTIVE"];
    const estaAtivo = statusValidos.includes(dados.status);

    return {
      valido: estaAtivo,
      status: dados.status,
      mensagem: estaAtivo
        ? "✅ Acesso correspondente à sua compra liberado"
        : "❌ Acesso vencido ou não aprovado"
    };

  } catch (erro) {
    return {
      valido: false,
      mensagem: "❌ Não foi possível verificar sua assinatura. Tente novamente."
    };
  }
}

/**
 * Processa notificações recebidas pelo Webhook
 * @param {object} dadosRecebidos - Corpo da mensagem enviada pela Hotmart
 */
function processarNotificacao(dadosRecebidos, tokenRecebido) {
  // Valida segurança do token recebido
  if (tokenRecebido !== HOTMART_CONFIG.webhookToken) {
    return { sucesso: false, mensagem: "❌ Assinatura inválida" };
  }

  try {
    const evento = dadosRecebidos.event;
    const codigoCompra = dadosRecebidos.sale?.id || dadosRecebidos.subscription?.id;

    // Ações conforme o tipo de evento
    switch (evento) {
      case "SALE_APPROVED":
      case "SUBSCRIPTION_ACTIVE":
        console.log("✅ Pagamento confirmado — acesso liberado para:", codigoCompra);
        return { sucesso: true, mensagem: "✅ Confirmação de transação recebida e ativada" };

      case "SUBSCRIPTION_CANCELED":
      case "SALE_REFUNDED":
        console.log("ℹ️ Acesso revogado:", codigoCompra);
        return { sucesso: true, mensagem: "ℹ️ Status de acesso atualizado" };

      default:
        return { sucesso: true, mensagem: "ℹ️ Evento recebido sem alteração de acesso" };
    }

  } catch (erro) {
    return { sucesso: false, mensagem: "❌ Falha ao processar notificação" };
  }
}

// Exporta funções para uso no restante do aplicativo
export {
  configuracaoValida,
  obterTokenAcesso,
  verificarAcessoUsuario,
  processarNotificacao
};
