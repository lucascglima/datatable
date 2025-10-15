# Guia do Novo Sistema de Parâmetros da API

## 📋 Visão Geral

O sistema de configuração da API foi completamente reestruturado para ser mais intuitivo, flexível e fácil de usar. Agora você pode configurar:

- **URL Base**: Apenas o domínio principal da API
- **Path**: Caminho específico do recurso
- **Path Params**: Variáveis que substituem valores no path
- **Query Params**: Parâmetros de consulta dinâmicos

---

## 🎯 Novo Formato de Configuração

### Antes (Formato Antigo)
```javascript
api: {
  baseURL: 'https://jsonplaceholder.typicode.com/users',
  token: '',
  headers: [],
  body: []
}
```

### Agora (Novo Formato)
```javascript
api: {
  baseURL: 'https://jsonplaceholder.typicode.com',
  path: '/users',
  pathParams: [],
  queryParams: [],
  token: '',
  headers: []
}
```

---

## 🚀 Recursos Principais

### 1. Separação de URL e Path

**Benefício**: Maior clareza e organização

```javascript
baseURL: 'https://api.example.com'
path: '/users'
// Resultado: https://api.example.com/users
```

### 2. Path Params (Variáveis no Caminho)

Use `{variavel}` no path e configure os valores:

```javascript
path: '/users/{userId}/posts/{postId}'
pathParams: [
  { name: 'userId', value: '123', enabled: true },
  { name: 'postId', value: '456', enabled: true }
]
// Resultado: https://api.example.com/users/123/posts/456
```

### 3. Query Params Dinâmicos

Configure parâmetros que se atualizam automaticamente:

```javascript
queryParams: [
  {
    name: 'page',
    value: '1',
    reference: 'PAGE_CHANGE', // Atualiza quando usuário muda de página
    enabled: true
  },
  {
    name: 'limit',
    value: '20',
    reference: 'PAGE_SIZE_CHANGE', // Atualiza quando muda itens por página
    enabled: true
  },
  {
    name: 'sortField',
    value: '',
    reference: 'SORT_FIELD', // Atualiza com campo ordenado
    enabled: false
  },
  {
    name: 'sortOrder',
    value: '',
    reference: 'SORT_ORDER', // Atualiza com direção (asc/desc)
    enabled: false
  },
  {
    name: 'status',
    value: 'active',
    reference: 'STATIC', // Valor fixo
    enabled: true
  }
]
// Resultado (exemplo): https://api.example.com/users?page=1&limit=20&status=active
```

---

## 📖 Referências de Query Params

| Referência | Quando Atualiza | Uso |
|------------|-----------------|-----|
| `PAGE_CHANGE` | Usuário muda de página | Paginação |
| `PAGE_SIZE_CHANGE` | Usuário altera itens por página | Paginação |
| `SORT_FIELD` | Usuário ordena uma coluna | Ordenação |
| `SORT_ORDER` | Direção da ordenação muda | Ordenação (asc/desc) |
| `STATIC` | Nunca (valor fixo) | Filtros fixos |

---

## 🔧 Configuração de Paginação

### Melhorias

1. **Footer Condicional**: Quando `pagination.enabled = false`, o footer é automaticamente ocultado
2. **Opções Visuais**: Use tags/chips para adicionar e remover opções de tamanho de página
3. **Integração Automática**: Query params com referência `PAGE_CHANGE` e `PAGE_SIZE_CHANGE` são atualizados automaticamente

```javascript
pagination: {
  enabled: true,
  defaultPageSize: 20,
  pageSizeOptions: [10, 20, 50, 100],
  showSizeChanger: true,
  startFrom: 1
}
```

---

## 💡 Exemplos Práticos

### Exemplo 1: Lista Simples sem Paginação

```javascript
{
  api: {
    baseURL: 'https://jsonplaceholder.typicode.com',
    path: '/users',
    pathParams: [],
    queryParams: [],
    token: '',
    headers: []
  },
  pagination: {
    enabled: false
  }
}
```

**URL gerada**: `https://jsonplaceholder.typicode.com/users`

---

### Exemplo 2: Lista com Paginação

```javascript
{
  api: {
    baseURL: 'https://jsonplaceholder.typicode.com',
    path: '/posts',
    pathParams: [],
    queryParams: [
      { name: '_page', value: '1', reference: 'PAGE_CHANGE', enabled: true },
      { name: '_limit', value: '10', reference: 'PAGE_SIZE_CHANGE', enabled: true }
    ],
    token: '',
    headers: []
  },
  pagination: {
    enabled: true,
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 20, 50]
  }
}
```

**URLs geradas**:
- Página 1: `https://jsonplaceholder.typicode.com/posts?_page=1&_limit=10`
- Página 2: `https://jsonplaceholder.typicode.com/posts?_page=2&_limit=10`
- Mudou para 20 itens: `https://jsonplaceholder.typicode.com/posts?_page=1&_limit=20`

---

### Exemplo 3: Recurso Específico com Path Param

```javascript
{
  api: {
    baseURL: 'https://api.example.com',
    path: '/users/{userId}',
    pathParams: [
      { name: 'userId', value: '123', enabled: true }
    ],
    queryParams: [],
    token: 'Bearer abc123',
    headers: []
  }
}
```

**URL gerada**: `https://api.example.com/users/123`

---

### Exemplo 4: Lista com Filtros Fixos e Dinâmicos

```javascript
{
  api: {
    baseURL: 'https://api.example.com',
    path: '/products',
    pathParams: [],
    queryParams: [
      { name: 'page', value: '1', reference: 'PAGE_CHANGE', enabled: true },
      { name: 'limit', value: '20', reference: 'PAGE_SIZE_CHANGE', enabled: true },
      { name: 'category', value: 'electronics', reference: 'STATIC', enabled: true },
      { name: 'inStock', value: 'true', reference: 'STATIC', enabled: true }
    ],
    token: '',
    headers: []
  }
}
```

**URL gerada**: `https://api.example.com/products?page=1&limit=20&category=electronics&inStock=true`

---

## 🎨 Interface do Usuário

### Tela de Configuração da API

1. **URL Base**: Input simples com validação
2. **Path**: Input com suporte a variáveis `{nome}`
3. **Path Params**: Tabela com colunas (Nome, Valor, Ativo)
4. **Query Params**: Tabela com colunas (Nome, Valor Inicial, Referência, Ativo)
5. **Preview da URL**: Visualização em tempo real da URL final montada

### Preview Inteligente

O preview mostra:
- ✅ Validação da configuração
- 🎨 URL com cores (base azul, path verde, query roxo)
- ⚠️ Alertas para variáveis não configuradas
- 📋 Botão para copiar URL

---

## 🔄 Migração

### Para Configurações Existentes

Se você tem configurações antigas, elas precisarão ser atualizadas manualmente:

**Passo 1**: Separe a URL base do path
```javascript
// Antes
baseURL: 'https://api.example.com/users'

// Depois
baseURL: 'https://api.example.com'
path: '/users'
```

**Passo 2**: Converta body params em query params
```javascript
// Antes
body: [
  { key: 'page', value: '1' }
]

// Depois
queryParams: [
  { name: 'page', value: '1', reference: 'PAGE_CHANGE', enabled: true }
]
```

**Passo 3**: Remova referências a `endpoints` (não é mais usado)

---

## 🛠️ Para Desenvolvedores

### Novos Arquivos Criados

1. **`src/components/shared/ParamsTable.jsx`** - Componente reutilizável para tabelas de parâmetros
2. **`src/components/shared/UrlPreview.jsx`** - Preview da URL montada
3. **`src/services/url-builder.js`** - Lógica de construção e interpolação de URLs
4. **`src/hooks/useApiParams.js`** - Hook para gerenciar estado de parâmetros dinâmicos

### Funções Principais

```javascript
// url-builder.js
import { buildApiUrl } from './services/url-builder';

const url = buildApiUrl(apiConfig, { page: 2, limit: 20 });
// Monta URL completa com valores dinâmicos

// useApiParams.js
import { useApiParams } from './hooks/useApiParams';

const { handlePageChange, handlePageSizeChange, mergedValues } = useApiParams(
  { queryParams: [...] },
  (newValues) => console.log('Params atualizados:', newValues)
);
```

---

## ✅ Checklist de Implementação

- [x] Criar componente `ParamsTable`
- [x] Criar componente `UrlPreview`
- [x] Criar serviço `url-builder`
- [x] Criar hook `useApiParams`
- [x] Refatorar `ApiConfig.jsx`
- [x] Refatorar `PaginationConfig.jsx`
- [x] Atualizar `external-api.js`
- [x] Modificar `dxp-table-footer.jsx`
- [x] Corrigir exemplos em `preset-examples.js`
- [x] Remover `EndpointsConfig.jsx`
- [ ] Integrar com componentes de visualização de tabela
- [ ] Testes end-to-end

---

## 📚 Recursos Adicionais

- Veja exemplos completos em `src/utils/preset-examples.js`
- Consulte a documentação da API em `src/components/ConfigPanel/DocumentationTab.jsx`
- Para dúvidas, consulte os tooltips na interface de configuração

---

## 🤝 Contribuindo

Se encontrar problemas ou tiver sugestões:
1. Verifique se o formato da configuração está correto
2. Consulte o console do navegador para erros
3. Revise os exemplos pré-configurados
4. Abra uma issue descrevendo o problema

---

**Última atualização**: Janeiro 2025
**Versão**: 2.0.0
