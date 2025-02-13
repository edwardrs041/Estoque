// Mostrar opciones de relatórios
function showReportOptions() {
  const content = `
    <h2 class="text-xl font-bold mb-4">Gerar Relatórios</h2>
    <div class="space-y-2">
      <button onclick="generateReport('Diário')" class="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600">
        Relatório Diário
      </button>
      <button onclick="generateReport('Semanal')" class="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600">
        Relatório Semanal
      </button>
      <button onclick="generateReport('Mensal')" class="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600">
        Relatório Mensal
      </button>
      <button onclick="closeModal()" class="bg-gray-500 text-white px-4 py-2 rounded w-full hover:bg-gray-600">
        Voltar
      </button>
    </div>
  `;
  showModal(content);
}

// Gerar relatório baseado no período
function generateReport(period) {
  let filteredOrders = state.orders;

  if (period === 'Diário') {
    filteredOrders = state.orders.slice(-5); // Últimos 5 pedidos (simulação)
  } else if (period === 'Semanal') {
    filteredOrders = state.orders.slice(-10); // Últimos 10 pedidos
  } else if (period === 'Mensal') {
    filteredOrders = state.orders; // Todos os pedidos
  }

  if (filteredOrders.length === 0) {
    showNotification(`Nenhum dado disponível para o relatório ${period.toLowerCase()}.`, 'info');
    return;
  }

  // Criar dados estruturados para o PDF
  const reportData = filteredOrders.map(order => {
    const product = productManager?.getById(order.productId) || { name: 'Produto não encontrado' };
    const supplier = supplierManager?.getById(order.supplierId) || { name: 'Fornecedor não encontrado' };
    
    return {
      product: product.name,
      quantity: order.quantity,
      supplier: supplier.name,
      price: (order.quantity * 10).toFixed(2) // Simulação de preço unitário R$10
    };
  });

  generateReportPDF(reportData, period);
  showNotification(`Relatório ${period.toLowerCase()} gerado com sucesso!`, 'success');
}

// Gerar um PDF de relatório
function generateReportPDF(reportData, reportType) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text(`Relatório ${reportType}`, 10, 10);

  const headers = [["Produto", "Quantidade", "Fornecedor", "Preço"]];
  const data = reportData.map(item => [
    item.product,
    item.quantity,
    item.supplier,
    `R$ ${item.price}`
  ]);

  doc.autoTable({
    head: headers,
    body: data,
    startY: 20,
    theme: 'striped',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185] }
  });

  doc.save(`relatorio_${reportType.toLowerCase()}.pdf`);
}
