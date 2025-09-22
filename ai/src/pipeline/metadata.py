import re
from typing import Dict, List
import spacy

nlp = spacy.load("en_core_web_sm")

# Regex patterns
TENDER_ID_PATTERN = r"KMRL/PROCITENDER/\d{4}-\d{2}/\d+"
INVOICE_PATTERN = r"INV[- ]?\d+"
AMOUNT_PATTERN = r"(?:₹|Rs\.?)\s?\d{1,3}(?:,\d{3})*(?:\.\d+)?|\b\d{1,3}(?:,\d{3})+(?:\.\d+)?\b|\b\d+\.\d{2}\b"
DATE_PATTERN = r"\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b"  # 10-Sep-2025, 10/09/2025

def normalize_amount(amount: str) -> str:
    # Remove spaces and currency symbols
    cleaned = re.sub(r"[₹Rs\. ]", "", amount)
    # Remove commas
    cleaned = cleaned.replace(",", "")
    try:
        # If there is a decimal part
        if "." in cleaned:
            value = float(cleaned)
            normalized = f"₹ {value:,.2f}"
        else:
            value = int(cleaned)
            normalized = f"₹ {value:,}"
    except ValueError:
        # If conversion fails, return original with ₹ prefix
        normalized = f"₹ {amount.strip()}"
    return normalized

def extract_metadata(text: str) -> Dict[str, List[str]]:
    """Extract essential KMRL fields with high accuracy."""
    
    # Regex extraction
    tender_ids = re.findall(TENDER_ID_PATTERN, text)
    invoice_ids = re.findall(INVOICE_PATTERN, text)
    amounts = re.findall(AMOUNT_PATTERN, text)
    # Normalize amounts
    amounts = [normalize_amount(a) for a in amounts]
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