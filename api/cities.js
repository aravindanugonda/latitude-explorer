// Smart router that detects environment and routes to appropriate handler
export default async function handler(req, res) {
  try {
    const isProd = process.env.NODE_ENV === 'production' || process.env.TURSO_DATABASE_URL;
    
    console.log('Environment detection:', {
      NODE_ENV: process.env.NODE_ENV,
      hasTursoUrl: !!process.env.TURSO_DATABASE_URL,
      isProd
    });

    if (isProd) {
      // Use Turso for production
      console.log('Routing to Turso handler');
      const { default: tursoHandler } = await import('./cities.turso.js');
      return tursoHandler(req, res);
    } else {
      // Use Prisma for local development
      console.log('Routing to Prisma handler');
      const { default: prismaHandler } = await import('./cities.prisma.js');
      return prismaHandler(req, res);
    }
  } catch (error) {
    console.error('Router error:', error);
    res.status(500).json({ 
      error: 'Router error', 
      details: error.message 
    });
  }
}
