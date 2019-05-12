import sklearn
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from sklearn.externals import joblib
from sklearn.metrics.pairwise import linear_kernel
import re
import os
from ChatbotBackend.settings import BASE_DIR#, BASE_DIR
import spacy
import sqlite3
from spellchecker import SpellChecker
from pattern.de import parse


nlp = spacy.load("de_core_news_sm")
DATABASE_PATH = os.path.join( BASE_DIR, 'requirements/openthe.db' )
stmt = "SELECT term.word FROM term, synset, term term2 WHERE synset.id = term.synset_id AND term2.synset_id = synset.id AND term2.word = ?"
spell = SpellChecker(language='de')

def process_text( text ):
    annotated = []
    parsed_text = parse(text, lemmata=True)
    doc = parsed_text.split(" ")
    for token in doc:
        pos_tag = token.split("/")[1]
        lemma = token.split("/")[4]
        if pos_tag == ".":
            continue
        current_token = token.split("/")[0]

        if current_token not in spell:
            current_token = spell.correction(current_token)

        if pos_tag[0] == "N":
            current_token = current_token[0].upper()+current_token[1:]
        else:
            current_token = current_token[0].lower()+current_token[1:]

        annotated.append(current_token)

        synonyms = get_synonyms(current_token)
        for synonym in synonyms:
             annotated.append(synonym)

        if lemma.lower() != current_token.lower():
             annotated.append(lemma)

    text = ' '.join(annotated)
    return text


def process_text_spacy( text ):
    annotated = []
    doc = nlp(text)
    for token in doc:
        if token.tag_[0] == "$":
            continue
        current_token = token.text

        if current_token not in spell:
            current_token = spell.correction(token.text)

        if token.tag_[0] == "N":
            current_token = current_token[0].upper()+current_token[1:]
        else:
            current_token = current_token[0].lower()+current_token[1:]

        annotated.append(current_token)

        synonyms = get_synonyms(current_token)
        for synonym in synonyms:
             annotated.append(synonym)

        if token.lemma_ != current_token:
             annotated.append(token.lemma_)

    text = ' '.join(annotated)
    return text

def get_synonyms(word):
    conn = sqlite3.connect(DATABASE_PATH)
    c = conn.cursor()
    c.execute(stmt, (word, ))
    results = []
    for row in c.fetchall():
        results.append(row[0])
    return results

def compute_tfidf( processed_data ):
    print("Compute tfidf...")
    tfidf_vectorizer = TfidfVectorizer( ngram_range=(1,2) )
    tfidf_values = tfidf_vectorizer.fit_transform( processed_data )
    return tfidf_vectorizer, tfidf_values

def serialize_tfidf( tfidf_vectorizer,tfidf_values, tfidf_vectorizer_path, tfidf_values_path  ):
        joblib.dump( tfidf_vectorizer, tfidf_vectorizer_path )
        joblib.dump( tfidf_values, tfidf_values_path )

def compute_answer( question, database , tfidf_vectorizer, tfidf_values ):
    question = process_text(question)
    answers = database['antwort'].tolist()
    text_to_tfidf_transformed = tfidf_vectorizer.transform( [question] )
    cosine_similarities = linear_kernel(text_to_tfidf_transformed, tfidf_values).flatten()
    cosine_similarities_sorted = sorted( cosine_similarities )
    related_doc_index = cosine_similarities.argsort()[-1]
    most_similar = cosine_similarities_sorted[-1]
    if most_similar == 0.0:
        return "Ich verstehe die Frage nicht."
    return answers[related_doc_index]

if __name__ == "__main__":
    a = "Wo finde ich das Informatikum?"
    b = "Wie viele Credits brauche ich pro Semester für die Regelstudienzeit?"
    c = "Wie viele Versuche gibt es für Klausuren?"
    l = [ a, b, c ]
    tfidf_vectorizer, tfidf_values = compute_tfidf( l )
    serialize_tfidf( tfidf_vectorizer,tfidf_values, "tfidf_vectorizer.pkl", "tfidf_values.pkl"  )

    compute_answer( 'Wo Informatikum' )
    compute_answer( 'Credits' )
