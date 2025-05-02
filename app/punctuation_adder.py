from transformers import pipeline

def add_punctuation(text):
    punct_model = pipeline(
        "text2text-generation",
        model="oliverguhr/fullstop-punctuation-multilang-large"
    )
    result = punct_model(text)
    return result[0]['generated_text']