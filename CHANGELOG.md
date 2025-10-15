# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [3.0.0] - 2025-10-15

### ✨ Adicionado

#### FASE 1: Mapeamento de Response Aprimorado
- Transformado mapeamento de genérico (key/value array) para campos específicos
- Adicionado suporte a **dot notation** para acessar dados aninhados
- Campos específicos: `dataPath`, `currentPage`, `totalPages`, `totalItems`
- Método `getNestedValue()` no ApiService para navegação em objetos
- Exemplos práticos na UI (JSONPlaceholder, APIs aninhadas, arrays simples)

#### FASE 2: Configuração Avançada de Colunas
- **ColumnsConfig Component** completo com 5 tipos de renderização:
  - Default: texto simples
  - Tags: tags coloridas com mapeamento de valores + uppercase
  - Buttons: botões com actions e tipos (primary, danger, etc)
  - Icons: ícones do Ant Design com cores e handlers
  - Custom: funções de render customizadas globais
- **column-renderer.jsx utility**:
  - `createColumnRenderer()`: gera funções de render baseadas em config
  - `buildTableColumns()`: converte config em colunas Ant Design
  - Suporte a ordenação, células clicáveis, largura customizada
- Aba "📋 Colunas" no ConfigPanel
- Auto-detecção de colunas quando não configuradas

#### FASE 3: Testes e Refinamentos da API
- **test-config.json**: configuração completa de exemplo JSONPlaceholder
  - API config com headers customizados
  - 3 endpoints configurados
  - 6 colunas com todos os tipos de renderização
  - Mapeamento e error handlers
- **test-functions.js**: funções globais para handlers
  - `handleEdit()`, `handleDelete()`, `handleView()`
  - `onCellClick()` para células clicáveis
  - `customRenderFunction()` de exemplo
- **Import/Export de Configuração**:
  - Botão "Importar" com validação de JSON
  - Botão "Exportar" para download da config atual
  - Mensagens de sucesso/erro
- Integração de test-functions.js no index.html

#### FASE 4: DocumentationTab Component
- Modal Collapse com 8 seções:
  - Exemplo completo JSONPlaceholder
  - Exemplo API com response aninhado
  - Guia de Configuração de API
  - Guia de Configuração de Colunas
  - Guia de Mapeamento de Response
  - Guia de Tratamento de Erros
  - Funções Globais Necessárias
  - Configuração Atual (dinâmica)
- Funcionalidades:
  - Botão "Copiar" para clipboard
  - Botão "Baixar" para download JSON
  - Código formatado com syntax highlighting
  - Explicações detalhadas de cada campo

#### FASE 5: Seletores Visuais
- **IconSelector Component**:
  - Modal com grid 6x6
  - 50+ ícones mais populares do Ant Design
  - Busca em tempo real
  - Hover effects
  - Click para selecionar
- **ColorSelector Component**:
  - 11 paletas completas Ant Design
  - 10 tons por paleta (claro → escuro)
  - Cores básicas (preto, branco, cinza)
  - Hover effects com preview
  - Tooltip com nome e código hex
- **Integração no ColumnsConfig**:
  - Botão "Selecionar Cor" para Tags
  - Botões "Selecionar Ícone" e "Selecionar Cor" para Icons
  - Inserção automática no formato correto

#### Documentação
- README.md completo e atualizado
- CHANGELOG.md com histórico detalhado
- Documentação integrada na aplicação

### 🔧 Modificado

- **ApiService.applyMapping()**: reescrito completamente para suportar dot notation
- **ConfigPanel**: adicionadas abas "Colunas" e "Documentação"
- **DataTablePage**:
  - Usa `buildTableColumns()` quando colunas configuradas
  - Auto-gera colunas quando não configuradas
  - Melhorado mapeamento de response
- **storage.js**: adicionado campo `columns` no default config
- **column-renderer.js → .jsx**: renomeado para suportar JSX

### 🐛 Corrigido

- Erro JSX em arquivo .js (renomeado para .jsx)
- Importações de componentes atualizadas
- Validação de configuração no save

### 📦 Performance

- Build otimizado: 14.78s
- Bundle size: 1,890.65 kB (gzip: 525.67 kB)
- 3,017 módulos transformados

## [2.0.0] - 2025-10-14

### 🗑️ Removido (Simplificação Radical)

- Removidos 35 arquivos (~33,000 linhas de código)
- Deletadas páginas: advanced-demo-page, configuration-page, global-resources-page
- Removidos componentes: code-editor/, color-picker/, icon-picker/, navigation/
- Removidos services: jsonplaceholder-api, liferay-api, global-resources
- Removidos utils: ant-design-colors, html-sanitizer, function-validator, custom-render
- Removidos 9 arquivos de documentação desnecessários

### ✨ Adicionado

- **ConfigPanel unificado** com Drawer (não modal)
- 4 abas de configuração: API, Endpoints, Mapeamento, Erros
- **ApiConfig**: Base URL, Token, Headers (key/value), Body (key/value)
- **EndpointsConfig**: Lista de endpoints disponíveis
- **MappingConfig**: Mapeamento key/value de responses
- **ErrorHandlingConfig**: Status + Message + Action (required)
- **ApiService class**: gerenciamento automático de token/headers/body
- **storage.js**: persistência em LocalStorage
- **DataTablePage**: página única simplificada
- **App.jsx**: sem React Router, true SPA

### 🔧 Modificado

- Inputs de JSON substituídos por **key/value pairs**
- Build time reduzido de 30s para 15s
- Bundle size reduzido em 53%
- Arquitetura simplificada (74% menos arquivos)

## [1.0.0] - 2025-10-13

### ✨ Inicial

- Implementação Phase 1:
  - Code editor para configuração
  - Duplicate checker
  - Config example file
- Implementação Phase 2:
  - GeneralConfigSection
  - APIConfigSection
  - FooterConfigSection
  - Sorting support
  - Click handling
- Advanced demo page com 4 tabs
- Manual do usuário em português
- Integração com Liferay
- DxpTable component base

---

## Tipos de Mudanças

- `✨ Adicionado` para novas funcionalidades
- `🔧 Modificado` para mudanças em funcionalidades existentes
- `🐛 Corrigido` para correções de bugs
- `🗑️ Removido` para funcionalidades removidas
- `📦 Performance` para melhorias de performance
- `📖 Documentação` para mudanças na documentação
