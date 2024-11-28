// Función que comunica a las ventanas autenticadas el cierre de sesión
export const initializeChannel = () => {
  const channel = new BroadcastChannel("sesion_channel");

  channel.onmessage = (event) => {
    if (event.data === "logout") {
      localStorage.removeItem("token");
      window.location.reload(); // Recargar la página para reflejar el cierre de sesión
    }
  };

  return channel;
};