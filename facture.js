// DOM Elements
const clientInput = document.getElementById('client');
const descriptionInput = document.getElementById('description');
const montantInput = document.getElementById('montant');
const statutSelect = document.getElementById('statut');
const ajouterBtn = document.getElementById('ajouter');
const tbody = document.querySelector('#tableau-factures tbody');
const totalPayeSpan = document.getElementById('total-paye');
const countAttente = document.getElementById('count-attente');
const countPaye = document.getElementById('count-paye');

// Data
let factures = JSON.parse(localStorage.getItem('factures')) || [];
let idCounter = parseInt(localStorage.getItem('idCounter')) || 1;

// Sauvegarder les données
const saveData = () => {
    localStorage.setItem('factures', JSON.stringify(factures));
    localStorage.setItem('idCounter', idCounter.toString());
};

// Ajouter facture avec animation
ajouterBtn.addEventListener('click', () => {
  const client = clientInput.value.trim();
  const description = descriptionInput.value.trim();
  const montant = parseFloat(montantInput.value);
  const statut = statutSelect.value;

  if (!client || !description || isNaN(montant) || montant <= 0) {
    alert("Veuillez remplir tous les champs correctement.");
    return;
  }

  const facture = { id: idCounter++, client, description, montant, statut };
  factures.push(facture);
  saveData();
  render();
  resetForm();
  showNotification('Facture ajoutée avec succès!');
});

// Affichage
function render() {
  tbody.innerHTML = '';
  factures.forEach((f, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>#${f.id}</td>
      <td>${escapeHtml(f.client)}</td>
      <td>${escapeHtml(f.description)}</td>
      <td><strong>${f.montant.toFixed(2)} €</strong></td>
      <td><span class="statut ${f.statut.replace(' ', '-')}">${f.statut}</span></td>
      <td><button class="btn-supprimer" onclick="supprimer(${i})"><i class="fas fa-trash"></i></button></td>
    `;
    tbody.appendChild(tr);
  });

  // Stats
  const payees = factures.filter(f => f.statut === 'Payée');
  const attente = factures.filter(f => f.statut === 'En attente');
  countPaye.textContent = payees.length;
  countAttente.textContent = attente.length;

  // Total
  const total = payees.reduce((sum, f) => sum + f.montant, 0);
  totalPayeSpan.textContent = total.toFixed(2);
}

// Supprimer avec confirmation
window.supprimer = (index) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
    const row = tbody.children[index];
    row.style.animation = 'fadeOut 0.3s ease-out forwards';
    setTimeout(() => {
      factures.splice(index, 1);
      saveData();
      render();
      showNotification('Facture supprimée avec succès!', 'warning');
    }, 300);
  }
};

// Système de notifications
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
    ${message}
  `;
  document.body.appendChild(notification);
  
  // Animation d'entrée
  setTimeout(() => notification.classList.add('show'), 10);
  
  // Auto-suppression
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Reset form
function resetForm() {
  clientInput.value = '';
  descriptionInput.value = '';
  montantInput.value = '';
  statutSelect.value = 'En attente';
  clientInput.focus();
}

// Sécurité HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Init
render();