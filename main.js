// Configuração inicial de usuários
const USERS = {
  admin: { password: 'admin123', type: 'admin', name: 'Ronaldo' },
  user1: { password: 'user123', type: 'user', name: 'Usuário 1' },
  user2: { password: 'user123', type: 'user', name: 'Usuário 2' },
  user3: { password: 'user123', type: 'user', name: 'Usuário 3' },
  user4: { password: 'user123', type: 'user', name: 'Usuário 4' }
};

// Estado global do sistema
const state = {
  currentUser: localStorage.getItem('currentUser') || null,
  isAdmin: localStorage.getItem('isAdmin') === 'true',
  products: [
    { id: 1, name: 'Produto 1', description: 'Descrição do Produto 1', unit: 'un', minStock: 10, currentStock: 15 },
    { id: 2, name: 'Produto 2', description: 'Descrição do Produto 2', unit: 'kg', minStock: 20, currentStock: 25 }
  ],
  suppliers: [
    { id: 1, name: 'Fornecedor 1', phone: '(11) 1111-1111', address: 'Endereço 1' },
    { id: 2, name: 'Fornecedor 2', phone: '(22) 2222-2222', address: 'Endereço 2' }
  ],
  orders: [
    { id: 1, productId: 1, quantity: 10, supplierId: 1, user: 'user1' },
    { id: 2, productId: 2, quantity: 5, supplierId: 2, user: 'user2' },
    { id: 3, productId: 1, quantity: 8, supplierId: 1, user: 'user3' },
    { id: 4, productId: 2, quantity: 3, supplierId: 2, user: 'user4' }
  ]
};

// Autenticação de usuário
function handleLogin(event) {
  event.preventDefault();
  
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const user = USERS[username];

  if (user && user.password === password) {
    state.currentUser = username;
    state.isAdmin = user.type === 'admin';
    
    // Persistência no localStorage
    localStorage.setItem('currentUser', username);
    localStorage.setItem('isAdmin', state.isAdmin);
    
    document.getElementById('userName').textContent = user.name;
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    document.getElementById('adminPanel').classList.toggle('hidden', !state.isAdmin);
    document.getElementById('userPanel').classList.toggle('hidden', state.isAdmin);
    
    showNotification('Login realizado com sucesso!', 'success');
    
    if (!state.isAdmin) {
      updateProductSelect();
    }
  } else {
    showNotification('Usuário ou senha inválidos!', 'error');
  }
}

// Logout e limpeza de sessão
function logout() {
  state.currentUser = null;
  state.isAdmin = false;

  // Remover persistência
  localStorage.removeItem('currentUser');
  localStorage.removeItem('isAdmin');

  document.getElementById('loginForm').classList.remove('hidden');
  document.getElementById('mainApp').classList.add('hidden');
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';

  showNotification('Logout realizado com sucesso!', 'success');
}

// Sistema de notificações otimizado
function showNotification(message, type = 'info') {
  const notifications = document.getElementById('notifications');
  if (!notifications) return;

  const notification = document.createElement('div');
  notification.className = `notification p-4 rounded shadow-lg text-white mb-2 transition-opacity duration-300 ease-in-out
    ${type === 'success' ? 'bg-green-500' : ''}
    ${type === 'error' ? 'bg-red-500' : ''}
    ${type === 'warning' ? 'bg-yellow-500' : ''}
    ${type === 'info' ? 'bg-blue-500' : ''}`;
  
  notification.textContent = message;
  notification.setAttribute('role', 'alert');

  notifications.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Controle de modais
function showModal(content) {
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modalContent');
  
  if (!modal || !modalContent) return;

  modalContent.innerHTML = content;
  modal.classList.remove('hidden');
}

function closeModal() {
  const modal = document.getElementById('modal');
  if (!modal) return;

  modal.classList.add('hidden');

  if (state.isAdmin) {
    document.getElementById('adminPanel').classList.remove('hidden');
  } else {
    document.getElementById('userPanel').classList.remove('hidden');
  }
}

// Persistir sessão ao recarregar a página
window.onload = function () {
  if (state.currentUser) {
    document.getElementById('userName').textContent = USERS[state.currentUser]?.name || 'Usuário';
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    document.getElementById('adminPanel').classList.toggle('hidden', !state.isAdmin);
    document.getElementById('userPanel').classList.toggle('hidden', state.isAdmin);
  }
};
