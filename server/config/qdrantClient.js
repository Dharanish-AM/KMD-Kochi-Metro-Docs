const { QdrantClient } = require("@qdrant/js-client-rest");

const qdrantUrl = process.env.QDRANT_URL;

if (!qdrantUrl) {
  throw new Error("QDRANT_URL environment variable is not defined");
}

const client = new QdrantClient({ url: qdrantUrl });

console.log(
  `Qdrant client initialized with URL: ${qdrantUrl}. Client is ready.`
);

/**
 * Create a collection if it doesn't exist
 */
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
      console.log(`Collection "${collectionName}" does not exist. Creating...`);
      await client.createCollection(collectionName, {
        vectors: {
          size: vectorSize,
          distance: distance,
        },
      });
      console.log(`Collection "${collectionName}" created successfully.`);
    } else {
      console.log(`Collection "${collectionName}" already exists.`);
    }
  } catch (error) {
    console.error(`Error creating collection ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Automatically ensure 'documents' collection exists on startup
 */
(async () => {
  try {
    // Provide a default vector size here or retrieve dynamically from your embeddings
    const defaultVectorSize = 768;
    await createCollectionIfNotExists("documents", defaultVectorSize, "Cosine");
  } catch (err) {
    console.error(
      "Failed to ensure 'documents' collection exists on startup:",
      err
    );
  }
})();

async function viewCollection() {
  const collections = await client.getCollections();
  console.log(collections);

  const points = await client.scroll("documents", { limit: 10 });
  console.log(points);
}

// viewCollection();

module.exports = {
  client,
  createCollectionIfNotExists,
};
