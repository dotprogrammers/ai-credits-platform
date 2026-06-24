import { PrismaClient, ProviderType } from "@prisma/client";

const prisma = new PrismaClient();

const PROVIDERS = [
  {
    type: ProviderType.OPENAI,
    name: "openai",
    displayName: "OpenAI",
    logoUrl: "/images/providers/openai.svg",
    description: "Creator of GPT-4, GPT-4 Turbo, and DALL-E. The leading provider of large language models and AI APIs.",
    websiteUrl: "https://openai.com",
    products: [
      {
        name: "OpenAI GPT-4 Credits",
        slug: "openai-gpt4-credits",
        faceValueUsd: 100,
        sellPriceUsd: 92.5,
        creditUnit: "credits",
        creditAmount: 100,
        metadata: { models: ["gpt-4", "gpt-4-turbo", "gpt-4o"], contextWindow: "128k" },
      },
      {
        name: "OpenAI GPT-3.5 Credits",
        slug: "openai-gpt35-credits",
        faceValueUsd: 50,
        sellPriceUsd: 44.0,
        creditUnit: "credits",
        creditAmount: 50,
        metadata: { models: ["gpt-3.5-turbo", "gpt-3.5-turbo-16k"], contextWindow: "16k" },
      },
      {
        name: "OpenAI DALL-E Credits",
        slug: "openai-dalle-credits",
        faceValueUsd: 25,
        sellPriceUsd: 22.75,
        creditUnit: "credits",
        creditAmount: 25,
        metadata: { models: ["dall-e-3", "dall-e-2"], type: "image-generation" },
      },
      {
        name: "OpenAI Embedding Credits",
        slug: "openai-embedding-credits",
        faceValueUsd: 10,
        sellPriceUsd: 9.1,
        creditUnit: "credits",
        creditAmount: 10,
        metadata: { models: ["text-embedding-3-small", "text-embedding-3-large"], type: "embeddings" },
      },
    ],
  },
  {
    type: ProviderType.ANTHROPIC,
    name: "anthropic",
    displayName: "Anthropic",
    logoUrl: "/images/providers/anthropic.svg",
    description: "Creator of Claude, a next-generation AI assistant known for thoughtful, detailed responses and advanced reasoning.",
    websiteUrl: "https://anthropic.com",
    products: [
      {
        name: "Anthropic Claude Opus Credits",
        slug: "anthropic-claude-opus-credits",
        faceValueUsd: 150,
        sellPriceUsd: 138.0,
        creditUnit: "credits",
        creditAmount: 150,
        metadata: { models: ["claude-3-opus-20240229"], contextWindow: "200k" },
      },
      {
        name: "Anthropic Claude Sonnet Credits",
        slug: "anthropic-claude-sonnet-credits",
        faceValueUsd: 75,
        sellPriceUsd: 68.25,
        creditUnit: "credits",
        creditAmount: 75,
        metadata: { models: ["claude-3-sonnet-20240229", "claude-3.5-sonnet"], contextWindow: "200k" },
      },
      {
        name: "Anthropic Claude Haiku Credits",
        slug: "anthropic-claude-haiku-credits",
        faceValueUsd: 20,
        sellPriceUsd: 17.8,
        creditUnit: "credits",
        creditAmount: 20,
        metadata: { models: ["claude-3-haiku-20240307"], contextWindow: "200k" },
      },
    ],
  },
  {
    type: ProviderType.GOOGLE,
    name: "google",
    displayName: "Google AI",
    logoUrl: "/images/providers/google.svg",
    description: "Google's AI platform offering Gemini models, PaLM, and Vertex AI for enterprise-grade AI applications.",
    websiteUrl: "https://ai.google",
    products: [
      {
        name: "Google Gemini Pro Credits",
        slug: "google-gemini-pro-credits",
        faceValueUsd: 80,
        sellPriceUsd: 73.6,
        creditUnit: "credits",
        creditAmount: 80,
        metadata: { models: ["gemini-pro", "gemini-1.5-pro"], contextWindow: "1M" },
      },
      {
        name: "Google Gemini Ultra Credits",
        slug: "google-gemini-ultra-credits",
        faceValueUsd: 200,
        sellPriceUsd: 184.0,
        creditUnit: "credits",
        creditAmount: 200,
        metadata: { models: ["gemini-ultra"], contextWindow: "1M" },
      },
      {
        name: "Google PaLM Credits",
        slug: "google-palm-credits",
        faceValueUsd: 40,
        sellPriceUsd: 36.0,
        creditUnit: "credits",
        creditAmount: 40,
        metadata: { models: ["palm-2", "text-bison"], contextWindow: "32k" },
      },
    ],
  },
  {
    type: ProviderType.MISTRAL,
    name: "mistral",
    displayName: "Mistral AI",
    logoUrl: "/images/providers/mistral.svg",
    description: "European AI leader offering open-weight and commercial models with strong multilingual capabilities.",
    websiteUrl: "https://mistral.ai",
    products: [
      {
        name: "Mistral Large Credits",
        slug: "mistral-large-credits",
        faceValueUsd: 60,
        sellPriceUsd: 54.6,
        creditUnit: "credits",
        creditAmount: 60,
        metadata: { models: ["mistral-large-latest"], contextWindow: "128k" },
      },
      {
        name: "Mistral Medium Credits",
        slug: "mistral-medium-credits",
        faceValueUsd: 30,
        sellPriceUsd: 27.0,
        creditUnit: "credits",
        creditAmount: 30,
        metadata: { models: ["mistral-medium-latest"], contextWindow: "32k" },
      },
      {
        name: "Mistral Small Credits",
        slug: "mistral-small-credits",
        faceValueUsd: 15,
        sellPriceUsd: 13.2,
        creditUnit: "credits",
        creditAmount: 15,
        metadata: { models: ["mistral-small-latest"], contextWindow: "32k" },
      },
    ],
  },
  {
    type: ProviderType.META,
    name: "meta",
    displayName: "Meta AI",
    logoUrl: "/images/providers/meta.svg",
    description: "Open-source Llama models available for commercial use, offering flexibility and transparency in AI deployment.",
    websiteUrl: "https://ai.meta.com",
    products: [
      {
        name: "Meta Llama 3 70B Credits",
        slug: "meta-llama3-70b-credits",
        faceValueUsd: 45,
        sellPriceUsd: 40.5,
        creditUnit: "credits",
        creditAmount: 45,
        metadata: { models: ["llama-3-70b", "llama-3.1-70b"], contextWindow: "128k" },
      },
      {
        name: "Meta Llama 3 8B Credits",
        slug: "meta-llama3-8b-credits",
        faceValueUsd: 15,
        sellPriceUsd: 13.5,
        creditUnit: "credits",
        creditAmount: 15,
        metadata: { models: ["llama-3-8b", "llama-3.1-8b"], contextWindow: "128k" },
      },
    ],
  },
  {
    type: ProviderType.COHERE,
    name: "cohere",
    displayName: "Cohere",
    logoUrl: "/images/providers/cohere.svg",
    description: "Enterprise AI platform specializing in language understanding, generation, and semantic search.",
    websiteUrl: "https://cohere.com",
    products: [
      {
        name: "Cohere Command R+ Credits",
        slug: "cohere-command-rplus-credits",
        faceValueUsd: 55,
        sellPriceUsd: 49.5,
        creditUnit: "credits",
        creditAmount: 55,
        metadata: { models: ["command-r-plus"], contextWindow: "128k" },
      },
      {
        name: "Cohere Command R Credits",
        slug: "cohere-command-r-credits",
        faceValueUsd: 25,
        sellPriceUsd: 22.5,
        creditUnit: "credits",
        creditAmount: 25,
        metadata: { models: ["command-r"], contextWindow: "128k" },
      },
      {
        name: "Cohere Embed Credits",
        slug: "cohere-embed-credits",
        faceValueUsd: 10,
        sellPriceUsd: 9.0,
        creditUnit: "credits",
        creditAmount: 10,
        metadata: { models: ["embed-english-v3.0", "embed-multilingual-v3.0"], type: "embeddings" },
      },
    ],
  },
];

export async function seedProviders() {
  console.log("Seeding providers and credit products...");

  const allProducts: Record<string, string> = {};

  for (const provider of PROVIDERS) {
    const existing = await prisma.provider.findFirst({ where: { type: provider.type } });

    const created = existing
      ? await prisma.provider.update({
          where: { id: existing.id },
          data: {
            displayName: provider.displayName,
            logoUrl: provider.logoUrl,
            description: provider.description,
            websiteUrl: provider.websiteUrl,
            isActive: true,
          },
        })
      : await prisma.provider.create({
          data: {
            type: provider.type,
            name: provider.name,
            displayName: provider.displayName,
            logoUrl: provider.logoUrl,
            description: provider.description,
            websiteUrl: provider.websiteUrl,
            isActive: true,
          },
        });

    for (const product of provider.products) {
      const createdProduct = await prisma.creditProduct.upsert({
        where: { slug: product.slug },
        update: {
          name: product.name,
          faceValueUsd: product.faceValueUsd,
          sellPriceUsd: product.sellPriceUsd,
          creditUnit: product.creditUnit,
          creditAmount: product.creditAmount,
          metadata: product.metadata,
          isActive: true,
        },
        create: {
          providerId: created.id,
          name: product.name,
          slug: product.slug,
          providerType: provider.type,
          faceValueUsd: product.faceValueUsd,
          sellPriceUsd: product.sellPriceUsd,
          creditUnit: product.creditUnit,
          creditAmount: product.creditAmount,
          metadata: product.metadata,
          isActive: true,
        },
      });
      allProducts[product.slug] = createdProduct.id;
    }
  }

  const productCount = Object.keys(allProducts).length;
  console.log(`Created ${PROVIDERS.length} providers with ${productCount} credit products`);

  return allProducts;
}
