from os import path as op
import json
from pathlib import Path


def write_json_file(directory, json_content):
    if not op.exists(directory):
        Path(directory).touch()

        # write metadata from the video in json file
    with open(directory, "w") as json_file:
        json_file.write(json.dumps(json_content, indent=4))
        json_file.close()


def read_json_file(directory):
    with open(directory, "r") as json_file:
        content = json.load(json_file)
        json_file.close()
    return content
