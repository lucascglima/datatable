# DataTable Configurável - DXP Table

Uma tabela de dados altamente configurável construída com React, Ant Design e Vite. Permite configuração completa via interface gráfica, incluindo API, colunas, mapeamento de dados, e tratamento de erros.

## 🚀 Instalação

```bash
npm install
npm run dev
```

## 🎯 Características Principais

### Configuração de API
- **Base URL**: Configure a URL base da sua API
- **Autenticação**: Token Bearer automático
- **Headers Customizados**: Adicione headers em formato chave/valor
- **Body Parameters**: Parâmetros de body para POST/PUT/PATCH

### Configuração de Colunas
Suporte a 5 tipos de renderização:

1. **Default**: Texto simples
2. **Tags com Cores**: Tags coloridas com mapeamento de valores
3. **Botões**: Botões de ação com handlers globais
4. **Ícones**: Ícones clicáveis do Ant Design
5. **Customizado**: Funções de render personalizadas

### Mapeamento de Response
- Suporte a **dot notation** para dados aninhados
- Configuração de caminho dos dados
- Extração de paginação (página atual, total de páginas, total de itens)

### Funcionalidades Extras
- ✅ **Import/Export de Configuração** (JSON)
- ✅ **Seletor Visual de Ícones** (50+ ícones populares)
- ✅ **Seletor Visual de Cores** (Paleta completa Ant Design)
- ✅ **Documentação Integrada** com exemplos
- ✅ **Persistência em LocalStorage**

## 📖 Uso Rápido

1. Inicie o servidor: `npm run dev`
2. Abra http://localhost:5173
3. Clique no botão **"Configurar"**
4. Importe o exemplo: Clique em **"Importar"** → Selecione `public/test-config.json`
5. Clique em **"Salvar"** e veja a tabela funcionando!

## ⚙️ Configuração

### 1. API

- **Base URL**: URL completa da API
- **Token**: Token Bearer (incluído automaticamente no header Authorization)
- **Headers**: Pares key/value adicionados a cada request
- **Body**: Pares key/value incluídos no body (POST/PUT/PATCH)

### 2. Endpoints

- Configure endpoints que ficarão disponíveis para uso em ações de colunas
- Formato: Nome (identificador) + Caminho (ex: /users/{id}) + Método (GET/POST/PUT/DELETE)

### 3. Colunas

Configure as colunas da tabela com campos básicos e renderização customizada:

**Campos Básicos:**
- Title, Data Index, Key
- Sortable (ordenável)
- Clickable (clicável)
- Width (largura em pixels)

**Tipos de Renderização:**

#### Tags com Cores
```
Mapeamento: active:green,inactive:red,pending:orange
Uppercase: ✓
```

#### Botões
```
Formato: Editar:primary:handleEdit,Deletar:danger:handleDelete
```

#### Ícones
```
Formato: EditOutlined:#1890ff:handleEdit,DeleteOutlined:#ff4d4f:handleDelete
```

Use os botões **"Selecionar Ícone"** e **"Selecionar Cor"** para facilitar!

### 4. Mapeamento de Resposta

Configure caminhos usando **dot notation** para extrair dados de responses aninhados:

**Exemplo: Array direto (JSONPlaceholder)**
```
Caminho dos Dados: (vazio)
```

**Exemplo: Dados aninhados**
```
Caminho dos Dados: data.results
Página Atual: pagination.current
Total de Páginas: pagination.pages
Total de Itens: pagination.total
```

### 5. Tratamento de Erros

Configure como a aplicação reage a erros HTTP:

- **Status** (obrigatório): Código HTTP (401, 403, 500, etc)
- **Mensagem** (obrigatório): Texto exibido ao usuário
- **Ação** (obrigatório): alert / redirect / log

## 💻 Funções Globais

Para usar botões e ícones, defina funções globais (já incluídas em `test-functions.js`):

```javascript
window.handleEdit = function(record, value) {
  console.log('Edit clicked:', record);
  alert(`Editar: ${record.name}`);
};

window.handleDelete = function(record, value) {
  if (confirm('Deletar registro?')) {
    console.log('Delete:', record);
  }
};

window.handleView = function(record, value) {
  alert(JSON.stringify(record, null, 2));
};

window.onCellClick = function(columnKey, record) {
  console.log('Cell clicked:', columnKey, record);
};
```

## 🔧 Build

```bash
npm run build
```

## 📦 Estrutura

```
src/
├── components/
│   ├── ConfigPanel/         # Painel de configuração (4 abas)
│   └── dxp-table/           # Componente da tabela
├── services/
│   ├── api.js               # Serviço de API (inclui token/headers/body automaticamente)
│   └── storage.js           # Armazenamento de configuração
├── pages/
│   └── DataTablePage.jsx    # Página principal
└── App.jsx                  # App raiz
```

## 📊 Stack Tecnológica

- **React** 18.3.1
- **Ant Design** 5.23.3
- **Vite** 6.3.6
- **LocalStorage** para persistência

## 📁 Arquivos de Teste

- `public/test-config.json`: Configuração completa de exemplo para JSONPlaceholder
- `public/test-functions.js`: Funções globais para handlers de botões/ícones

## 💡 Dicas

1. **Use Import/Export**: Salve suas configurações e compartilhe com a equipe
2. **Consulte a Documentação**: Acesse a aba "📚 Documentação" no painel de configuração
3. **Use os Seletores**: Facilite a escolha de ícones e cores com os seletores visuais
4. **Dot Notation**: Use pontos para acessar dados aninhados (ex: `data.results.items`)
5. **Test Functions**: Sempre defina as funções globais antes de usar botões/ícones

## 🐛 Troubleshooting

### Dados não aparecem
- Verifique a Base URL
- Verifique o mapeamento de response
- Abra o console do navegador para ver erros

### Botões/Ícones não funcionam
- Verifique se as funções globais estão definidas
- Certifique-se de que `test-functions.js` está incluído no HTML

### Erro de CORS
- Configure o backend para aceitar requests do frontend
- Use um proxy no desenvolvimento

## 🎯 Funcionalidades Completas

✅ Configuração visual sem código
✅ 5 tipos de renderização de colunas
✅ Seletores visuais de ícones e cores
✅ Import/Export de configuração JSON
✅ Documentação integrada com exemplos
✅ Token Bearer incluído automaticamente
✅ Headers e Body em formato key/value
✅ Mapeamento de response com dot notation
✅ Tratamento de erros por status HTTP
✅ Persistência em LocalStorage

---

**Versão**: 3.0.0 (Completa)
**Última atualização**: Outubro 2025
Desenvolvido com ❤️ usando React e Ant Design
