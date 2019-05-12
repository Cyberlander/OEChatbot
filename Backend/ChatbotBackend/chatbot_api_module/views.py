import os
import pandas as pd
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .submodules import chatbot_logic
from ChatbotBackend.settings import BASE_DIR#, BASE_DIR
from sklearn.externals import joblib
# Create your views here.


DATABASE_PATH = os.path.join( BASE_DIR, 'requirements/database.csv' )
DATABASE = pd.read_csv( DATABASE_PATH, delimiter=";", encoding='utf-8' )
TFIDF_VECTORIZER_PATH = os.path.join( BASE_DIR, 'requirements/tfidf_vectorizer.pkl')
TFIDF_VALUES_PATH = os.path.join( BASE_DIR, 'requirements/tfidf_values.pkl')
TFIDF_VECTORIZER = joblib.load( TFIDF_VECTORIZER_PATH )
TFIDF_VALUES = joblib.load( TFIDF_VALUES_PATH )

@api_view(('POST','GET'))
def get_answer( request, format='json' ):
    requestData = request.data
    try:
        # { "frage": "Wo Informatikum?"}
        # { "frage": "Wie viele Versuche gibt es für Klausuren?"}
        question = requestData['frage']
        answer = chatbot_logic.compute_answer( question, DATABASE, TFIDF_VECTORIZER, TFIDF_VALUES )
    except Exception as e:
        return Response( { "Error":"{} {}".format(type(e),e)} )
    return Response( { "antwort": str(answer) } )

@api_view(('POST','GET'))
def train_tfidf( request, format='json' ):
    try:
        fragen = DATABASE['frage'].tolist()
        tfidf_vectorizer, tfidf_values = chatbot_logic.compute_tfidf( fragen )
        chatbot_logic.serialize_tfidf( tfidf_vectorizer, tfidf_values, TFIDF_VECTORIZER_PATH, TFIDF_VALUES_PATH  )
    except Exception as e:
        return Response( { "Error":"{} {}".format(type(e),e)} )
    return Response( { "Message":"TF-IDF successfully trained!"} )

@api_view(('POST', 'GET'))
def crawl_erstsemester_bits( request, format='json' ):
    try:
        print("Crawling process")
    except Exception as e:
        return Response( { "Error":"{} {}".format(type(e),e)} )
    return Response( { "Message":"Erstsemester bits successfully crawled!"} )
