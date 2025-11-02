const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { generateToken } = require('../utils/jwt');
const { checkRole } = require('../middleware/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }
      return context.user;
    },

    portfolios: async (parent, args, context) => {
      checkRole(context.user, 'ADMIN', 'MANAGER');
      return prisma.portfolio.findMany({
        include: {
          owner: true,
          createdBy: true,
          assets: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    },

    portfolio: async (parent, args, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      const portfolio = await prisma.portfolio.findUnique({
        where: { id: args.id },
        include: {
          owner: true,
          createdBy: true,
          assets: true,
        },
      });

      if (!portfolio) {
        throw new Error('Portfolio not found');
      }

      // Users can only view their own portfolios unless they're admin/manager
      if (
        context.user.role !== 'ADMIN' &&
        context.user.role !== 'MANAGER' &&
        portfolio.ownerId !== context.user.id
      ) {
        throw new Error('Access denied');
      }

      return portfolio;
    },

    myPortfolios: async (parent, args, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      return prisma.portfolio.findMany({
        where: { ownerId: context.user.id },
        include: {
          owner: true,
          createdBy: true,
          assets: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    },

    assets: async (parent, args, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      const portfolio = await prisma.portfolio.findUnique({
        where: { id: args.portfolioId },
      });

      if (!portfolio) {
        throw new Error('Portfolio not found');
      }

      // Check access
      if (
        context.user.role !== 'ADMIN' &&
        context.user.role !== 'MANAGER' &&
        portfolio.ownerId !== context.user.id
      ) {
        throw new Error('Access denied');
      }

      return prisma.asset.findMany({
        where: { portfolioId: args.portfolioId },
        include: { portfolio: true },
        orderBy: { createdAt: 'desc' },
      });
    },

    asset: async (parent, args, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      const asset = await prisma.asset.findUnique({
        where: { id: args.id },
        include: { portfolio: true },
      });

      if (!asset) {
        throw new Error('Asset not found');
      }

      const portfolio = await prisma.portfolio.findUnique({
        where: { id: asset.portfolioId },
      });

      // Check access
      if (
        context.user.role !== 'ADMIN' &&
        context.user.role !== 'MANAGER' &&
        portfolio.ownerId !== context.user.id
      ) {
        throw new Error('Access denied');
      }

      return asset;
    },
  },

  Mutation: {
    register: async (parent, args) => {
      const existingUser = await prisma.user.findUnique({
        where: { email: args.email },
      });

      if (existingUser) {
        throw new Error('User already exists');
      }

      const hashedPassword = await bcrypt.hash(args.password, 10);

      const user = await prisma.user.create({
        data: {
          email: args.email,
          password: hashedPassword,
          firstName: args.firstName,
          lastName: args.lastName,
          role: 'USER',
        },
      });

      const token = generateToken(user.id);

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
      };
    },

    login: async (parent, args) => {
      const user = await prisma.user.findUnique({
        where: { email: args.email },
      });

      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isValid = await bcrypt.compare(args.password, user.password);

      if (!isValid) {
        throw new Error('Invalid credentials');
      }

      const token = generateToken(user.id);

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
      };
    },

    createPortfolio: async (parent, args, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      const ownerId = args.ownerId || context.user.id;

      // Only admins and managers can create portfolios for other users
      if (ownerId !== context.user.id) {
        checkRole(context.user, 'ADMIN', 'MANAGER');
      }

      const portfolio = await prisma.portfolio.create({
        data: {
          name: args.name,
          description: args.description,
          ownerId,
          createdById: context.user.id,
        },
        include: {
          owner: true,
          createdBy: true,
          assets: true,
        },
      });

      return portfolio;
    },

    updatePortfolio: async (parent, args, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      const portfolio = await prisma.portfolio.findUnique({
        where: { id: args.id },
      });

      if (!portfolio) {
        throw new Error('Portfolio not found');
      }

      // Check access
      if (
        context.user.role !== 'ADMIN' &&
        context.user.role !== 'MANAGER' &&
        portfolio.ownerId !== context.user.id
      ) {
        throw new Error('Access denied');
      }

      const updatedPortfolio = await prisma.portfolio.update({
        where: { id: args.id },
        data: {
          name: args.name,
          description: args.description,
          status: args.status,
        },
        include: {
          owner: true,
          createdBy: true,
          assets: true,
        },
      });

      return updatedPortfolio;
    },

    deletePortfolio: async (parent, args, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      const portfolio = await prisma.portfolio.findUnique({
        where: { id: args.id },
      });

      if (!portfolio) {
        throw new Error('Portfolio not found');
      }

      // Check access
      if (
        context.user.role !== 'ADMIN' &&
        context.user.role !== 'MANAGER' &&
        portfolio.ownerId !== context.user.id
      ) {
        throw new Error('Access denied');
      }

      await prisma.portfolio.delete({
        where: { id: args.id },
      });

      return true;
    },

    createAsset: async (parent, args, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      const portfolio = await prisma.portfolio.findUnique({
        where: { id: args.portfolioId },
      });

      if (!portfolio) {
        throw new Error('Portfolio not found');
      }

      // Check access
      if (
        context.user.role !== 'ADMIN' &&
        context.user.role !== 'MANAGER' &&
        portfolio.ownerId !== context.user.id
      ) {
        throw new Error('Access denied');
      }

      const value = args.quantity * args.price;

      const asset = await prisma.asset.create({
        data: {
          name: args.name,
          symbol: args.symbol,
          type: args.type,
          quantity: args.quantity,
          price: args.price,
          value,
          currency: args.currency || 'USD',
          purchaseDate: args.purchaseDate ? new Date(args.purchaseDate) : null,
          notes: args.notes,
          portfolioId: args.portfolioId,
        },
        include: {
          portfolio: true,
        },
      });

      return asset;
    },

    updateAsset: async (parent, args, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      const asset = await prisma.asset.findUnique({
        where: { id: args.id },
        include: { portfolio: true },
      });

      if (!asset) {
        throw new Error('Asset not found');
      }

      const portfolio = asset.portfolio;

      // Check access
      if (
        context.user.role !== 'ADMIN' &&
        context.user.role !== 'MANAGER' &&
        portfolio.ownerId !== context.user.id
      ) {
        throw new Error('Access denied');
      }

      const updateData = {};
      if (args.name !== undefined) updateData.name = args.name;
      if (args.symbol !== undefined) updateData.symbol = args.symbol;
      if (args.type !== undefined) updateData.type = args.type;
      if (args.quantity !== undefined) updateData.quantity = args.quantity;
      if (args.price !== undefined) updateData.price = args.price;
      if (args.currency !== undefined) updateData.currency = args.currency;
      if (args.purchaseDate !== undefined) {
        updateData.purchaseDate = args.purchaseDate ? new Date(args.purchaseDate) : null;
      }
      if (args.notes !== undefined) updateData.notes = args.notes;

      // Recalculate value if quantity or price changed
      if (args.quantity !== undefined || args.price !== undefined) {
        const quantity = args.quantity !== undefined ? args.quantity : asset.quantity;
        const price = args.price !== undefined ? args.price : asset.price;
        updateData.value = quantity * price;
      }

      const updatedAsset = await prisma.asset.update({
        where: { id: args.id },
        data: updateData,
        include: {
          portfolio: true,
        },
      });

      return updatedAsset;
    },

    deleteAsset: async (parent, args, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }

      const asset = await prisma.asset.findUnique({
        where: { id: args.id },
        include: { portfolio: true },
      });

      if (!asset) {
        throw new Error('Asset not found');
      }

      const portfolio = asset.portfolio;

      // Check access
      if (
        context.user.role !== 'ADMIN' &&
        context.user.role !== 'MANAGER' &&
        portfolio.ownerId !== context.user.id
      ) {
        throw new Error('Access denied');
      }

      await prisma.asset.delete({
        where: { id: args.id },
      });

      return true;
    },
  },

  Portfolio: {
    totalValue: async (parent) => {
      // Optimize: if assets are already included (from findMany), use them
      // Otherwise, fetch them from database
      if (parent.assets && Array.isArray(parent.assets)) {
        return parent.assets.reduce((sum, asset) => sum + asset.value, 0);
      }
      
      const assets = await prisma.asset.findMany({
        where: { portfolioId: parent.id },
      });
      return assets.reduce((sum, asset) => sum + asset.value, 0);
    },
    createdAt: (parent) => parent.createdAt ? parent.createdAt.toISOString() : null,
    updatedAt: (parent) => parent.updatedAt ? parent.updatedAt.toISOString() : null,
  },

  Asset: {
    purchaseDate: (parent) => parent.purchaseDate ? parent.purchaseDate.toISOString() : null,
    createdAt: (parent) => parent.createdAt ? parent.createdAt.toISOString() : null,
    updatedAt: (parent) => parent.updatedAt ? parent.updatedAt.toISOString() : null,
  },

  User: {
    createdAt: (parent) => parent.createdAt ? parent.createdAt.toISOString() : null,
    updatedAt: (parent) => parent.updatedAt ? parent.updatedAt.toISOString() : null,
  },
};

module.exports = resolvers;



