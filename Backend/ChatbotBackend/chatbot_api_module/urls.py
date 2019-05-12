from django.urls import path
from . import views

urlpatterns = [
    path(r'get_answer/', views.get_answer, name="get_answer" ),
    path(r'train_tfidf/', views.train_tfidf, name="train_tfidf" ),
    path(r'crawl_erstsemester_bits/', views.crawl_erstsemester_bits, name="crawl_erstsemester_bits" ),
]
