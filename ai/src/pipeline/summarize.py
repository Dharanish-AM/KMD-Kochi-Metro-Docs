from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.llms import HuggingFacePipeline
from transformers import pipeline
import torch

# ===============================
# Load fast summarization model
device = 0 if torch.cuda.is_available() else -1
summarization_pipeline = pipeline(
    "summarization",
    model="sshleifer/distilbart-cnn-12-6",
    device=device
)
llm = HuggingFacePipeline(pipeline=summarization_pipeline)

# ===============================
# Prompt template
template = """
You are an AI assistant summarizing KMRL documents.
Content:
{text}

Write a concise, meaningful summary including key points.
"""
prompt = PromptTemplate(input_variables=["text"], template=template)

# Chain
chain = LLMChain(llm=llm, prompt=prompt)

# ===============================
# Text splitting function
def split_text(text, chunk_size=500, overlap=50):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=overlap,
        separators=["\n\n", "\n", " "]
    )
    return splitter.split_text(text)

# ===============================
# Summarization function
def summarize_text(text: str):
    chunks = split_text(text)
    summaries = []

    for chunk in chunks:
        summary = chain.run(text=chunk)
        summaries.append(summary)

    # Combine chunk summaries
    final_summary = " ".join(summaries)
    return final_summary

