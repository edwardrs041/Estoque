// Clase para representar um produto
class Product {
  constructor(id, name, description, unit, minStock, currentStock) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.unit = unit;
    this.minStock = minStock;
    this.currentStock = currentStock;
  }
}

// Gerenciador de produtos
const productManager = {
  add(product) {
    state.products.push(product);
    saveProductsToStorage();
  },
  getById(id) {
    return state.products.find(product => product.id === id);
  },
  getAll() {
    return state.products;
  }
};

// Salvar produtos no localStorage
function saveProductsToStorage() {
  localStorage.setItem('products', JSON.stringify(state.products));
}

// Carregar produtos do localStorage
function loadProductsFromStorage() {
  const savedProducts = JSON.parse(localStorage.getItem('products')) || [];
  state.products = savedProducts;
}

// Exibir formulário para cadastro de produtos
function showProductForm() {
  const content = `
    <h2 class="text-xl font-bold mb-4">Cadastrar Produto</h2>
    <form onsubmit="saveProduct(event)">
      <input type="text" id="productName" placeholder="Nome do Produto" required class="w-full p-2 mb-2 border rounded">
      <input type="text" id="productDescription" placeholder="Descrição" class="w-full p-2 mb-2 border rounded">
      <input type="text" id="productUnit" placeholder="Unidade (kg, un, etc.)" required class="w-full p-2 mb-2 border rounded">
      <input type="number" id="productMinStock" placeholder="Estoque Mínimo" required class="w-full p-2 mb-2 border rounded">
      <input type="number" id="productCurrentStock" placeholder="Estoque Atual" required class="w-full p-2 mb-2 border rounded">
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

// Salvar um novo produto
function saveProduct(event) {
  event.preventDefault();
  
  const name = document.getElementById('productName')?.value.trim();
  const description = document.getElementById('productDescription')?.value.trim();
  const unit = document.getElementById('productUnit')?.value.trim();
  const minStock = parseInt(document.getElementById('productMinStock')?.value);
  const currentStock = parseInt(document.getElementById('productCurrentStock')?.value);

  if (!name || !unit || isNaN(minStock) || isNaN(currentStock)) {
    showNotification('Preencha todos os campos obrigatórios!', 'error');
    return;
  }

  const newProduct = new Product(
    state.products.length + 1,
    name,
    description,
    unit,
    minStock,
    currentStock
  );

  productManager.add(newProduct);
  closeModal();
  showNotification('Produto cadastrado com sucesso!', 'success');
  showProductList();
}

// Exibir lista de produtos
function showProductList() {
  const contentArea = document.getElementById('contentArea');
  if (!contentArea) return;

  const products = productManager.getAll();
  const content = `
    <h2 class="text-xl font-bold mb-4">Lista de Produtos</h2>
    <table class="w-full border-collapse">
      <thead>
        <tr>
          <th class="border p-2">Nome</th>
          <th class="border p-2">Descrição</th>
          <th class="border p-2">Unidade</th>
          <th class="border p-2">Estoque Mínimo</th>
          <th class="border p-2">Estoque Atual</th>
        </tr>
      </thead>
      <tbody>
        ${products.map(product => `
          <tr>
            <td class="border p-2">${product.name}</td>
            <td class="border p-2">${product.description || '-'}</td>
            <td class="border p-2">${product.unit}</td>
            <td class="border p-2">${product.minStock}</td>
            <td class="border p-2">${product.currentStock}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  contentArea.innerHTML = content;
}

// Carregar produtos ao iniciar
window.onload = function () {
  loadProductsFromStorage();
};
