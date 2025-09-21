def translate_to_english(text):
    from langdetect import detect
    if detect(text) != "en":
        from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
        tokenizer = AutoTokenizer.from_pretrained("google/mt5-small")
        model = AutoModelForSeq2SeqLM.from_pretrained("google/mt5-small")
        inputs = tokenizer(text, return_tensors="pt")
        outputs = model.generate(**inputs)
        return tokenizer.decode(outputs[0], skip_special_tokens=True)
    return text