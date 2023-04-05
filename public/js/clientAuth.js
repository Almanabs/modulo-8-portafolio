async function login(correo, contrasena) {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ correo, contrasena }),
    };
  
    return fetch('/login', requestOptions)
      .then(response => response.json())
      .then((data) => {
        if (data.code === 200) {
          if (data.token) {
            localStorage.setItem('user', JSON.stringify(data.token));
            // Muestra un mensaje emergente de inicio de sesión exitoso
          alert(data.message);
            // Redireccionar a la página deseada después de iniciar sesión exitosamente
            window.location.href = '/';
          }
        } else {
          // Arroja un mensaje data.message
          alert(data.message);
        }      
      })
      .catch((error) => {
        console.error('Error en la solicitud de inicio de sesión:', error);
        throw error;
      });
  }
  
  
  async function getProtectedRouteData() {
    if (response.ok) {
      alert('Acceso a ruta protegida exitoso');
    } else {
      alert('Error al acceder a la ruta protegida');
    }
  }
  
  async function logout() {
    const response = await fetch('/logout');
  
    if (response.ok) {
      const data = await response.json();
      alert(data.message); // Muestra un mensaje emergente con el mensaje de cierre de sesión exitoso
    } else {
      alert('Error al cerrar sesión'); // Muestra un mensaje emergente con el mensaje de error
    }
  }
  