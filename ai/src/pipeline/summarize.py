from transformers import pipeline
import re

# Faster summarization model
t5_summarizer = pipeline(
    "summarization", model="t5-small", device=0  # GPU / MPS acceleration if available
)


def extractive_summary(text, sentences_count=5):
    # Simple sentence splitter using regex
    sentences = re.split(r"(?<=[.!?]) +", text)
    return " ".join(sentences[:sentences_count])


def summarize_text(text):
    max_chunk = 800
    input_length = len(text.split())

    # Dynamically set max tokens: ~50% of input length, capped between 30–200
    dynamic_max = min(200, max(30, int(input_length * 0.5)))

    if len(text) < max_chunk:
        summary = t5_summarizer(
            text,
            max_new_tokens=dynamic_max,  # dynamic instead of fixed
            do_sample=False,
        )[0]["summary_text"]
        return summary
    else:
        reduced_text = extractive_summary(text, sentences_count=10)
        inputs = [
            reduced_text[i : i + max_chunk]
            for i in range(0, len(reduced_text), max_chunk)
        ]
        summaries = [
            t5_summarizer(chunk, max_new_tokens=dynamic_max, do_sample=False)[0][
                "summary_text"
            ]
            for chunk in inputs
        ]
        return t5_summarizer(
            " ".join(summaries),
            max_new_tokens=dynamic_max,
            do_sample=False,
        )[0]["summary_text"]
