// Classe para gerenciar o orçamento e despesas
class Budget {
  constructor(monthlyLimit) {
    this.monthlyLimit = monthlyLimit;
    this.expenses = [];
  }

  addExpense(expense) {
    this.expenses.push(expense);
    this.saveToStorage();
  }

  getMonthlyTotal() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    return this.expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && 
               expenseDate.getFullYear() === currentYear;
      })
      .reduce((total, expense) => total + expense.amount, 0);
  }

  getRemainingBudget() {
    return this.monthlyLimit - this.getMonthlyTotal();
  }

  saveToStorage() {
    localStorage.setItem('budgetLimit', this.monthlyLimit);
    localStorage.setItem('expenses', JSON.stringify(this.expenses));
  }

  loadFromStorage() {
    this.monthlyLimit = parseFloat(localStorage.getItem('budgetLimit')) || 0;
    this.expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  }
}

// Inicializar o orçamento global
const budgetManager = new Budget(0);

// Mostrar o dashboard
function showDashboard() {
  budgetManager.loadFromStorage();
  const monthlyTotal = budgetManager.getMonthlyTotal();
  const remainingBudget = budgetManager.getRemainingBudget();
  const percentageUsed = (monthlyTotal / budgetManager.monthlyLimit) * 100 || 0;

  const content = `
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-6">Painel Financeiro</h2>
      
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-2">Limite Mensal</h3>
        <div class="flex items-center gap-4">
          <input 
            type="number" 
            id="monthlyLimit" 
            value="${budgetManager.monthlyLimit}"
            class="border rounded p-2 w-48"
            placeholder="Digite o limite mensal"
          >
          <button 
            onclick="updateMonthlyLimit()"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Atualizar Limite
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-blue-100 p-4 rounded-lg">
          <h4 class="font-semibold mb-2">Gasto Mensal</h4>
          <p class="text-2xl font-bold">R$ ${monthlyTotal.toFixed(2)}</p>
        </div>
        
        <div class="bg-green-100 p-4 rounded-lg">
          <h4 class="font-semibold mb-2">Orçamento Restante</h4>
          <p class="text-2xl font-bold">R$ ${remainingBudget.toFixed(2)}</p>
        </div>

        <div class="bg-yellow-100 p-4 rounded-lg">
          <h4 class="font-semibold mb-2">Porcentagem Utilizada</h4>
          <p class="text-2xl font-bold">${percentageUsed.toFixed(1)}%</p>
        </div>
      </div>

      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-4">Histórico de Gastos</h3>
        <table class="w-full border-collapse">
          <thead>
            <tr>
              <th class="border p-2">Data</th>
              <th class="border p-2">Descrição</th>
              <th class="border p-2">Valor</th>
            </tr>
          </thead>
          <tbody>
            ${budgetManager.expenses.map(expense => `
              <tr>
                <td class="border p-2">${new Date(expense.date).toLocaleDateString()}</td>
                <td class="border p-2">${expense.description}</td>
                <td class="border p-2">R$ ${expense.amount.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('contentArea').innerHTML = content;
}

// Atualizar o limite mensal
function updateMonthlyLimit() {
  const limitInput = document.getElementById('monthlyLimit');
  const newLimit = parseFloat(limitInput.value);
  
  if (isNaN(newLimit) || newLimit < 0) {
    showNotification('Por favor, insira um valor válido', 'error');
    return;
  }

  budgetManager.monthlyLimit = newLimit;
  budgetManager.saveToStorage();
  showNotification('Limite mensal atualizado com sucesso!', 'success');
  showDashboard();
}

// Adicionar despesa ao fazer um pedido
function addExpenseFromOrder(productId, quantity) {
  const product = productManager.getById(productId);
  if (!product) return;

  // Simulando um preço fixo de R$10 por unidade
  const amount = quantity * 10;
  
  const expense = {
    date: new Date().toISOString(),
    description: `Pedido: ${quantity}x ${product.name}`,
    amount: amount
  };

  budgetManager.addExpense(expense);

  // Verificar se ultrapassou o limite
  if (budgetManager.getMonthlyTotal() > budgetManager.monthlyLimit && budgetManager.monthlyLimit > 0) {
    showNotification('Atenção: Limite mensal de gastos ultrapassado!', 'warning');
  }
}
