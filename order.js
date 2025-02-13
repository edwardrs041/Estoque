// Clase para representar un pedido
class Order {
  constructor(id, productId, quantity, supplierId, user) {
    this.id = id;
    this.productId = productId;
    this.quantity = quantity;
    this.supplierId = supplierId;
    this.user = user; // Nombre del usuario que realizó el pedido
  }
}

// Gerenciador de pedidos
const orderManager = {
  add(order) {
    state.orders.push(order);
    saveOrdersToStorage();
  },
  remove(id) {
    state.orders = state.orders.filter(order => order.id !== id);
    saveOrdersToStorage();
  },
  getById(id) {
    return state.orders.find(order => order.id === id);
  },
  update(id, updatedOrder) {
    const index = state.orders.findIndex(order => order.id === id);
    if (index !== -1) {
      state.orders[index] = { ...state.orders[index], ...updatedOrder };
      saveOrdersToStorage();
    }
  }
};

// Guardar pedidos en localStorage
function saveOrdersToStorage() {
  localStorage.setItem('orders', JSON.stringify(state.orders));
}

// Cargar pedidos desde localStorage
function loadOrdersFromStorage() {
  const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];
  state.orders = savedOrders;
}

// Enviar un pedido
function submitOrder() {
  const productSelect = document.getElementById('productSelect');
  const quantityInput = document.getElementById('quantity');

  if (!productSelect || !quantityInput) return;

  const productId = parseInt(productSelect.value);
  const quantity = parseInt(quantityInput.value);

  if (!productId || !quantity) {
    showNotification('Selecione um produto e insira a quantidade!', 'error');
    return;
  }

  const newOrder = new Order(
    state.orders.length + 1,
    productId,
    quantity,
    null,
    state.currentUser
  );
  
  orderManager.add(newOrder);
  // Agregar el gasto al dashboard
  addExpenseFromOrder(productId, quantity);
  
  showNotification('Pedido enviado com sucesso!', 'success');
}

  const newOrder = new Order(
    state.orders.length + 1, // ID único
    productId,
    quantity,
    null, // supplierId pode ser definido posteriormente
    state.currentUser // Usuário que realizou o pedido
  );
  
  orderManager.add(newOrder);
  showNotification('Pedido enviado com sucesso!', 'success');
}

// Mostrar la lista de pedidos
function showOrdersList() {
  const contentArea = document.getElementById('contentArea');
  if (!contentArea) return;

  const content = `
    <h2 class="text-xl font-bold mb-4">Lista de Pedidos</h2>
    <table class="w-full border-collapse">
      <thead>
        <tr>
          <th class="border p-2">ID</th>
          <th class="border p-2">Produto</th>
          <th class="border p-2">Quantidade</th>
          <th class="border p-2">Fornecedor</th>
          <th class="border p-2">Usuário</th>
        </tr>
      </thead>
      <tbody>
        ${state.orders.map(order => {
          const product = productManager?.getById(order.productId) || { name: 'Produto não encontrado' };
          const supplier = supplierManager?.getById(order.supplierId) || { name: 'Fornecedor não encontrado' };
          return `
            <tr>
              <td class="border p-2">${order.id}</td>
              <td class="border p-2">${product.name}</td>
              <td class="border p-2">${order.quantity}</td>
              <td class="border p-2">${supplier.name}</td>
              <td class="border p-2">${order.user}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
  contentArea.innerHTML = content;
}

// Mostrar pedidos de un usuario específico
function showUserOrders(username) {
  const contentArea = document.getElementById('contentArea');
  if (!contentArea) return;

  const userOrders = state.orders.filter(order => order.user === username);

  if (userOrders.length === 0) {
    showNotification(`Nenhum pedido encontrado para ${username}.`, 'info');
    return;
  }

  const content = `
    <h2 class="text-xl font-bold mb-4">Pedidos de ${username}</h2>
    <table class="w-full border-collapse">
      <thead>
        <tr>
          <th class="border p-2">ID</th>
          <th class="border p-2">Produto</th>
          <th class="border p-2">Quantidade</th>
          <th class="border p-2">Fornecedor</th>
        </tr>
      </thead>
      <tbody>
        ${userOrders.map(order => {
          const product = productManager?.getById(order.productId) || { name: 'Produto não encontrado' };
          const supplier = supplierManager?.getById(order.supplierId) || { name: 'Fornecedor não encontrado' };
          return `
            <tr>
              <td class="border p-2">${order.id}</td>
              <td class="border p-2">${product.name}</td>
              <td class="border p-2">${order.quantity}</td>
              <td class="border p-2">${supplier.name}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
  contentArea.innerHTML = content;
}

// Gerar PDF da lista de compras
function generatePurchaseListPDF(purchaseList) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Lista de Compras", 10, 10);

  const headers = [["Produto", "Fornecedor", "Preço"]];
  const data = purchaseList.map(item => [
    item.product,
    item.supplier,
    `R$ ${item.price.toFixed(2)}`
  ]);

  doc.autoTable({
    head: headers,
    body: data,
    startY: 20,
    theme: 'striped',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185] }
  });

  doc.save("lista_compras.pdf");
}

// Gerar a lista de compras
function generatePurchaseList() {
  const purchaseList = [
    { product: "Produto 1", supplier: "Fornecedor A", price: 50.00 },
    { product: "Produto 2", supplier: "Fornecedor B", price: 30.00 }
  ];
  generatePurchaseListPDF(purchaseList);
  showNotification('Lista de compras gerada com sucesso!', 'success');
}

// Carregar pedidos ao iniciar
window.onload = function () {
  loadOrdersFromStorage();
};
