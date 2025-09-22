from transformers import pipeline
import numpy as np
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize zero-shot classifier once
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

# KMRL Departments
KMRL_DEPARTMENTS = [
    "Operations & Maintenance",
    "Engineering & Infrastructure",
    "Electrical & Mechanical",
    "Finance & Accounts",
    "Human Resources",
    "Legal & Compliance",
    "Procurement & Contracts",
    "Corporate Communications",
    "Business Development",
    "Vigilance & Security",
    "Information Technology & Systems",
    "Planning & Development",
    "Environment & Sustainability",
    "Customer Relations & Services",
    "Project Management",
]

# Department-specific keywords for high-precision overrides
DEPT_KEYWORDS = {
    "Operations & Maintenance": [
        "maintenance",
        "operations",
        "operation",
        "log",
        "incident",
        "breakdown",
        "inspection",
        "schedule",
        "SOP",
        "checklist",
        "maintenance report",
        "track",
        "rolling stock",
        "train operation",
        "service disruption",
        "O&M",
    ],
    "Engineering & Infrastructure": [
        "design",
        "infrastructure",
        "construction",
        "civil",
        "structural",
        "project plan",
        "drawing",
        "site",
        "foundation",
        "alignment",
        "viaduct",
        "pier",
        "bridge",
        "engineering",
        "survey",
        "estimate",
        "project execution",
        "work order",
    ],
    "Electrical & Mechanical": [
        "electrical",
        "mechanical",
        "E&M",
        "traction",
        "substation",
        "HVAC",
        "lift",
        "escalator",
        "generator",
        "power supply",
        "cable",
        "lighting",
        "transformer",
        "panel",
        "motor",
        "earthing",
        "switchgear",
        "UPS",
    ],
    "Finance & Accounts": [
        "budget",
        "financial",
        "accounts",
        "audit",
        "invoice",
        "expense",
        "payment",
        "bill",
        "receipt",
        "voucher",
        "fund",
        "reimbursement",
        "salary",
        "PF",
        "tax",
        "GST",
        "ledger",
        "balance sheet",
        "financial statement",
    ],
    "Human Resources": [
        "HR",
        "human resource",
        "policy",
        "leave",
        "training",
        "employee",
        "recruitment",
        "appointment",
        "promotion",
        "transfer",
        "memos",
        "appraisal",
        "attendance",
        "payroll",
        "disciplinary",
        "grievance",
        "welfare",
        "retirement",
        "resignation",
    ],
    "Legal & Compliance": [
        "legal",
        "court",
        "compliance",
        "RTI",
        "license",
        "statutory",
        "regulation",
        "notice",
        "litigation",
        "agreement",
        "arbitration",
        "law",
        "affidavit",
        "contract law",
        "NOC",
        "legal opinion",
        "show cause",
        "legal notice",
    ],
    "Procurement & Contracts": [
        "tender",
        "invoice",
        "purchase order",
        "BOQ",
        "vendor",
        "contract",
        "procurement",
        "quotation",
        "bid",
        "RFP",
        "RFQ",
        "e-tender",
        "work order",
        "agreement",
        "bidder",
        "purchase",
        "supply",
        "materials",
        "PO",
        "LC",
    ],
    "Corporate Communications": [
        "press release",
        "media",
        "PR",
        "newsletter",
        "communication",
        "event",
        "publicity",
        "advertisement",
        "branding",
        "social media",
        "campaign",
        "website",
        "announcement",
        "stakeholder",
        "press",
        "news",
    ],
    "Business Development": [
        "business",
        "development",
        "revenue",
        "PPP",
        "partnership",
        "expansion",
        "commercial",
        "opportunity",
        "market",
        "proposal",
        "growth",
        "collaboration",
        "MoU",
        "franchise",
        "retail",
        "advertising",
        "lease",
    ],
    "Vigilance & Security": [
        "security",
        "vigilance",
        "incident",
        "CCTV",
        "theft",
        "loss",
        "investigation",
        "disciplinary",
        "complaint",
        "surveillance",
        "patrolling",
        "access control",
        "guard",
        "safety",
        "breach",
        "enquiry",
        "vigilance report",
    ],
    "Information Technology & Systems": [
        "IT",
        "information technology",
        "software",
        "hardware",
        "system",
        "network",
        "server",
        "database",
        "website",
        "application",
        "ERP",
        "SAP",
        "email",
        "cybersecurity",
        "IT support",
        "ticket",
        "LAN",
        "WAN",
        "data center",
    ],
    "Planning & Development": [
        "planning",
        "development",
        "master plan",
        "feasibility",
        "DPR",
        "survey",
        "expansion",
        "study",
        "urban planning",
        "proposal",
        "project planning",
        "land use",
        "forecast",
        "strategic",
        "roadmap",
    ],
    "Environment & Sustainability": [
        "environment",
        "sustainability",
        "EIA",
        "green",
        "pollution",
        "waste",
        "emission",
        "CSR",
        "tree",
        "water",
        "energy saving",
        "solar",
        "rainwater",
        "environmental clearance",
        "recycling",
        "environmental impact",
        "eco-friendly",
    ],
    "Customer Relations & Services": [
        "customer",
        "complaint",
        "feedback",
        "service",
        "ticket",
        "helpline",
        "support",
        "enquiry",
        "lost and found",
        "passenger",
        "public",
        "grievance",
        "suggestion",
        "customer care",
        "fare",
        "concession",
        "service quality",
    ],
    "Project Management": [
        "project",
        "milestone",
        "timeline",
        "Gantt",
        "progress",
        "status",
        "monitoring",
        "update",
        "coordination",
        "review",
        "resource",
        "risk",
        "project report",
        "completion",
        "deliverable",
        "kickoff",
        "PMP",
    ],
}


def classify_doc(text: str) -> dict:
    """
    Classify text into KMRL department with hybrid approach.
    - First, check for high-confidence keywords
    - Fallback to zero-shot classification for general cases
    Returns primary department and full scores.
    """
    if not text.strip():
        logger.info("Empty text received; returning Unknown.")
        return {"primary_department": "Unknown", "labels": [], "scores": []}

    text_lower = text.lower()

    # Check for keyword matches first
    matched_dept = None
    for dept, keywords in DEPT_KEYWORDS.items():
        if any(k.lower() in text_lower for k in keywords):
            matched_dept = dept
            logger.info(f"Keyword match found for department: {dept}")
            break

    # Run zero-shot classification once
    result = classifier(text, candidate_labels=KMRL_DEPARTMENTS)
    scores = result["scores"]
    labels = result["labels"]

    # If keyword matched, boost its score
    if matched_dept:
        if matched_dept in labels:
            boost_index = labels.index(matched_dept)
            scores[boost_index] += 0.2
            logger.info(
                f"Boosted score for {matched_dept} by 0.2 due to keyword match."
            )
        else:
            logger.warning(
                f"Matched department '{matched_dept}' not found in classifier labels."
            )

    primary_department = labels[np.argmax(scores)]

    logger.info(f"Primary department classified as: {primary_department}")

    return {
        "primary_department": primary_department,
        "labels": labels,
        "scores": scores,
    }
