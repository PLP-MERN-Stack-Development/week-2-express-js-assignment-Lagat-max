[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19743315&assignment_repo_type=AssignmentRepo)
# Products API

A RESTful API built with Express.js for managing products.

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Copy `.env.example` to `.env` and set your API key
4. Start the server:
   ```
   npm start
   ```

## Environment Variables
- `API_KEY`: Your API key for authentication
- `PORT`: Port to run the server (default: 3000)
- `NODE_ENV`: Environment (development/production)

## API Endpoints

### Authentication
All POST, PUT, DELETE requests require an `x-api-key` header.

### Products
- `GET /api/products` - List all products (supports `category`, `page`, `limit` query params)
- `GET /api/products/:id` - Get a product by ID
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product
- `GET /api/products/search?name=...` - Search products by name
- `GET /api/products/stats` - Get product statistics by category

#### Example: List Products
```
GET /api/products?category=electronics&page=1&limit=2
```

#### Example: Create Product
```
POST /api/products
Headers: { "x-api-key": "your_api_key_here" }
Body:
{
  "name": "Tablet",
  "description": "10-inch screen",
  "price": 300,
  "category": "electronics",
  "inStock": true
}
```

#### Example: Error Response
```
{
  "message": "Invalid product data. Check all required fields and types."
}
```

## Error Handling
- 400: Validation errors
- 401: Unauthorized (missing/invalid API key)
- 404: Not found
- 500: Server errors

## License
MIT

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [RESTful API Design Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) 