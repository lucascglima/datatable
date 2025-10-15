/**
 * Global Test Functions
 * These functions are available globally for testing button/icon clicks
 */

window.handleEdit = function(record, value) {
  console.log('Edit clicked:', { record, value });
  alert(`Editar registro:\nID: ${record.id}\nNome: ${record.name || record.title || 'N/A'}`);
};

window.handleDelete = function(record, value) {
  console.log('Delete clicked:', { record, value });
  if (confirm(`Tem certeza que deseja deletar o registro ID ${record.id}?`)) {
    alert('Registro deletado (simulação)');
  }
};

window.handleView = function(record, value) {
  console.log('View clicked:', { record, value });
  alert(`Visualizar registro:\n${JSON.stringify(record, null, 2)}`);
};

window.onCellClick = function(columnKey, record) {
  console.log('Cell clicked:', { columnKey, record });
  alert(`Célula clicada:\nColuna: ${columnKey}\nRegistro ID: ${record.id}`);
};

// Custom render example
window.customRenderFunction = function(text, record) {
  return `[Custom: ${text}]`;
};

console.log('✅ Test functions loaded successfully!');
console.log('Available functions:');
console.log('  - handleEdit(record, value)');
console.log('  - handleDelete(record, value)');
console.log('  - handleView(record, value)');
console.log('  - onCellClick(columnKey, record)');
console.log('  - customRenderFunction(text, record)');
