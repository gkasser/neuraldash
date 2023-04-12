import json
import sys
from tensorflow import keras
from keras.models import model_from_json




for application in dir(keras.applications):
    if application[0] == application[0].upper() and application[0] != "_":
        # Charger le modèle à partir du fichier h5
        model = getattr(keras.applications, application)() 
        # Obtenir la définition du modèle au format JSON
        model_json = model.to_json()

        with open(f'models/{application}.json', 'w') as f:
            _ = f.write(json.dumps(json.loads(model_json), indent=4))
