// Classe para representar um fornecedor
class Supplier {
  constructor(id, name, phone, address) {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.address = address;
  }
}

// Gerenciador de fornecedores
const supplierManager = {
  add(supplier) {
    state.suppliers.push(supplier);
    saveSuppliersToStorage();
  },
  getById(id) {
    return state.suppliers.find(supplier => supplier.id === id);
  },
  getAll() {
    return state.suppliers;
  }
};

// Salvar fornecedores no localStorage
function saveSuppliersToStorage() {
  localStorage.setItem('suppliers', JSON.stringify(state.suppliers));
}

// Carregar fornecedores do localStorage
function loadSuppliersFromStorage() {
  const savedSuppliers = JSON.parse(localStorage.getItem('suppliers')) || [];
  state.suppliers = savedSuppliers;
}

// Exibir formulário para cadastro de fornecedores
function showSupplierForm() {
  const content = `
    <h2 class="text-xl font-bold mb-4">Cadastrar Fornecedor</h2>
    <form onsubmit="saveSupplier(event)">
      <input type="text" id="supplierName" placeholder="Nome do Fornecedor" required class="w-full p-2 mb-2 border rounded">
      <input type="text" id="supplierPhone" placeholder="Telefone" required class="w-full p-2 mb-2 border rounded">
      <input type="text" id="supplierAddress" placeholder="Endereço" required class="w-full p-2 mb-2 border rounded">
      <div class="flex justify-between">
        <button type="button" onclick="closeModal()" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          Voltar
        </button>
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Salvar
        </button>
      </div>
    </form>
  `;
  showModal(content);
}

// Salvar um novo fornecedor
function saveSupplier(event) {
  event.preventDefault();
  
  const name = document.getElementById('supplierName')?.value.trim();
  const phone = document.getElementById('supplierPhone')?.value.trim();
  const address = document.getElementById('supplierAddress')?.value.trim();

  if (!name || !phone || !address) {
    showNotification('Preencha todos os campos obrigatórios!', 'error');
    return;
  }

  const newSupplier = new Supplier(
    state.suppliers.length + 1,
    name,
    phone,
    address
  );

  supplierManager.add(newSupplier);
  closeModal();
  showNotification('Fornecedor cadastrado com sucesso!', 'success');
  showSupplierList();
}

// Exibir lista de fornecedores
function showSupplierList() {
  const contentArea = document.getElementById('contentArea');
  if (!contentArea) return;

  const suppliers = supplierManager.getAll();
  const content = `
    <h2 class="text-xl font-bold mb-4">Lista de Fornecedores</h2>
    <table class="w-full border-collapse">
      <thead>
        <tr>
          <th class="border p-2">Nome</th>
          <th class="border p-2">Telefone</th>
          <th class="border p-2">Endereço</th>
        </tr>
      </thead>
      <tbody>
        ${suppliers.map(supplier => `
          <tr>
            <td class="border p-2">${supplier.name}</td>
            <td class="border p-2">${supplier.phone}</td>
            <td class="border p-2">${supplier.address}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  contentArea.innerHTML = content;
}

// Carregar fornecedores ao iniciar
window.onload = function () {
  loadSuppliersFromStorage();
};
