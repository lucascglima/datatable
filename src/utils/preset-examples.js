/**
 * Exemplos Pré-Configurados
 * Configurações prontas e funcionais para usuários não-técnicos
 */

export const presetExamples = {
  users: {
    name: 'Lista de Usuários',
    description: 'Exemplo simples mostrando uma lista de usuários com nome, email e telefone',
    icon: '👥',
    config: {
      api: {
        baseURL: 'https://jsonplaceholder.typicode.com',
        token: '',
        headers: [],
        body: [],
      },
      endpoints: [
        {
          id: 1,
          name: 'users',
          path: '/users',
          method: 'GET',
        },
      ],
      columns: [
        {
          id: 1,
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
          sortable: true,
          clickable: false,
          width: 80,
          renderType: 'default',
          renderConfig: {},
        },
        {
          id: 2,
          title: 'Nome',
          dataIndex: 'name',
          key: 'name',
          sortable: true,
          clickable: false,
          width: 200,
          renderType: 'default',
          renderConfig: {},
        },
        {
          id: 3,
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
          sortable: true,
          clickable: false,
          width: 250,
          renderType: 'default',
          renderConfig: {},
        },
        {
          id: 4,
          title: 'Telefone',
          dataIndex: 'phone',
          key: 'phone',
          sortable: false,
          clickable: false,
          width: 150,
          renderType: 'default',
          renderConfig: {},
        },
      ],
      mapping: {
        dataPath: '',
        currentPage: '',
        totalPages: '',
        totalItems: '',
      },
      pagination: {
        enabled: false, // JSONPlaceholder não tem paginação
        pageNumberParam: 'page',
        pageSizeParam: 'limit',
        defaultPageSize: 10,
        pageSizeOptions: [10, 20, 50, 100],
        showSizeChanger: true,
        startFrom: 1,
      },
      events: {
        onRowClick: `// Mostrar informações do usuário
console.log('👤 Usuário selecionado:', record);
alert('Nome: ' + record.name + '\\nEmail: ' + record.email);`,
        onButtonClick: '',
        onIconClick: '',
      },
      errorHandlers: [],
    },
  },

  usersWithActions: {
    name: 'Usuários com Botões de Ação',
    description: 'Lista de usuários com botões para visualizar, editar e excluir',
    icon: '⚡',
    config: {
      api: {
        baseURL: 'https://jsonplaceholder.typicode.com',
        token: '',
        headers: [],
        body: [],
      },
      endpoints: [
        {
          id: 1,
          name: 'users',
          path: '/users',
          method: 'GET',
        },
      ],
      columns: [
        {
          id: 1,
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
          sortable: true,
          clickable: false,
          width: 70,
          renderType: 'default',
          renderConfig: {},
        },
        {
          id: 2,
          title: 'Nome',
          dataIndex: 'name',
          key: 'name',
          sortable: true,
          clickable: false,
          width: 180,
          renderType: 'default',
          renderConfig: {},
        },
        {
          id: 3,
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
          sortable: false,
          clickable: false,
          width: 220,
          renderType: 'default',
          renderConfig: {},
        },
        {
          id: 4,
          title: 'Status',
          dataIndex: 'username',
          key: 'status',
          sortable: false,
          clickable: false,
          width: 120,
          renderType: 'tags',
          renderConfig: {
            uppercase: true,
            colorMap: 'Bret:green,Antonette:blue,Samantha:orange,Karianne:purple,Kamren:cyan',
          },
        },
        {
          id: 5,
          title: 'Ações',
          dataIndex: 'id',
          key: 'actions',
          sortable: false,
          clickable: false,
          width: 250,
          renderType: 'buttons',
          renderConfig: {
            buttons: 'Ver Detalhes:primary,Editar:default,Excluir:danger',
          },
        },
      ],
      mapping: {
        dataPath: '',
        currentPage: '',
        totalPages: '',
        totalItems: '',
      },
      pagination: {
        enabled: false,
        pageNumberParam: 'page',
        pageSizeParam: 'limit',
        defaultPageSize: 10,
        pageSizeOptions: [10, 20, 50, 100],
        showSizeChanger: true,
        startFrom: 1,
      },
      events: {
        onRowClick: `console.log('Linha clicada:', record);`,
        onButtonClick: `// Ação executada ao clicar no botão
console.log('🔘 Botão clicado para o usuário:', record);

// Você pode adicionar ações diferentes aqui
// Por exemplo: abrir uma página, fazer uma chamada de API, etc.
alert('Ação realizada para: ' + record.name);`,
        onIconClick: '',
      },
      errorHandlers: [],
    },
  },

  posts: {
    name: 'Lista de Posts',
    description: 'Posts de blog com título, conteúdo e ícones de ação',
    icon: '📝',
    config: {
      api: {
        baseURL: 'https://jsonplaceholder.typicode.com',
        token: '',
        headers: [],
        body: [],
      },
      endpoints: [
        {
          id: 1,
          name: 'posts',
          path: '/posts',
          method: 'GET',
        },
      ],
      columns: [
        {
          id: 1,
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
          sortable: true,
          clickable: false,
          width: 70,
          renderType: 'default',
          renderConfig: {},
        },
        {
          id: 2,
          title: 'Título',
          dataIndex: 'title',
          key: 'title',
          sortable: true,
          clickable: true,
          width: 350,
          renderType: 'default',
          renderConfig: {},
        },
        {
          id: 3,
          title: 'Conteúdo',
          dataIndex: 'body',
          key: 'body',
          sortable: false,
          clickable: false,
          width: 400,
          renderType: 'default',
          renderConfig: {},
        },
        {
          id: 4,
          title: 'Ações',
          dataIndex: 'id',
          key: 'actions',
          sortable: false,
          clickable: false,
          width: 120,
          renderType: 'icons',
          renderConfig: {
            icons: 'EyeOutlined:#1890ff,EditOutlined:#52c41a,DeleteOutlined:#ff4d4f',
          },
        },
      ],
      mapping: {
        dataPath: '',
        currentPage: '',
        totalPages: '',
        totalItems: '',
      },
      pagination: {
        enabled: false,
        pageNumberParam: 'page',
        pageSizeParam: 'limit',
        defaultPageSize: 10,
        pageSizeOptions: [10, 20, 50],
        showSizeChanger: true,
        startFrom: 1,
      },
      events: {
        onRowClick: `console.log('Post selecionado:', record);`,
        onButtonClick: '',
        onIconClick: `// Ação do ícone
console.log('🎯 Ícone clicado:', record);
alert('Post: ' + record.title);`,
      },
      errorHandlers: [],
    },
  },
};

/**
 * Retorna lista de exemplos para exibição
 */
export const getExamplesList = () => {
  return Object.keys(presetExamples).map((key) => ({
    key,
    name: presetExamples[key].name,
    description: presetExamples[key].description,
    icon: presetExamples[key].icon,
  }));
};

/**
 * Retorna configuração de um exemplo específico
 */
export const getExampleConfig = (key) => {
  return presetExamples[key]?.config || null;
};

/**
 * Verifica se um exemplo existe
 */
export const exampleExists = (key) => {
  return !!presetExamples[key];
};
