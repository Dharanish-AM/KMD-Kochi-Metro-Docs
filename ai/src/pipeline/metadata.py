import re
from typing import Dict, List
import spacy
from spacy.tokens import Span

# Load English NER model
nlp = spacy.load("en_core_web_sm")

# Regex patterns
TENDER_ID_PATTERN = r"KMRL/PROCITENDER/\d{4}-\d{2}/\d+"
INVOICE_PATTERN = r"INV[- ]?\d+"
AMOUNT_PATTERN = r"(?:₹|Rs\.?)\s?\d{1,3}(?:,\d{3})*(?:\.\d+)?|\b\d{1,3}(?:,\d{3})+(?:\.\d+)?\b|\b\d+\.\d{2}\b"
DATE_PATTERN = r"\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b"
EMAIL_PATTERN = r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+"
PHONE_PATTERN = r"\b\d{10}\b|\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b"
URL_PATTERN = r"https?://\S+|www\.\S+"


def normalize_amount(amount: str) -> str:
    """Standardize currency format"""
    cleaned = re.sub(r"[₹Rs\. ]", "", amount)
    cleaned = cleaned.replace(",", "")
    try:
        if "." in cleaned:
            value = float(cleaned)
            normalized = f"₹ {value:,.2f}"
        else:
            value = int(cleaned)
            normalized = f"₹ {value:,}"
    except ValueError:
        normalized = f"₹ {amount.strip()}"
    return normalized


def extract_metadata(text: str) -> Dict[str, List[str]]:
    """Extract comprehensive metadata from KMRL documents"""

    # Regex-based extraction
    tender_ids = re.findall(TENDER_ID_PATTERN, text)
    invoice_ids = re.findall(INVOICE_PATTERN, text)
    amounts = [normalize_amount(a) for a in re.findall(AMOUNT_PATTERN, text)]
    dates = re.findall(DATE_PATTERN, text)
    emails = re.findall(EMAIL_PATTERN, text)
    phones = re.findall(PHONE_PATTERN, text)
    urls = re.findall(URL_PATTERN, text)

    # SpaCy-based NER
    doc = nlp(text)
    orgs = [ent.text for ent in doc.ents if ent.label_ == "ORG"]
    gpes = [ent.text for ent in doc.ents if ent.label_ == "GPE"]

    # Optional: Keywords / topics (simple heuristic)
    keywords = []
    department_keywords = [
        "Operations",
        "Maintenance",
        "Engineering",
        "Infrastructure",
        "Electrical",
        "Mechanical",
        "Finance",
        "Accounts",
        "HR",
        "Legal",
        "Compliance",
        "Procurement",
        "Contracts",
        "Corporate Communications",
        "Business Development",
        "Vigilance",
        "Security",
        "IT",
        "Planning",
        "Environment",
        "Sustainability",
        "Customer Relations",
        "Project Management",
    ]
    for kw in department_keywords:
        if re.search(rf"\b{kw}\b", text, re.IGNORECASE):
            keywords.append(kw)

    # Remove duplicates
    def unique(lst):
        return list(set(lst))

    return {
        "tender_ids": tender_ids,
        "invoice_ids": invoice_ids,
        "amounts": unique(amounts),
        "dates": unique(dates),
        "emails": unique(emails),
        "phone_numbers": unique(phones),
        "urls": unique(urls),
        "organizations": unique(orgs),
        "locations": unique(gpes),
        "keywords": unique(keywords),
    }
