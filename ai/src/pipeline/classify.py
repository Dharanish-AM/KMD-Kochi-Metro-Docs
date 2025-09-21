def classify_doc(text):
    from transformers import pipeline
    classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
    labels = ["contract", "report", "memo", "invoice"]
    result = classifier(text, candidate_labels=labels)
    return result