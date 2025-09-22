const { QdrantClient } = require("@qdrant/js-client-rest");

const qdrantUrl = process.env.QDRANT_URL;

if (!qdrantUrl) {
  throw new Error("QDRANT_URL environment variable is not defined");
}

const client = new QdrantClient({ url: qdrantUrl });

console.log(`Qdrant client initialized with URL: ${qdrantUrl}. Client is ready.`);

async function createCollectionIfNotExists(
  collectionName,
  vectorSize,
  distance = "Cosine"
) {
  try {
    const collections = await client.getCollections();
    const exists = collections.collections.some(
      (col) => col.name === collectionName
    );
    if (!exists) {
      await client.createCollection(collectionName, {
        vectors: {
          size: vectorSize,
          distance: distance,
        },
      });
    }
  } catch (error) {
    console.error(`Error creating collection ${collectionName}:`, error);
    throw error;
  }
}

module.exports = {
  client,
  createCollectionIfNotExists,
};
