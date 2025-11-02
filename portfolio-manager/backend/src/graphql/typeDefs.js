const { gql } = require('apollo-server-express');

const typeDefs = gql`
  enum UserRole {
    ADMIN
    MANAGER
    USER
  }

  enum PortfolioStatus {
    ACTIVE
    INACTIVE
    ARCHIVED
  }

  enum AssetType {
    STOCK
    BOND
    CRYPTO
    REAL_ESTATE
    COMMODITY
    OTHER
  }

  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    role: UserRole!
    createdAt: String!
    updatedAt: String!
  }

  type Portfolio {
    id: ID!
    name: String!
    description: String
    status: PortfolioStatus!
    createdAt: String!
    updatedAt: String!
    owner: User!
    createdBy: User!
    assets: [Asset!]!
    totalValue: Float!
  }

  type Asset {
    id: ID!
    name: String!
    symbol: String
    type: AssetType!
    quantity: Float!
    price: Float!
    value: Float!
    currency: String!
    purchaseDate: String
    notes: String
    createdAt: String!
    updatedAt: String!
    portfolio: Portfolio!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    # Auth
    me: User

    # Portfolios
    portfolios: [Portfolio!]!
    portfolio(id: ID!): Portfolio
    myPortfolios: [Portfolio!]!

    # Assets
    assets(portfolioId: ID!): [Asset!]!
    asset(id: ID!): Asset
  }

  type Mutation {
    # Auth
    register(email: String!, password: String!, firstName: String!, lastName: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!

    # Portfolios
    createPortfolio(name: String!, description: String, ownerId: ID): Portfolio!
    updatePortfolio(id: ID!, name: String, description: String, status: PortfolioStatus): Portfolio!
    deletePortfolio(id: ID!): Boolean!

    # Assets
    createAsset(
      portfolioId: ID!
      name: String!
      symbol: String
      type: AssetType!
      quantity: Float!
      price: Float!
      currency: String
      purchaseDate: String
      notes: String
    ): Asset!
    updateAsset(
      id: ID!
      name: String
      symbol: String
      type: AssetType
      quantity: Float
      price: Float
      currency: String
      purchaseDate: String
      notes: String
    ): Asset!
    deleteAsset(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;



