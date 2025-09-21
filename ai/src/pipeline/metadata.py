def extract_metadata(text):
    import spacy
    nlp = spacy.load("en_core_web_sm")
    doc = nlp(text)
    return {
        "dates": [ent.text for ent in doc.ents if ent.label_ == "DATE"],
        "orgs": [ent.text for ent in doc.ents if ent.label_ == "ORG"],
        "money": [ent.text for ent in doc.ents if ent.label_ == "MONEY"]
    }