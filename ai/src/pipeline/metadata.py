import re
from typing import Dict, List
import spacy

nlp = spacy.load("en_core_web_sm")

# Regex patterns
TENDER_ID_PATTERN = r"KMRL/PROCITENDER/\d{4}-\d{2}/\d+"
INVOICE_PATTERN = r"INV[- ]?\d+"
AMOUNT_PATTERN = r"(?:₹|Rs\.?)?\s?\d{1,3}(?:,\d{3})*(?:\.\d+)?"
DATE_PATTERN = r"\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b"  # 10-Sep-2025, 10/09/2025

def extract_metadata(text: str) -> Dict[str, List[str]]:
    """Extract essential KMRL fields with high accuracy."""
    
    # Regex extraction
    tender_ids = re.findall(TENDER_ID_PATTERN, text)
    invoice_ids = re.findall(INVOICE_PATTERN, text)
    amounts = re.findall(AMOUNT_PATTERN, text)
    dates = re.findall(DATE_PATTERN, text)
    
    # SpaCy for organizations / vendors / employees
    doc = nlp(text)
    orgs = [ent.text for ent in doc.ents if ent.label_ in ("ORG", "PERSON")]

    return {
        "dates": list(set(dates)),
        "orgs": list(set(orgs)),
        "amounts": list(set(amounts)),
        "tender_ids": tender_ids,
        "invoice_ids": invoice_ids
    }