from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

model = SentenceTransformer("all-mpnet-base-v2")
index = faiss.IndexFlatL2(768)  # embedding size

def embed_text(text_list):
    embeddings = model.encode(text_list, convert_to_numpy=True)
    index.add(embeddings)
    return embeddings