# DxpTable Component

A reusable DataTable component built with React and Ant Design.

## Features

- Fully controlled/stateless component
- Column sorting support
- Custom pagination with page size selection
- Row click handling
- Record count display
- Simple and clean API

## Installation

```bash
npm install antd prop-types react
```

## Usage

```javascript
import DxpTable from './datatable';

function MyComponent() {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 100,
  });

  const columns = [
    { key: 'id', title: 'ID', dataIndex: 'id', sortable: true },
    { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
    { key: 'email', title: 'Email', dataIndex: 'email' },
  ];

  const data = [
    { id: 1, name: 'John', email: 'john@example.com' },
    // ... more data
  ];

  return (
    <DxpTable
      columns={columns}
      data={data}
      pagination={pagination}
      rowKey="id"
      onPaginationChange={setPagination}
      onSort={(sortInfo) => console.log(sortInfo)}
      onRowClick={(record) => console.log(record)}
    />
  );
}
```

## Props

### DxpTable

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| columns | Array | Yes | Column configuration array |
| data | Array | Yes | Data array to be rendered |
| pagination | Object | Yes | Pagination configuration (current, pageSize, total) |
| rowKey | String | Yes | Unique key for each row |
| loading | Boolean | No | Loading state indicator |
| onSort | Function | No | Callback when column is sorted |
| onRowClick | Function | No | Callback when row is clicked |
| onPaginationChange | Function | No | Callback when pagination changes |

### Column Configuration

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| key | String | Yes | Unique identifier for the column |
| title | String | Yes | Column header title |
| dataIndex | String | Yes | Key in data object |
| sortable | Boolean | No | Enable sorting for this column |
| width | String/Number | No | Column width |
| align | String | No | Text alignment (left, center, right) |
| render | Function | No | Custom render function for cells |

## Components

- **dxp-table.jsx** - Main component that orchestrates the table
- **dxp-table-header.jsx** - Manages columns and header configuration
- **dxp-table-footer.jsx** - Manages pagination and footer information
- **dxp-table.types.js** - PropTypes definitions

## License

MIT
