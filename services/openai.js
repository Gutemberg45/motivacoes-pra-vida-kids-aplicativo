// Funções de geração de histórias e imagens
const OPENAI_API_KEY = import.meta.env.OPENAI_API_KEY;

export async function gerarHistoria(dados) {
  const { nome, idade, tema, estilo = "motivador, educativo, linguagem simples para crianças" } = dados;

  const resposta = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {role:"system", content:"Você cria histórias curtas, alegres, seguras e motivadoras para crianças."},
        {role:"user", content:`Crie uma história onde o protagonista é ${nome}, ${idade} anos, tema: ${tema}. Estilo: ${estilo}.`}
      ],
      temperature: 0.7
    })
  });

  return resposta.json();
}

export async function gerarImagem(descricao) {
  const resposta = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prompt: `${descricao}, estilo ilustração 3D colorida, animação infantil, sem conteúdo inadequado`,
      n: 1,
      size: "1024x1024"
    })
  });

  return resposta.json();
}

