import inspect
import json
from typing import List

import tensorflow as tf

if __name__ == "__main__":
    dico = {}
    base = tf.keras.layers
    for elt in dir(base):
        if elt[0] != "_":
            cl = getattr(base, elt)
            if "keras.layers" in str(cl):
                print(elt)
                b_doc = " ".join(cl.__doc__.split("\n        "))
                tt = True
                try:
                    documentation = b_doc.split("Args:\n")[1].split("\n    Returns:")[0]
                except:
                    tt = False
                    documentation = b_doc
                dico[elt] = {
                    e: "Any"
                    for e in inspect.getfullargspec(cl.__init__).args
                    if e != "self"
                }
                splitted = documentation.split(".\n")
                idx = 0
                space_count = 0
                while splitted[0][space_count] == " ":
                    space_count += 1
                while idx < len(splitted):
                    if "\n" == splitted[idx][:1]:
                        break
                    idx += 1

                splitted = splitted[:idx]

                joined_lines: List[str] = []
                for line in splitted:
                    try:
                        if line[space_count] == " " and line[0] == " ":
                            joined_lines[-1] += " " + line
                        else:
                            joined_lines.append(line)
                    except:
                        pass
                joined_lines = [j.strip() for j in joined_lines]
                joined_lines = [j.replace("\n", " ") for j in joined_lines]
                joined_lines = [" ".join(j.split()) for j in joined_lines]

                rebuttal = ""
                for line in joined_lines:
                    var_name, *split_line = line.split(":")
                    if var_name in dico[elt]:
                        dico[elt][var_name] = ":".join(split_line).strip()
                    else:
                        rebuttal += line + "\n"

                if rebuttal:
                    dico[elt]["doc"] = rebuttal
                # dico[elt]["fucked"] = not tt

    _ = open("./src/layers.json", "w").write(json.dumps(dico, indent=4))

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
