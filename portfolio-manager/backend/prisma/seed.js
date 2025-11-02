const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data (optional - uncomment if you want a clean slate)
  console.log('Clearing existing data...');
  await prisma.asset.deleteMany({});
  await prisma.portfolio.deleteMany({});
  await prisma.user.deleteMany({});

  // Create users with different roles
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = await Promise.all([
    // Admin users
    prisma.user.create({
      data: {
        email: 'admin@portfolio.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
      },
    }),
    prisma.user.create({
      data: {
        email: 'sarah.admin@portfolio.com',
        password: hashedPassword,
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: 'ADMIN',
      },
    }),
    // Manager users
    prisma.user.create({
      data: {
        email: 'manager@portfolio.com',
        password: hashedPassword,
        firstName: 'Manager',
        lastName: 'User',
        role: 'MANAGER',
      },
    }),
    prisma.user.create({
      data: {
        email: 'mike.manager@portfolio.com',
        password: hashedPassword,
        firstName: 'Mike',
        lastName: 'Thompson',
        role: 'MANAGER',
      },
    }),
    // Regular users
    prisma.user.create({
      data: {
        email: 'user@portfolio.com',
        password: hashedPassword,
        firstName: 'Regular',
        lastName: 'User',
        role: 'USER',
      },
    }),
    prisma.user.create({
      data: {
        email: 'john.doe@portfolio.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        role: 'USER',
      },
    }),
    prisma.user.create({
      data: {
        email: 'jane.smith@portfolio.com',
        password: hashedPassword,
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'USER',
      },
    }),
    prisma.user.create({
      data: {
        email: 'alex.brown@portfolio.com',
        password: hashedPassword,
        firstName: 'Alex',
        lastName: 'Brown',
        role: 'USER',
      },
    }),
  ]);

  const [admin, admin2, manager, manager2, user, user2, user3, user4] = users;

  console.log(`✅ Created ${users.length} users`);

  // Helper function to create portfolios with assets
  const createPortfolioWithAssets = async (name, description, status, owner, createdBy, assets) => {
    return prisma.portfolio.create({
      data: {
        name,
        description,
        status,
        ownerId: owner.id,
        createdById: createdBy.id,
        assets: {
          create: assets.map(asset => ({
            ...asset,
            value: asset.quantity * asset.price, // Calculate value
          })),
        },
      },
    });
  };

  // Create portfolios for admin
  const portfolios = await Promise.all([
    // Admin's Tech Portfolio (Active)
    createPortfolioWithAssets(
      'Tech Giants Portfolio',
      'Diversified technology stocks including FAANG companies',
      'ACTIVE',
      admin,
      admin,
      [
        {
          name: 'Apple Inc.',
          symbol: 'AAPL',
          type: 'STOCK',
          quantity: 150,
          price: 175.50,
          currency: 'USD',
          purchaseDate: new Date('2023-01-15'),
          notes: 'Core holding in tech sector',
        },
        {
          name: 'Microsoft Corporation',
          symbol: 'MSFT',
          type: 'STOCK',
          quantity: 75,
          price: 380.25,
          currency: 'USD',
          purchaseDate: new Date('2023-02-20'),
          notes: 'Cloud services growth',
        },
        {
          name: 'Amazon.com Inc.',
          symbol: 'AMZN',
          type: 'STOCK',
          quantity: 50,
          price: 142.30,
          currency: 'USD',
          purchaseDate: new Date('2023-03-10'),
        },
        {
          name: 'Alphabet Inc.',
          symbol: 'GOOGL',
          type: 'STOCK',
          quantity: 100,
          price: 138.75,
          currency: 'USD',
          purchaseDate: new Date('2023-04-05'),
          notes: 'AI and search dominance',
        },
      ]
    ),

    // Admin's Crypto Portfolio (Active)
    createPortfolioWithAssets(
      'Digital Assets',
      'Cryptocurrency and blockchain investments',
      'ACTIVE',
      admin,
      admin,
      [
        {
          name: 'Bitcoin',
          symbol: 'BTC',
          type: 'CRYPTO',
          quantity: 1.5,
          price: 45000.00,
          currency: 'USD',
          purchaseDate: new Date('2023-06-15'),
          notes: 'Long-term hold',
        },
        {
          name: 'Ethereum',
          symbol: 'ETH',
          type: 'CRYPTO',
          quantity: 10,
          price: 2850.00,
          currency: 'USD',
          purchaseDate: new Date('2023-07-20'),
          notes: 'Smart contract platform',
        },
        {
          name: 'Cardano',
          symbol: 'ADA',
          type: 'CRYPTO',
          quantity: 5000,
          price: 0.48,
          currency: 'USD',
          purchaseDate: new Date('2023-08-10'),
        },
      ]
    ),

    // Manager's Balanced Portfolio
    createPortfolioWithAssets(
      'Balanced Growth Fund',
      'Mix of stocks and bonds for steady growth',
      'ACTIVE',
      manager,
      manager,
      [
        {
          name: 'S&P 500 Index Fund',
          symbol: 'SPY',
          type: 'STOCK',
          quantity: 200,
          price: 445.50,
          currency: 'USD',
          purchaseDate: new Date('2023-01-10'),
          notes: 'Market index tracking',
        },
        {
          name: 'US Treasury Bond 10Y',
          symbol: 'TNX',
          type: 'BOND',
          quantity: 10000,
          price: 98.50,
          currency: 'USD',
          purchaseDate: new Date('2023-05-15'),
          notes: 'Government bonds, 4.2% yield',
        },
        {
          name: 'Corporate Bond Fund',
          symbol: 'LQD',
          type: 'BOND',
          quantity: 150,
          price: 112.75,
          currency: 'USD',
          purchaseDate: new Date('2023-06-01'),
        },
      ]
    ),

    // User's Starter Portfolio
    createPortfolioWithAssets(
      'My First Portfolio',
      'Learning the ropes of investing',
      'ACTIVE',
      user,
      user,
      [
        {
          name: 'Apple Inc.',
          symbol: 'AAPL',
          type: 'STOCK',
          quantity: 10,
          price: 175.50,
          currency: 'USD',
          purchaseDate: new Date('2024-01-05'),
          notes: 'First investment',
        },
        {
          name: 'Tesla Inc.',
          symbol: 'TSLA',
          type: 'STOCK',
          quantity: 5,
          price: 248.90,
          currency: 'USD',
          purchaseDate: new Date('2024-01-10'),
        },
      ]
    ),

    // User2's Dividend Portfolio
    createPortfolioWithAssets(
      'Dividend Income',
      'High dividend yielding stocks for passive income',
      'ACTIVE',
      user2,
      user2,
      [
        {
          name: 'Johnson & Johnson',
          symbol: 'JNJ',
          type: 'STOCK',
          quantity: 50,
          price: 162.40,
          currency: 'USD',
          purchaseDate: new Date('2023-09-15'),
          notes: '3.2% dividend yield',
        },
        {
          name: 'Procter & Gamble',
          symbol: 'PG',
          type: 'STOCK',
          quantity: 40,
          price: 158.75,
          currency: 'USD',
          purchaseDate: new Date('2023-09-20'),
          notes: 'Consumer staples dividend',
        },
        {
          name: 'Coca-Cola Company',
          symbol: 'KO',
          type: 'STOCK',
          quantity: 60,
          price: 58.90,
          currency: 'USD',
          purchaseDate: new Date('2023-10-01'),
        },
      ]
    ),

    // User3's Real Estate Portfolio
    createPortfolioWithAssets(
      'Real Estate Holdings',
      'Real estate investment trust (REIT) portfolio',
      'ACTIVE',
      user3,
      user3,
      [
        {
          name: 'Vanguard Real Estate ETF',
          symbol: 'VNQ',
          type: 'REAL_ESTATE',
          quantity: 100,
          price: 85.30,
          currency: 'USD',
          purchaseDate: new Date('2023-11-10'),
          notes: 'Diversified REIT exposure',
        },
        {
          name: 'Prologis Inc.',
          symbol: 'PLD',
          type: 'REAL_ESTATE',
          quantity: 75,
          price: 125.50,
          currency: 'USD',
          purchaseDate: new Date('2023-11-15'),
          notes: 'Warehouse and logistics REIT',
        },
      ]
    ),

    // User4's Commodity Portfolio
    createPortfolioWithAssets(
      'Commodities Basket',
      'Gold, oil, and agricultural commodities',
      'ACTIVE',
      user4,
      user4,
      [
        {
          name: 'Gold ETF',
          symbol: 'GLD',
          type: 'COMMODITY',
          quantity: 50,
          price: 195.75,
          currency: 'USD',
          purchaseDate: new Date('2023-12-01'),
          notes: 'Gold price hedge',
        },
        {
          name: 'Oil Futures ETF',
          symbol: 'USO',
          type: 'COMMODITY',
          quantity: 100,
          price: 72.40,
          currency: 'USD',
          purchaseDate: new Date('2023-12-05'),
        },
        {
          name: 'Agricultural ETF',
          symbol: 'DBA',
          type: 'COMMODITY',
          quantity: 80,
          price: 21.30,
          currency: 'USD',
          purchaseDate: new Date('2023-12-10'),
        },
      ]
    ),

    // Admin2's International Portfolio
    createPortfolioWithAssets(
      'International Markets',
      'Global diversification across international markets',
      'ACTIVE',
      admin2,
      admin2,
      [
        {
          name: 'MSCI EAFE ETF',
          symbol: 'EFA',
          type: 'STOCK',
          quantity: 150,
          price: 68.90,
          currency: 'USD',
          purchaseDate: new Date('2023-04-20'),
          notes: 'Europe, Asia, Far East markets',
        },
        {
          name: 'Emerging Markets ETF',
          symbol: 'EEM',
          type: 'STOCK',
          quantity: 200,
          price: 42.15,
          currency: 'USD',
          purchaseDate: new Date('2023-05-15'),
        },
      ]
    ),

    // Manager2's Growth Portfolio (Inactive)
    createPortfolioWithAssets(
      'Growth Stocks 2023',
      'High growth tech and biotech stocks',
      'INACTIVE',
      manager2,
      manager2,
      [
        {
          name: 'NVIDIA Corporation',
          symbol: 'NVDA',
          type: 'STOCK',
          quantity: 30,
          price: 485.20,
          currency: 'USD',
          purchaseDate: new Date('2023-01-25'),
          notes: 'AI chip leader',
        },
        {
          name: 'BioNTech SE',
          symbol: 'BNTX',
          type: 'STOCK',
          quantity: 100,
          price: 95.40,
          currency: 'USD',
          purchaseDate: new Date('2023-03-15'),
        },
      ]
    ),

    // Archived Portfolio
    createPortfolioWithAssets(
      '2022 Investment Pool',
      'Portfolio from previous year, now archived',
      'ARCHIVED',
      admin,
      admin,
      [
        {
          name: 'Meta Platforms Inc.',
          symbol: 'META',
          type: 'STOCK',
          quantity: 50,
          price: 320.75,
          currency: 'USD',
          purchaseDate: new Date('2022-06-10'),
          notes: 'Sold position in 2023',
        },
      ]
    ),

    // User's Crypto Experiment
    createPortfolioWithAssets(
      'Crypto Experiment',
      'Small allocation to test cryptocurrency waters',
      'ACTIVE',
      user,
      user,
      [
        {
          name: 'Bitcoin',
          symbol: 'BTC',
          type: 'CRYPTO',
          quantity: 0.1,
          price: 45000.00,
          currency: 'USD',
          purchaseDate: new Date('2024-01-20'),
          notes: 'Small test position',
        },
        {
          name: 'Ethereum',
          symbol: 'ETH',
          type: 'CRYPTO',
          quantity: 1,
          price: 2850.00,
          currency: 'USD',
          purchaseDate: new Date('2024-01-25'),
        },
      ]
    ),

    // Manager's Blue Chip Portfolio
    createPortfolioWithAssets(
      'Blue Chip Stocks',
      'Large cap established companies',
      'ACTIVE',
      manager,
      manager,
      [
        {
          name: 'JPMorgan Chase & Co.',
          symbol: 'JPM',
          type: 'STOCK',
          quantity: 75,
          price: 168.50,
          currency: 'USD',
          purchaseDate: new Date('2023-08-15'),
          notes: 'Financial services leader',
        },
        {
          name: 'Walmart Inc.',
          symbol: 'WMT',
          type: 'STOCK',
          quantity: 60,
          price: 165.20,
          currency: 'USD',
          purchaseDate: new Date('2023-08-20'),
        },
        {
          name: 'Home Depot Inc.',
          symbol: 'HD',
          type: 'STOCK',
          quantity: 45,
          price: 342.80,
          currency: 'USD',
          purchaseDate: new Date('2023-09-05'),
        },
      ]
    ),

    // User2's Healthcare Portfolio
    createPortfolioWithAssets(
      'Healthcare Innovation',
      'Biotech and pharmaceutical companies',
      'ACTIVE',
      user2,
      user2,
      [
        {
          name: 'Moderna Inc.',
          symbol: 'MRNA',
          type: 'STOCK',
          quantity: 100,
          price: 125.80,
          currency: 'USD',
          purchaseDate: new Date('2023-07-10'),
          notes: 'RNA therapeutics pioneer',
        },
        {
          name: 'Pfizer Inc.',
          symbol: 'PFE',
          type: 'STOCK',
          quantity: 150,
          price: 38.45,
          currency: 'USD',
          purchaseDate: new Date('2023-07-15'),
          notes: 'Global pharma giant',
        },
        {
          name: 'UnitedHealth Group',
          symbol: 'UNH',
          type: 'STOCK',
          quantity: 25,
          price: 485.20,
          currency: 'USD',
          purchaseDate: new Date('2023-07-20'),
        },
      ]
    ),

    // User3's Energy Portfolio
    createPortfolioWithAssets(
      'Clean Energy Transition',
      'Renewable energy and sustainability stocks',
      'ACTIVE',
      user3,
      user3,
      [
        {
          name: 'NextEra Energy',
          symbol: 'NEE',
          type: 'STOCK',
          quantity: 80,
          price: 72.50,
          currency: 'USD',
          purchaseDate: new Date('2023-09-01'),
          notes: 'Largest renewable energy producer',
        },
        {
          name: 'First Solar Inc.',
          symbol: 'FSLR',
          type: 'STOCK',
          quantity: 120,
          price: 185.30,
          currency: 'USD',
          purchaseDate: new Date('2023-09-10'),
          notes: 'Solar panel manufacturer',
        },
        {
          name: 'Enphase Energy',
          symbol: 'ENPH',
          type: 'STOCK',
          quantity: 50,
          price: 125.60,
          currency: 'USD',
          purchaseDate: new Date('2023-09-15'),
        },
        {
          name: 'SolarEdge Technologies',
          symbol: 'SEDG',
          type: 'STOCK',
          quantity: 75,
          price: 235.80,
          currency: 'USD',
          purchaseDate: new Date('2023-09-20'),
        },
      ]
    ),

    // User4's Semiconductor Portfolio
    createPortfolioWithAssets(
      'Semiconductor Plays',
      'Chip manufacturing and design companies',
      'ACTIVE',
      user4,
      user4,
      [
        {
          name: 'Advanced Micro Devices',
          symbol: 'AMD',
          type: 'STOCK',
          quantity: 200,
          price: 108.75,
          currency: 'USD',
          purchaseDate: new Date('2023-10-05'),
          notes: 'CPU and GPU innovator',
        },
        {
          name: 'Taiwan Semiconductor',
          symbol: 'TSM',
          type: 'STOCK',
          quantity: 150,
          price: 98.50,
          currency: 'USD',
          purchaseDate: new Date('2023-10-10'),
          notes: 'World\'s largest chip foundry',
        },
        {
          name: 'Broadcom Inc.',
          symbol: 'AVGO',
          type: 'STOCK',
          quantity: 60,
          price: 892.40,
          currency: 'USD',
          purchaseDate: new Date('2023-10-15'),
        },
        {
          name: 'Qualcomm Inc.',
          symbol: 'QCOM',
          type: 'STOCK',
          quantity: 100,
          price: 148.30,
          currency: 'USD',
          purchaseDate: new Date('2023-10-20'),
        },
      ]
    ),

    // Admin's Archived Portfolio with Historical Data
    createPortfolioWithAssets(
      '2021 Tech Speculation',
      'High-risk tech bets from 2021 bull market',
      'ARCHIVED',
      admin,
      admin,
      [
        {
          name: 'GameStop Corp.',
          symbol: 'GME',
          type: 'STOCK',
          quantity: 50,
          price: 180.75,
          currency: 'USD',
          purchaseDate: new Date('2021-03-15'),
          notes: 'Meme stock position - sold 2022',
        },
        {
          name: 'AMC Entertainment',
          symbol: 'AMC',
          type: 'STOCK',
          quantity: 200,
          price: 25.80,
          currency: 'USD',
          purchaseDate: new Date('2021-04-20'),
          notes: 'Memestock rally - closed position',
        },
      ]
    ),

    // Manager2's Growth Portfolio with Many Assets
    createPortfolioWithAssets(
      'Diversified Growth Fund',
      'Multi-sector growth opportunity portfolio',
      'ACTIVE',
      manager2,
      manager2,
      [
        {
          name: 'Shopify Inc.',
          symbol: 'SHOP',
          type: 'STOCK',
          quantity: 100,
          price: 68.40,
          currency: 'USD',
          purchaseDate: new Date('2023-06-01'),
          notes: 'E-commerce platform',
        },
        {
          name: 'Palantir Technologies',
          symbol: 'PLTR',
          type: 'STOCK',
          quantity: 300,
          price: 18.90,
          currency: 'USD',
          purchaseDate: new Date('2023-06-10'),
          notes: 'Data analytics company',
        },
        {
          name: 'Rivian Automotive',
          symbol: 'RIVN',
          type: 'STOCK',
          quantity: 250,
          price: 22.50,
          currency: 'USD',
          purchaseDate: new Date('2023-06-15'),
        },
        {
          name: 'Coinbase Global',
          symbol: 'COIN',
          type: 'STOCK',
          quantity: 150,
          price: 85.60,
          currency: 'USD',
          purchaseDate: new Date('2023-06-20'),
          notes: 'Cryptocurrency exchange',
        },
        {
          name: 'Roblox Corporation',
          symbol: 'RBLX',
          type: 'STOCK',
          quantity: 200,
          price: 42.30,
          currency: 'USD',
          purchaseDate: new Date('2023-07-01'),
        },
        {
          name: 'Unity Software',
          symbol: 'U',
          type: 'STOCK',
          quantity: 180,
          price: 35.75,
          currency: 'USD',
          purchaseDate: new Date('2023-07-10'),
        },
      ]
    ),

    // Admin2's High Value Portfolio
    createPortfolioWithAssets(
      'Premium Holdings',
      'High-value concentrated positions',
      'ACTIVE',
      admin2,
      admin2,
      [
        {
          name: 'Berkshire Hathaway Class A',
          symbol: 'BRK.A',
          type: 'STOCK',
          quantity: 2,
          price: 485000.00,
          currency: 'USD',
          purchaseDate: new Date('2023-01-15'),
          notes: 'Warren Buffett\'s conglomerate',
        },
        {
          name: 'Amazon.com Inc.',
          symbol: 'AMZN',
          type: 'STOCK',
          quantity: 500,
          price: 142.30,
          currency: 'USD',
          purchaseDate: new Date('2023-02-01'),
        },
        {
          name: 'Google LLC',
          symbol: 'GOOGL',
          type: 'STOCK',
          quantity: 800,
          price: 138.75,
          currency: 'USD',
          purchaseDate: new Date('2023-02-10'),
        },
        {
          name: 'Microsoft Corporation',
          symbol: 'MSFT',
          type: 'STOCK',
          quantity: 400,
          price: 380.25,
          currency: 'USD',
          purchaseDate: new Date('2023-02-20'),
        },
      ]
    ),
  ]);

  console.log(`✅ Created ${portfolios.length} portfolios with assets`);

  // Count total assets
  const assetCount = await prisma.asset.count();
  console.log(`✅ Total assets created: ${assetCount}`);

  // Summary statistics
  const userCount = await prisma.user.count();
  const portfolioCount = await prisma.portfolio.count();
  const activePortfolios = await prisma.portfolio.count({ where: { status: 'ACTIVE' } });
  const inactivePortfolios = await prisma.portfolio.count({ where: { status: 'INACTIVE' } });
  const archivedPortfolios = await prisma.portfolio.count({ where: { status: 'ARCHIVED' } });

  console.log('\n📊 Seeding Summary:');
  console.log(`   Users: ${userCount}`);
  console.log(`   Portfolios: ${portfolioCount}`);
  console.log(`   - Active: ${activePortfolios}`);
  console.log(`   - Inactive: ${inactivePortfolios}`);
  console.log(`   - Archived: ${archivedPortfolios}`);
  console.log(`   Assets: ${assetCount}`);
  console.log('\n✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


