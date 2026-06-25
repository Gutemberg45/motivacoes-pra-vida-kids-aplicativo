export const useClerk = {
  async signIn(email, senha) {

    if (!email || !senha) {
      throw new Error("Preencha todos os campos");
    }

    localStorage.setItem("usuario", email);

    return true;
  },

  async signUp(dados) {
    localStorage.setItem("usuario", dados.emailAddress[0]);
    return {
      id: "usr_" + Date.now()
    };
  },

  async signOut() {
    localStorage.removeItem("usuario");
  }
};
