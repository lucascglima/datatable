# Guia de Testes End-to-End

Este documento descreve todos os fluxos de testes para o sistema de múltiplas tabelas.

## 🎯 Objetivo

Validar que todos os fluxos de trabalho do sistema funcionam corretamente após a migração para o sistema de múltiplas tabelas.

---

## ✅ Checklist de Testes

### 1. Inicialização e Migração

- [ ] Primeira visita à aplicação redireciona para `/tables`
- [ ] Página inicial mostra mensagem de boas-vindas se não houver tabelas
- [ ] Se existir configuração antiga, ela é migrada automaticamente
- [ ] Configuração migrada aparece como "Minha Tabela (Migrada)"
- [ ] Dados da configuração antiga são preservados corretamente

### 2. Criação de Tabela do Zero

#### 2.1 Modal de Criação
- [ ] Clicar em "Nova Tabela" abre modal
- [ ] Campo "Nome da Tabela" é obrigatório
- [ ] Validação impede nomes com menos de 3 caracteres
- [ ] Validação impede nomes duplicados
- [ ] Campo "Descrição" é opcional
- [ ] Opção "Do zero" está visível e selecionável

#### 2.2 Fluxo Completo
1. [ ] Clicar em "Nova Tabela"
2. [ ] Preencher nome: "Minha Primeira Tabela"
3. [ ] Preencher descrição: "Tabela de teste criada do zero"
4. [ ] Selecionar "Do zero"
5. [ ] Clicar em "Criar Tabela"
6. [ ] Verificar redirecionamento para `/config/{tableId}/general`
7. [ ] Verificar que página de configuração geral está aberta
8. [ ] Verificar que nome da tabela aparece no título

### 3. Criação de Tabela a partir de Exemplo

#### 3.1 Via Modal de Criação
1. [ ] Clicar em "Nova Tabela"
2. [ ] Preencher nome: "Tabela de Usuários"
3. [ ] Selecionar "A partir de um exemplo"
4. [ ] Clicar em "Criar Tabela"
5. [ ] Verificar redirecionamento para `/examples?targetTableId={tableId}`
6. [ ] Verificar que página de exemplos está aberta

#### 3.2 Via Galeria de Exemplos
1. [ ] Navegar para "Exemplos" no menu
2. [ ] Verificar que 4 exemplos são exibidos:
   - [ ] Tabela de Usuários (JSONPlaceholder)
   - [ ] Tabela de Posts (JSONPlaceholder)
   - [ ] Tabela de Comentários (JSONPlaceholder)
   - [ ] Tabela de Fotos (JSONPlaceholder)
3. [ ] Clicar em "Usar Este Exemplo" em um card
4. [ ] Modal pergunta se quer criar nova tabela
5. [ ] Preencher nome e descrição
6. [ ] Clicar em "Criar Tabela"
7. [ ] Verificar que configuração foi carregada
8. [ ] Verificar redirecionamento para `/table/{tableId}`

### 4. Visualização de Tabela

#### 4.1 Tabela sem Dados
- [ ] Se API não está configurada, mostra mensagem amigável
- [ ] Botão "Configurar Tabela" está visível
- [ ] Clicar em "Configurar Tabela" vai para configuração geral

#### 4.2 Tabela com Dados
1. [ ] Criar tabela com exemplo de usuários
2. [ ] Navegar para visualização da tabela
3. [ ] Verificar que dados são carregados da API
4. [ ] Verificar que colunas são exibidas corretamente
5. [ ] Verificar que paginação funciona
6. [ ] Testar click em linha (deve executar onRowClick se configurado)
7. [ ] Testar click em botões (deve executar onButtonClick se configurado)
8. [ ] Testar click em ícones (deve executar onIconClick se configurado)

### 5. Configuração Geral (API)

#### 5.1 Acesso à Configuração
1. [ ] Navegar para `/config/{tableId}/general`
2. [ ] Verificar que dados existentes são carregados
3. [ ] Verificar que nome da tabela aparece no breadcrumb

#### 5.2 Configuração de API
1. [ ] Preencher "Endereço da API": `https://jsonplaceholder.typicode.com`
2. [ ] Deixar token em branco (opcional)
3. [ ] Preencher "Endpoint da Tabela": `/users`
4. [ ] Selecionar "Método HTTP": GET
5. [ ] Ativar paginação (toggle)
6. [ ] Configurar parâmetros de paginação:
   - [ ] Parâmetro de página: `_page`
   - [ ] Parâmetro de itens por página: `_limit`
   - [ ] Itens por página: 10
7. [ ] Clicar em "Salvar Configuração"
8. [ ] Verificar mensagem de sucesso
9. [ ] Navegar de volta para visualização
10. [ ] Verificar que dados são carregados

### 6. Configuração de Colunas

#### 6.1 Acesso
1. [ ] Navegar para `/config/{tableId}/columns`
2. [ ] Verificar que colunas existentes são carregadas

#### 6.2 Adição de Coluna Manual
1. [ ] Clicar em "Adicionar Coluna"
2. [ ] Preencher:
   - [ ] Título: "ID"
   - [ ] DataIndex: "id"
   - [ ] Key: "id"
3. [ ] Clicar em "Adicionar"
4. [ ] Verificar que coluna aparece na lista

#### 6.3 Edição de Coluna
1. [ ] Clicar em "Editar" em uma coluna
2. [ ] Modificar título
3. [ ] Adicionar render customizado (opcional)
4. [ ] Salvar alterações
5. [ ] Verificar que mudanças foram aplicadas

#### 6.4 Remoção de Coluna
1. [ ] Clicar em "Remover" em uma coluna
2. [ ] Confirmar remoção
3. [ ] Verificar que coluna foi removida

#### 6.5 Upload de JSON
1. [ ] Preparar arquivo JSON com colunas
2. [ ] Clicar em "Importar JSON"
3. [ ] Selecionar arquivo
4. [ ] Verificar que colunas foram importadas
5. [ ] Salvar configuração

### 7. Configuração de Mapeamento

#### 7.1 Acesso
1. [ ] Navegar para `/config/{tableId}/mapping`
2. [ ] Verificar que mapeamentos existentes são carregados

#### 7.2 Configuração de Paths
1. [ ] Preencher "Caminho dos Dados": `data` ou deixar vazio
2. [ ] Preencher "Página Atual": `currentPage`
3. [ ] Preencher "Total de Páginas": `totalPages`
4. [ ] Preencher "Total de Itens": `totalItems`
5. [ ] Clicar em "Salvar Mapeamento"
6. [ ] Verificar mensagem de sucesso

### 8. Configuração de Eventos

#### 8.1 Acesso
1. [ ] Navegar para `/config/{tableId}/events`
2. [ ] Verificar que eventos existentes são carregados

#### 8.2 Configuração de onRowClick
1. [ ] Selecionar aba "Click na Linha"
2. [ ] Escrever código no editor:
```javascript
console.log('Linha clicada:', record);
alert('ID: ' + record.id + '\nNome: ' + record.name);
```
3. [ ] Clicar em "Testar no Console"
4. [ ] Verificar que teste foi executado no console
5. [ ] Verificar se há erros de validação

#### 8.3 Configuração de onButtonClick
1. [ ] Selecionar aba "Click em Botão"
2. [ ] Escrever código no editor:
```javascript
if (confirm('Deseja editar este registro?')) {
  console.log('Editando:', record);
  window.location.href = '/edit/' + record.id;
}
```
3. [ ] Clicar em "Testar no Console"
4. [ ] Verificar que teste foi executado

#### 8.4 Configuração de onIconClick
1. [ ] Selecionar aba "Click em Ícone"
2. [ ] Escrever código no editor:
```javascript
console.log('Ícone clicado:', record);
window.dispatchEvent(new CustomEvent('openDetails', {
  detail: record
}));
```
3. [ ] Clicar em "Testar no Console"
4. [ ] Verificar que teste foi executado

#### 8.5 Salvar Eventos
1. [ ] Clicar em "Salvar Eventos"
2. [ ] Verificar mensagem de sucesso
3. [ ] Navegar para visualização da tabela
4. [ ] Testar eventos na tabela real

### 9. Navegação Entre Tabelas

#### 9.1 Menu Dinâmico
1. [ ] Criar pelo menos 3 tabelas diferentes
2. [ ] Verificar que menu "Minhas Tabelas" mostra todas
3. [ ] Clicar em cada tabela no menu
4. [ ] Verificar que visualização é carregada corretamente

#### 9.2 Lista de Tabelas
1. [ ] Navegar para `/tables`
2. [ ] Verificar que todas as tabelas são listadas
3. [ ] Verificar informações de cada card:
   - [ ] Nome e descrição
   - [ ] Data de criação
   - [ ] Data de última atualização
   - [ ] Preview de configuração (colunas, endpoints, eventos)
   - [ ] Status (pronta, parcial, pendente)
4. [ ] Usar busca para filtrar tabelas
5. [ ] Usar ordenação (por nome, criação, atualização)

### 10. Edição de Tabela

#### 10.1 Editar Nome/Descrição
1. [ ] Na lista de tabelas, clicar em "Editar" em uma tabela
2. [ ] Modal abre com dados atuais
3. [ ] Modificar nome
4. [ ] Modificar descrição
5. [ ] Clicar em "Salvar Alterações"
6. [ ] Verificar que mudanças foram aplicadas
7. [ ] Verificar que validação impede nomes duplicados

### 11. Duplicação de Tabela

#### 11.1 Duplicar Tabela
1. [ ] Na lista de tabelas, clicar em "Duplicar" em uma tabela
2. [ ] Nova tabela é criada com sufixo "(Cópia)"
3. [ ] Verificar que configuração foi copiada completamente
4. [ ] Verificar que IDs são diferentes
5. [ ] Verificar que timestamp de criação é novo

### 12. Exclusão de Tabela

#### 12.1 Excluir Tabela
1. [ ] Na lista de tabelas, clicar em "Excluir" em uma tabela
2. [ ] Modal de confirmação aparece
3. [ ] Confirmar exclusão
4. [ ] Verificar que tabela foi removida
5. [ ] Verificar que menu foi atualizado
6. [ ] Se tabela excluída era ativa, verificar que activeTableId foi limpo

### 13. Tabela Ativa

#### 13.1 Conceito de Tabela Ativa
1. [ ] Criar múltiplas tabelas
2. [ ] Clicar em "Ver" em uma tabela
3. [ ] Verificar que menu "Configurar Tabela Atual" aparece
4. [ ] Verificar que submenu mostra opções de configuração
5. [ ] Navegar para outra tabela
6. [ ] Verificar que menu é atualizado para nova tabela ativa

### 14. Breadcrumb Dinâmico

#### 14.1 Navegação com Breadcrumb
1. [ ] Navegar para `/tables`
2. [ ] Breadcrumb: "Início"
3. [ ] Clicar em uma tabela
4. [ ] Breadcrumb: "Início > Minhas Tabelas > [Nome da Tabela]"
5. [ ] Ir para configuração geral
6. [ ] Breadcrumb: "Início > Configuração > [Nome da Tabela] > Geral"
7. [ ] Clicar em "Início" no breadcrumb
8. [ ] Verificar que voltou para lista de tabelas

### 15. Persistência de Dados

#### 15.1 LocalStorage
1. [ ] Criar várias tabelas e configurá-las
2. [ ] Fechar navegador
3. [ ] Reabrir aplicação
4. [ ] Verificar que todas as tabelas foram preservadas
5. [ ] Verificar que configurações foram mantidas
6. [ ] Verificar que tabela ativa foi preservada

### 16. Validações e Tratamento de Erros

#### 16.1 Validação de Nome
- [ ] Tentar criar tabela sem nome
- [ ] Tentar criar tabela com nome curto (< 3 caracteres)
- [ ] Tentar criar tabela com nome duplicado
- [ ] Verificar que mensagens de erro são amigáveis

#### 16.2 Validação de API
- [ ] Configurar URL inválida
- [ ] Tentar carregar dados
- [ ] Verificar que erro é exibido de forma amigável
- [ ] Verificar sugestões de correção

#### 16.3 Validação de Eventos
- [ ] Escrever código JavaScript inválido no editor
- [ ] Verificar que erro de sintaxe é detectado
- [ ] Verificar que mensagem é clara

#### 16.4 Tabela Não Encontrada
- [ ] Acessar URL com tableId inválido: `/table/invalid-id`
- [ ] Verificar que mensagem de erro é exibida
- [ ] Verificar que botão "Ver Minhas Tabelas" está disponível

---

## 🧪 Usando test-functions.js

Para testar eventos customizados:

1. Abra o console do navegador (F12)
2. Cole o conteúdo de `test-functions.js` no console
3. Use as funções disponíveis:

```javascript
// Mostrar ajuda
testHelp()

// Testar click em linha
testRowClick()

// Testar click em botão
testButtonClick()

// Testar click em ícone
testIconClick()

// Testar todos os eventos
testAllEvents()

// Testar código customizado
testCustomEvent('console.log(record)', 'rowClick')

// Limpar console
clearTests()
```

---

## 🐛 Checklist de Bugs Conhecidos

- [ ] Permissão do Vite (não bloqueia build)
- [ ] Erro de leitura antes de editar (corrigido)
- [ ] Falta de uuid (corrigido)

---

## 📊 Relatório de Testes

Após executar todos os testes, preencha:

### Resumo
- Total de testes: ___
- Testes passados: ___
- Testes falhos: ___
- Bugs encontrados: ___

### Observações


### Próximos Passos

