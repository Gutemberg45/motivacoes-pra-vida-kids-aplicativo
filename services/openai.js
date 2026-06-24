const OPENAI_API_KEY = import.meta.env.OPENAI_API_KEY;

export async function gerarHistoria(dados) {
  const { nome, idade, tema } = dados;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Você é um contador de histórias para crianças. Crie histórias curtas, alegres, seguras, com linguagem simples e uma lição positiva no final."
        },
        {
          role: "user",
          content: `Crie uma história onde o protagonista é ${nome}, tem ${idade} anos e o tema principal é: ${tema}.`
        }
      ],
      temperature: 0.8,
      max_tokens: 900
    })
  });

  if (!response.ok) throw new Error("Erro na API OpenAI");
  return response.json();
}

export async function gerarImagem(descricao) {
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prompt: `${descricao}, ilustração infantil vibrante, estilo 3D fofo, cores alegres, traços suaves, ambiente mágico e seguro para crianças`,
      n: 1,
      size: "1024x1024"
    })
  });

  if (!response.ok) throw new Error("Erro na API OpenAI");
  return response.json();
}
