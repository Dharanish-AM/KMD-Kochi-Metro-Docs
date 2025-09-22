from transformers import pipeline

summarizer = pipeline("summarization", model="facebook/bart-large-cnn")


def summarize_text(text, max_chunk_tokens=500, overlap=50):
    """
    Summarize text by splitting into smaller chunks if necessary.
    """
    words = text.split()
    chunks = []
    for i in range(0, len(words), max_chunk_tokens - overlap):
        chunk = " ".join(words[i : i + max_chunk_tokens])
        chunks.append(chunk)

    summaries = []
    for chunk in chunks:
        try:
            input_length = len(chunk.split())
            # Dynamic limits
            max_len = min(200, int(input_length * 0.8))
            min_len = max(10, int(input_length * 0.3))

            summary = summarizer(
                chunk, max_length=max_len, min_length=min_len, do_sample=False
            )[0]["summary_text"]
            summaries.append(summary)
        except Exception as e:
            summaries.append(f"[Error summarizing chunk: {e}]")

    return " ".join(summaries)
