async function login(correo, contrasena) {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ correo, contrasena }),
    });
  console.log("respuesta", response)
    if (response.ok) {
      const data = await response.json(); // Aquí se espera una respuesta JSON
      localStorage.setItem('token', data.token);
    
    } else {
      const errorMessagesDiv = document.getElementById('error-messages');
      errorMessagesDiv.classList.remove('d-none');
      errorMessagesDiv.textContent = 'Error de inicio de sesión: correo electrónico o contraseña incorrectos.';
    }
  }
  
  async function getProtectedRouteData() {
    const token = localStorage.getItem('token');
  
    const response = await fetch('/ruta_protegida', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
  
    if (response.ok) {
      const data = await response.json();
      alert('Acceso a ruta protegida exitoso');
    } else {
      alert('Error al acceder a la ruta protegida');
    }
  }
  