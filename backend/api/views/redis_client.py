import numpy as np
import pymupdf
from redis import Redis

from .client import client
from sentence_transformers import SentenceTransformer

vector_redis = Redis(host="localhost", port=6379, decode_responses=False)


def embed_chunks(chunks, batch_size):
    try:
        model = SentenceTransformer("all-MiniLM-L6-v2")

        embeddings = model.encode(chunks, batch_size=batch_size, show_progress_bar=True)
        print(embeddings)
        return embeddings
    except Exception as e:
        print(f"Error in batch embedding: {e}")


def embed_chunk(text):
    try:
        model = SentenceTransformer("all-MiniLM-L6-v2")

        embedding = model.encode(text, show_progress_bar=True)
        return embedding
    except Exception as e:
        print(f"Error in batch embedding: {e}")


def store_chunk(i, text, embedding):
    vector_redis.hset(
        f"chunk:{i}",
        mapping={
            "text": text,
            "embedding": np.array(embedding, dtype=np.float32).tobytes(),
        },
    )


def extract_chunks(bytes):
    doc = pymupdf.Document(stream=bytes)
    grouped_chunks = []

    for page in doc:
        blocks = page.get_text("dict")["blocks"]
        items = []

        for block in blocks:
            if block["type"] == 0:  # text
                for line in block["lines"]:
                    line_text = ""
                    min_x = float("inf")
                    min_y = float("inf")

                    for span in line["spans"]:
                        line_text += span["text"] + " "
                        min_x = min(min_x, span["bbox"][0])
                        min_y = min(min_y, span["bbox"][1])

                    if line_text.strip():
                        items.append((min_y, min_x, line_text.strip()))

        # Sort by y, then x to approximate natural reading order
        items.sort()

        # Group nearby items (e.g., within 30 pixels vertically)
        chunk = []
        last_y = None

        for y, x, text in items:
            if last_y is None or abs(y - last_y) < 30:
                chunk.append(text)
            else:
                grouped_chunks.append(" | ".join(chunk))
                chunk = [text]
            last_y = y

        if chunk:
            grouped_chunks.append(" | ".join(chunk))

    return grouped_chunks
