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

async function viewAllVectors(collectionName = "documents") {
  try {
    let allPoints = [];
    let offset = null;

    while (true) {
      const { points, next_page_offset } = await client.scroll(collectionName, {
        limit: 100,  // fetch 100 vectors at a time
        offset,
      });

      allPoints = allPoints.concat(points);
      if (!next_page_offset) break;
      offset = next_page_offset;
    }

    console.log(`Total points fetched: ${allPoints.length}`);
    console.log(allPoints); // array of points with id, vector, payload
  } catch (err) {
    console.error("Error fetching vectors from Qdrant:", err);
  }
}

// viewAllVectors();

// async function deleteAllExcept(documentIdToKeep) {
//   try {
//     // Step 1: Get all vectors
//     let allPoints = [];
//     let offset = null;

//     while (true) {
//       const { points, next_page_offset } = await client.scroll("documents", {
//         limit: 100,
//         offset,
//       });

//       allPoints = allPoints.concat(points);
//       if (!next_page_offset) break;
//       offset = next_page_offset;
//     }

//     console.log(`Total points fetched: ${allPoints.length}`);

//     // Step 2: Collect IDs to delete
//     const idsToDelete = allPoints
//       .filter((p) => p.payload?.documentId !== documentIdToKeep)
//       .map((p) => p.id);

//     if (idsToDelete.length === 0) {
//       console.log("No vectors to delete. Exiting.");
//       return;
//     }

//     // Step 3: Delete vectors
//     await client.delete("documents", { points: idsToDelete });
//     console.log(`Deleted ${idsToDelete.length} vectors. Kept document ${documentIdToKeep}`);
//   } catch (err) {
//     console.error("Error cleaning Qdrant collection:", err);
//   }
// }

// deleteAllExcept("68d3fcf7128755f94b6fad18");

module.exports = {
  client,
  createCollectionIfNotExists,
};
