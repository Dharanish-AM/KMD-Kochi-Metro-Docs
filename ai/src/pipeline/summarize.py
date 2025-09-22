from transformers import pipeline
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def summarize_text(text):
    return summarizer(text, max_length=200, min_length=50, do_sample=False)[0]['summary_text']