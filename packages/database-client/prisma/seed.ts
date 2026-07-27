import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.info('🌱 Seeding Core Data Foundation & INCI Ingredient Knowledge Base...');

  // 1. Create Demo Tenant
  const tenant = await prisma.tenant.upsert({
    where: { subdomain: 'demo' },
    update: {},
    create: {
      name: 'Demo Skincare Brand',
      subdomain: 'demo',
      subscriptionTier: 'ENTERPRISE',
      status: 'ACTIVE',
      configuration: {
        create: {
          brandName: 'Demo Skincare Brand',
          primaryColor: '#000000',
          accentColor: '#4A90E2',
          widgetPosition: 'BOTTOM_RIGHT',
          featureFlags: {
            enableAiAssistant: true,
            enableRoutineTracker: true,
          },
        },
      },
    },
  });

  console.info(`✅ Demo Tenant initialized: ${tenant.name} (${tenant.id})`);

  // 2. Create Default Permissions
  const permissions = [
    { name: 'tenant:config:read', category: 'TENANT', description: 'Read tenant configuration' },
    { name: 'tenant:config:write', category: 'TENANT', description: 'Modify tenant configuration' },
    { name: 'tenant:read', category: 'TENANT', description: 'List and view tenant organizations' },
    { name: 'tenant:write', category: 'TENANT', description: 'Create and update tenant organizations' },
    { name: 'catalog:product:read', category: 'CATALOG', description: 'Read catalog products' },
    { name: 'catalog:product:write', category: 'CATALOG', description: 'Create and update products' },
    { name: 'analytics:summary:read', category: 'ANALYTICS', description: 'Read analytics dashboards' },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm,
    });
  }

  // 3. Create Admin Role for Tenant
  const adminRole = await prisma.role.upsert({
    where: {
      tenantId_name: {
        tenantId: tenant.id,
        name: 'TENANT_ADMIN',
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'TENANT_ADMIN',
      description: 'Full administrative access to brand tenant',
      isSystem: true,
    },
  });

  console.info(`✅ Admin Role initialized: ${adminRole.name} (${adminRole.id})`);

  // 4. Create Demo Administrator User
  const adminUser = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: 'admin@demo.com',
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      roleId: adminRole.id,
      email: 'admin@demo.com',
      passwordHash: '$2b$10$ephX.WvJ7f51Oq.J4tF8vO9/H2Hj/WqF8H/k31VvK03O/Z8j/t6.e',
      firstName: 'Demo',
      lastName: 'Admin',
      isActive: true,
    },
  });

  console.info(`✅ Demo User initialized: ${adminUser.email} (${adminUser.id})`);

  // 5. Create Standard Product Categories
  const categoryNames = ['Cleanser', 'Moisturizer', 'Serum', 'Toner', 'Sunscreen', 'Eye Cream', 'Mask'];
  for (let i = 0; i < categoryNames.length; i++) {
    const name = categoryNames[i];
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    await prisma.productCategory.upsert({
      where: { tenantId_slug: { tenantId: tenant.id, slug } },
      update: {},
      create: {
        tenantId: tenant.id,
        name,
        slug,
        displayOrder: i + 1,
      },
    });
  }

  // 6. Seed Global INCI Ingredient Knowledge Base (20 Sourced INCI Ingredients)
  const realIngredients = [
    {
      inciName: 'Sodium Hyaluronate',
      displayName: 'Hyaluronic Acid (Sodium Salt)',
      description: 'Salt form of hyaluronic acid that binds water to skin cells for deep hydration.',
      casNumber: '9067-32-7',
      category: 'Humectant',
      functions: ['HUMECTANT', 'CONDITIONING_AGENT'],
      waterSoluble: true,
      skinTypes: ['NORMAL', 'DRY', 'OILY', 'COMBINATION', 'SENSITIVE'],
      skinConcerns: ['DEHYDRATION', 'FINE_LINES', 'BARRIER_REPAIR'],
      irritationRisk: 'LOW',
      comedogenicRating: 0,
      aliases: ['HA', 'Hyaluronate Sodium'],
    },
    {
      inciName: 'Niacinamide',
      displayName: 'Niacinamide (Vitamin B3)',
      description: 'Water-soluble vitamin that strengthens skin barrier, improves elasticity, and regulates sebum.',
      casNumber: '98-92-0',
      category: 'Vitamin',
      functions: ['ANTIOXIDANT', 'CONDITIONING_AGENT'],
      waterSoluble: true,
      skinTypes: ['NORMAL', 'DRY', 'OILY', 'COMBINATION', 'SENSITIVE'],
      skinConcerns: ['ACNE', 'HYPERPIGMENTATION', 'OIL_CONTROL', 'REDNESS'],
      irritationRisk: 'LOW',
      comedogenicRating: 0,
      aliases: ['Vitamin B3', 'Nicotinamide'],
    },
    {
      inciName: 'Salicylic Acid',
      displayName: 'Salicylic Acid (BHA)',
      description: 'Lipophilic beta-hydroxy acid that penetrates pores to dissolve sebum and dead skin cells.',
      casNumber: '69-72-7',
      category: 'BHA Exfoliant',
      functions: ['EXFOLIANT'],
      oilSoluble: true,
      skinTypes: ['OILY', 'COMBINATION'],
      skinConcerns: ['ACNE', 'OIL_CONTROL', 'DULLNESS'],
      irritationRisk: 'MEDIUM',
      comedogenicRating: 0,
      aliases: ['BHA', '2-Hydroxybenzoic Acid'],
    },
    {
      inciName: 'Glycolic Acid',
      displayName: 'Glycolic Acid (AHA)',
      description: 'Alpha-hydroxy acid with small molecular size for surface skin exfoliation and brightening.',
      casNumber: '79-14-1',
      category: 'AHA Exfoliant',
      functions: ['EXFOLIANT', 'BUFFERING_AGENT'],
      waterSoluble: true,
      skinTypes: ['NORMAL', 'DRY', 'COMBINATION'],
      skinConcerns: ['HYPERPIGMENTATION', 'DULLNESS', 'FINE_LINES'],
      irritationRisk: 'MEDIUM',
      photosensitivity: true,
      comedogenicRating: 0,
      aliases: ['AHA', 'Hydroacetic Acid'],
    },
    {
      inciName: 'Retinol',
      displayName: 'Retinol (Vitamin A)',
      description: 'Pure Vitamin A derivative that accelerates cellular turnover and stimulates collagen synthesis.',
      casNumber: '68-26-8',
      category: 'Retinoid',
      functions: ['CONDITIONING_AGENT', 'ANTIOXIDANT'],
      oilSoluble: true,
      skinTypes: ['NORMAL', 'DRY', 'OILY', 'COMBINATION'],
      skinConcerns: ['AGING', 'WRINKLES', 'FINE_LINES', 'HYPERPIGMENTATION'],
      irritationRisk: 'HIGH',
      photosensitivity: true,
      comedogenicRating: 0,
      aliases: ['Vitamin A', 'Pure Retinol'],
    },
    {
      inciName: 'Ceramide NP',
      displayName: 'Ceramide NP (Ceramide 3)',
      description: 'Identical lipid molecule to natural skin membrane ceramides, restoring skin barrier integrity.',
      casNumber: '100403-19-8',
      category: 'Lipid',
      functions: ['EMOLLIENT', 'CONDITIONING_AGENT'],
      oilSoluble: true,
      skinTypes: ['DRY', 'SENSITIVE', 'NORMAL'],
      skinConcerns: ['BARRIER_REPAIR', 'DEHYDRATION', 'REDNESS'],
      irritationRisk: 'LOW',
      comedogenicRating: 0,
      aliases: ['Ceramide 3'],
    },
    {
      inciName: 'Glycerin',
      displayName: 'Glycerin',
      description: 'Classic polyol humectant drawing environmental moisture into upper epidermal layers.',
      casNumber: '56-81-5',
      category: 'Humectant',
      functions: ['HUMECTANT', 'SOLVENT'],
      waterSoluble: true,
      skinTypes: ['NORMAL', 'DRY', 'OILY', 'COMBINATION', 'SENSITIVE'],
      skinConcerns: ['DEHYDRATION', 'BARRIER_REPAIR'],
      irritationRisk: 'LOW',
      comedogenicRating: 0,
      aliases: ['Glycerol', 'Propanetriol'],
    },
    {
      inciName: 'Tocopherol',
      displayName: 'Tocopherol (Vitamin E)',
      description: 'Lipid-soluble antioxidant shielding cell membranes from free radical peroxidation.',
      casNumber: '59-02-9',
      category: 'Vitamin E',
      functions: ['ANTIOXIDANT'],
      oilSoluble: true,
      skinTypes: ['NORMAL', 'DRY'],
      skinConcerns: ['AGING', 'BARRIER_REPAIR'],
      irritationRisk: 'LOW',
      comedogenicRating: 2,
      aliases: ['Vitamin E', 'd-alpha-Tocopherol'],
    },
    {
      inciName: 'Ascorbic Acid',
      displayName: 'L-Ascorbic Acid (Vitamin C)',
      description: 'Potent antioxidant active reducing melanin synthesis and neutralizing free radicals.',
      casNumber: '50-81-7',
      category: 'Vitamin C',
      functions: ['ANTIOXIDANT', 'BUFFERING_AGENT'],
      waterSoluble: true,
      skinTypes: ['NORMAL', 'COMBINATION'],
      skinConcerns: ['HYPERPIGMENTATION', 'DARK_SPOTS', 'DULLNESS', 'AGING'],
      irritationRisk: 'MEDIUM',
      comedogenicRating: 0,
      aliases: ['Vitamin C', 'L-Ascorbic Acid'],
    },
    {
      inciName: 'Centella Asiatica Extract',
      displayName: 'Centella Asiatica (Cica) Extract',
      description: 'Botanical extract containing asiaticoside and madecassoside that calms inflammation.',
      casNumber: '84696-21-9',
      category: 'Botanical Extract',
      functions: ['CONDITIONING_AGENT', 'ANTIOXIDANT'],
      waterSoluble: true,
      skinTypes: ['SENSITIVE', 'REDNESS', 'NORMAL', 'DRY'],
      skinConcerns: ['REDNESS', 'ROSACEA', 'BARRIER_REPAIR'],
      irritationRisk: 'LOW',
      comedogenicRating: 0,
      aliases: ['Cica', 'Gotu Kola Extract'],
    },
    {
      inciName: 'Squalane',
      displayName: 'Plant-Derived Squalane',
      description: 'Hydrogenated, non-comedogenic hydrocarbon oil resembling natural sebum.',
      casNumber: '111-01-3',
      category: 'Emollient',
      functions: ['EMOLLIENT'],
      oilSoluble: true,
      skinTypes: ['DRY', 'NORMAL', 'COMBINATION', 'SENSITIVE'],
      skinConcerns: ['DEHYDRATION', 'BARRIER_REPAIR'],
      irritationRisk: 'LOW',
      comedogenicRating: 1,
      aliases: ['Phytosqualane'],
    },
    {
      inciName: 'Panthenol',
      displayName: 'Panthenol (Pro-Vitamin B5)',
      description: 'Pro-vitamin B5 acting as both humectant and skin repair agent.',
      casNumber: '81-13-0',
      category: 'Pro-Vitamin B5',
      functions: ['HUMECTANT', 'CONDITIONING_AGENT'],
      waterSoluble: true,
      skinTypes: ['SENSITIVE', 'DRY', 'NORMAL'],
      skinConcerns: ['BARRIER_REPAIR', 'REDNESS', 'DEHYDRATION'],
      irritationRisk: 'LOW',
      comedogenicRating: 0,
      aliases: ['Pro-Vitamin B5', 'D-Panthenol'],
    },
    {
      inciName: 'Azelaic Acid',
      displayName: 'Azelaic Acid',
      description: 'Dicarboxylic acid with anti-inflammatory and antibacterial properties against acne and rosacea.',
      casNumber: '123-99-9',
      category: 'Dermatological Active',
      functions: ['ANTIOXIDANT', 'CONDITIONING_AGENT'],
      waterSoluble: false,
      skinTypes: ['OILY', 'SENSITIVE', 'COMBINATION'],
      skinConcerns: ['ACNE', 'ROSACEA', 'REDNESS', 'HYPERPIGMENTATION'],
      irritationRisk: 'LOW',
      comedogenicRating: 0,
      aliases: ['Nonanedioic Acid'],
    },
    {
      inciName: 'Zinc PCA',
      displayName: 'Zinc PCA',
      description: 'Zinc salt of L-PCA regulating sebaceous gland activity and targeting acne microbes.',
      casNumber: '15454-75-8',
      category: 'Mineral Salt',
      functions: ['HUMECTANT', 'CONDITIONING_AGENT'],
      waterSoluble: true,
      skinTypes: ['OILY', 'COMBINATION'],
      skinConcerns: ['OIL_CONTROL', 'ACNE'],
      irritationRisk: 'LOW',
      comedogenicRating: 0,
      aliases: ['Zinc L-PCA'],
    },
    {
      inciName: 'Allantoin',
      displayName: 'Allantoin',
      description: 'Soothing active derived from comfrey that promotes skin healing and cell proliferation.',
      casNumber: '97-59-6',
      category: 'Skin Protectant',
      functions: ['CONDITIONING_AGENT'],
      waterSoluble: true,
      skinTypes: ['SENSITIVE', 'DRY', 'NORMAL'],
      skinConcerns: ['REDNESS', 'BARRIER_REPAIR'],
      irritationRisk: 'LOW',
      comedogenicRating: 0,
      aliases: ['Glyoxyldiureide'],
    },
    {
      inciName: 'Bisabolol',
      displayName: 'alpha-Bisabolol',
      description: 'Active monocyclic sesquiterpene alcohol derived from Chamomile calming cutaneous irritation.',
      casNumber: '515-69-5',
      category: 'Active Component',
      functions: ['CONDITIONING_AGENT', 'FRAGRANCE'],
      oilSoluble: true,
      skinTypes: ['SENSITIVE', 'NORMAL', 'DRY'],
      skinConcerns: ['REDNESS', 'ROSACEA'],
      irritationRisk: 'LOW',
      comedogenicRating: 0,
      aliases: ['Levomenol', 'Chamomile Active'],
    },
    {
      inciName: 'Madecassoside',
      displayName: 'Madecassoside',
      description: 'Isolated active triterpenoid glycoside from Centella Asiatica with intense repair properties.',
      casNumber: '34540-22-2',
      category: 'Active Triterpenoid',
      functions: ['ANTIOXIDANT', 'CONDITIONING_AGENT'],
      waterSoluble: true,
      skinTypes: ['SENSITIVE', 'DRY', 'REDNESS'],
      skinConcerns: ['BARRIER_REPAIR', 'REDNESS', 'ROSACEA'],
      irritationRisk: 'LOW',
      comedogenicRating: 0,
      aliases: ['Madecassol'],
    },
    {
      inciName: 'Camellia Sinensis Leaf Extract',
      displayName: 'Green Tea Leaf Extract',
      description: 'Polyphenol-rich extract rich in EGCG providing anti-inflammatory antioxidant protection.',
      casNumber: '84650-60-2',
      category: 'Botanical Extract',
      functions: ['ANTIOXIDANT', 'CONDITIONING_AGENT'],
      waterSoluble: true,
      skinTypes: ['OILY', 'COMBINATION', 'SENSITIVE', 'NORMAL'],
      skinConcerns: ['OIL_CONTROL', 'ACNE', 'AGING', 'REDNESS'],
      irritationRisk: 'LOW',
      comedogenicRating: 0,
      aliases: ['Green Tea Extract', 'EGCG Extract'],
    },
    {
      inciName: 'Caprylic/Capric Triglyceride',
      displayName: 'Caprylic/Capric Triglyceride',
      description: 'Lightweight ester derived from coconut oil and glycerin supplying skin-smoothing emolliency.',
      casNumber: '73398-61-5',
      category: 'Emollient',
      functions: ['EMOLLIENT', 'SOLVENT'],
      oilSoluble: true,
      skinTypes: ['NORMAL', 'DRY'],
      skinConcerns: ['DEHYDRATION'],
      irritationRisk: 'LOW',
      comedogenicRating: 1,
      aliases: ['MCT Oil', 'Fractionated Coconut Oil'],
    },
    {
      inciName: 'Dimethicone',
      displayName: 'Dimethicone (Polydimethylsiloxane)',
      description: 'Fluid silicone polymer forming a breathable protective barrier to prevent TEWL.',
      casNumber: '9006-65-9',
      category: 'Silicone Polymer',
      functions: ['OCCLUSIVE', 'EMOLLIENT', 'FILM_FORMER'],
      oilSoluble: true,
      skinTypes: ['NORMAL', 'DRY', 'SENSITIVE'],
      skinConcerns: ['BARRIER_REPAIR', 'DEHYDRATION'],
      irritationRisk: 'LOW',
      comedogenicRating: 1,
      aliases: ['Polydimethylsiloxane', 'PDMS'],
    },
  ];

  for (const item of realIngredients) {
    const { aliases, ...ingData } = item;
    await prisma.ingredient.upsert({
      where: { inciName: ingData.inciName },
      update: {},
      create: {
        ...ingData,
        aliases: {
          create: aliases.map((alias) => ({ alias })),
        },
      },
    });
  }

  console.info(`✅ Seeded ${realIngredients.length} Sourced INCI Ingredients into Knowledge Base.`);
  console.info('🌱 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
