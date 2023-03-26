import json
import tensorflow as tf
import inspect

if __name__ == "__main__":
    dico = {}
    base = tf.keras.layers
    for elt in dir(base):
        if elt[0] != "_":
            cl = getattr(base, elt)
            if "keras.layers" in str(cl):
                print(elt)
                dico[elt] = {
                    e: "Any"
                    for e in inspect.getfullargspec(cl.__init__).args
                    if e != "self"
                }

    _ = open("layers.json", "w").write(json.dumps(dico, indent=4))

    app_dico = {}
    b = tf.keras.applications
    for elt in dir(b):
        if elt[0] != "_":
            cl = getattr(b, elt)
            if str(cl)[0] == str(cl).upper()[0]:
                print(elt)
                app_dico[elt] = {
                    e: "Any"
                    for e in inspect.getfullargspec(cl.__init__).args
                    if e != "self"
                }

    _ = open("applications.json", "w").write(json.dumps(app_dico, indent=4))
