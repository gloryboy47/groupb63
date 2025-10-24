// Auto-génère un token CSRF (en prod, généré côté serveur)
document.querySelector('[name="csrf_token"]').value = 
  btoa(Math.random()).substring(0, 32);

// Toggle mot de passe
document.querySelectorAll('.toggle-password').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = btn.closest('.input-wrapper').querySelector('input');
    const isPassword = input.type === 'password';
    
    input.type = isPassword ? 'text' : 'password';
    btn.classList.toggle('show', isPassword);
  });
});

// Validation en temps réel
document.getElementById('email').addEventListener('input', validateEmail);
document.getElementById('password').addEventListener('input', validatePassword);

function validateEmail() {
  const email = document.getElementById('email');
  const error = document.getElementById('emailError');
  const value = email.value.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!value) {
    showError(email, error, 'L\'email est requis.');
    return false;
  } else if (!regex.test(value)) {
    showError(email, error, 'Veuillez entrer un email valide.');
    return false;
  } else {
    showSuccess(email, error);
    return true;
  }
}

function validatePassword() {
  const password = document.getElementById('password');
  const error = document.getElementById('passwordError');
  const value = password.value;

  if (!value) {
    showError(password, error, 'Le mot de passe est requis.');
    return false;
  } else if (value.length < 6) {
    showError(password, error, 'Minimum 6 caractères.');
    return false;
  } else {
    showSuccess(password, error);
    return true;
  }
}

function showError(input, errorEl, message) {
  input.classList.remove('success');
  input.classList.add('error');
  errorEl.textContent = message;
  errorEl.classList.add('show');
}

function showSuccess(input, errorEl) {
  input.classList.remove('error');
  input.classList.add('success');
  errorEl.classList.remove('show');
  errorEl.textContent = '';
}

// Soumission du formulaire
document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();

  if (!isEmailValid || !isPasswordValid) return;

  const submitBtn = document.getElementById('submitBtn');
  submitBtn.classList.add('btn-loading');
  submitBtn.disabled = true;

  // Simulation API
  await new Promise(resolve => setTimeout(resolve, 1800));

  // Succès
  submitBtn.classList.remove('btn-loading');
  submitBtn.disabled = false;

  // Animation de succès
  const container = document.querySelector('.login-container');
  container.style.transform = 'scale(0.95)';
  setTimeout(() => {
    container.style.transform = '';
    showSuccessMessage();
  }, 200);
});

function showSuccessMessage() {
  const success = document.createElement('div');
  success.innerHTML = `
    <div style="position:fixed;top:20px;right:20px;background:#10b981;color:white;padding:1rem 1.5rem;border-radius:12px;box-shadow:0 10px 25px rgba(0,0,0,0.2);z-index:1000;animation:slideIn 0.4s ease;">
      Connexion réussie ! Redirection...
    </div>
  `;
  document.body.appendChild(success);

  setTimeout(() => {
    success.remove();
    // window.location.href = '/dashboard';
  }, 2000);
}

// Accessibilité : focus sur premier champ
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('email').focus();
});