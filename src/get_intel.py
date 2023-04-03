import inspect
import json
from typing import Dict, List, Literal

import tensorflow as tf

types = Literal["int", "float", "string", "bool", "tuple", "Any"]

common_types: Dict[str, types] = {
    "axis": "int",
    "seed": "int",
    "width": "int",
    "height": "int",
    "data_format": "string",
}

cantUse = [
    "Masking",
    "Lambda",  # TODO: add
]


def has_inputs(layer_name: str) -> bool:
    return layer_name in ["Add", "Multiply", "Concatenate"]


def get_type(param_name: str, doc: str) -> types:
    if param_name in common_types:
        return common_types[param_name]

    if "True" in doc or "False" in doc:
        return "bool"
    if (
        "integers" in doc.lower()[:50]
        or "ints" in doc.lower()[:50]
        or "floats" in doc.lower()[:50]
        or "tuple" in doc.lower()[:50]
    ):
        return "tuple"
    if "float" in doc.lower()[:50]:
        return "float"
    if "integer" in doc.lower()[:50]:
        return "int"

    return doc


count_params = {}

if __name__ == "__main__":
    dico = {}
    base = tf.keras.layers
    for elt in dir(base):
        if elt[0] != "_":
            cl = getattr(base, elt)
            if "keras.layers" in str(cl):
                print(elt)
                temp_dico = {}
                b_doc = " ".join(cl.__doc__.split("\n        "))
                tt = True
                try:
                    documentation = b_doc.split("Args:\n")[1].split("\n    Returns:")[0]
                except:
                    tt = False
                    documentation = b_doc
                temp_dico = {
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
                    if var_name in temp_dico:
                        temp_dico[var_name] = ":".join(split_line).strip()
                        if var_name not in count_params:
                            count_params[var_name] = 0
                        count_params[var_name] += 1
                    else:
                        rebuttal += line + "\n"

                if rebuttal:
                    temp_dico["doc"] = rebuttal
                dico[elt] = {
                    "multipleInputs": has_inputs(elt),
                    "doc": temp_dico["doc"] if "doc" in temp_dico else "",
                    "altersShape": True,
                    "params": [
                        {
                            "type": get_type(param_name, doc),
                            "name": param_name,
                            "doc": doc,
                        }
                        for param_name, doc in temp_dico.items()
                        if param_name != "doc"
                    ],
                }

    _ = open("./src/layers.json", "w").write(json.dumps(dico, indent=4))

    # app_dico = {}
    # b = tf.keras.applications
    # for elt in dir(b):
    #     if elt[0] != "_":
    #         cl = getattr(b, elt)
    #         if str(cl)[0] == str(cl).upper()[0]:
    #             print(elt)
    #             app_dico[elt] = {
    #                 e: "Any"
    #                 for e in inspect.getfullargspec(cl.__init__).args
    #                 if e != "self"
    #             }

    # _ = open("applications.json", "w").write(json.dumps(app_dico, indent=4))

    print(count_params)
