# GENESIS

Powered by Django and scikit-learn in the backend and React / Semantic-UI in the frontend.

## Installation

Ensure you have python 3 and nodejs / npm installed. We used node 10.15.3 for development.

Installation of backend dependencies:

`cd ./Backend/ChatbotBackend && pip3 install -r requirements.txt`

Installation of frontend dependencies:

`cd ./frontend && npm install`

## Running

We recommend to use the `startup-frontend.sh` and `startup-backend.sh` scripts in 2 different shell windows.

The frontend was bootstrapped using [create react app](https://github.com/facebook/create-react-app). You can find more documentation in the README.md in the frontend directory.

## Future work

- Erstsemester Bits einpflegen / automatisch durchsuchen
- Mehr Fragen / Antworten
- Vector Space Model durch Document-Embeddings ersetzen (siehe Word2Vec, Doc2Vec)
- Fragenkatalog der OE in die Datenbank einpflegen
- Optional: Anbindung an Sprachassistent (Beispielsweise Alexa)
