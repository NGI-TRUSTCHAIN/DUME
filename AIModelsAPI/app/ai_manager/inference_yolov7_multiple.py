import json
from datetime import datetime
from io import BytesIO
from typing import Annotated

import requests
from PIL import Image
from fastapi import Depends, HTTPException
from tqdm import tqdm

from api import config
from api.cached_settings import get_solid_credentials
import re


def authenticate_solid_account(credentials: Annotated[config.SolidCredentials, Depends(get_solid_credentials)]):
    # Define the payload as a dictionary for better readability
    payload = {
        'username': credentials.username,
        'password': credentials.password,
        'webId': credentials.webId
    }

    # Specify the headers, including the Content-Type and any required cookies
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    }

    url = 'https://dume-arditi.com/jwt'

    # Send the POST request, using requests' `post` method and passing the payload
    response = requests.post(url, headers=headers, data=payload).json()

    return response['token']


def get_images_to_evaluate(token):
    headers = {
        'Accept': 'application/json',
        'Authorization': f'Bearer {token}'
    }

    url = "https://huawei1.dume-arditi.com/api/metadata-search?subDir=theia-vision&analysed=false"

    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        raise HTTPException

    return response.json()


# def write_json(content, directory):
#     with open(directory, "w") as json_file:
#         json_file.write(json.dumps(content, indent=4))
#         json_file.close()
#
#
# def load_model(weights):
#     model = torch.hub.load('WongKinYiu/yolov7', 'custom', weights,
#                            force_reload=True, trust_repo=True)
#     return model

def update_json_ledger(url, headers, info):
    ledger_filename = '/ledger.json'

    match = re.match(r'(.*?)/image', url)

    if not match:
        raise HTTPException

    base_url = match.group(1)
    ledger_url = ''.join([base_url, ledger_filename])

    ledger_response = requests.get(ledger_url, headers=headers)
    if ledger_response.status_code != 200:
        raise HTTPException

    ledger_content = ledger_response.json()

    index = next((i for i, image in enumerate(ledger_content['images']) if image['id'] == info['metadata']['id']), None)

    if index is not None:
        ledger_content['images'][index]['analysed'] = info['metadata']['analysed']
        ledger_content['images'][index]['date_analysed'] = info['metadata']['date_analysed']  # ISO format for datetime
        ledger_content['images'][index]['classes'] = info['predictions']

        headers['Content-Type'] = 'application/json'

        response = requests.put(ledger_url, headers=headers, data=json.dumps(ledger_content))

        if response.status_code != 201:
            raise HTTPException


async def inference_images(model, credentials):
    access_token = authenticate_solid_account(credentials)
    images = get_images_to_evaluate(access_token)

    headers = {
        'Authorization': f'Bearer {access_token}'
    }

    info = dict()

    for image in tqdm(images, total=len(images), colour="GREEN"):
        image_url = image['url']
        image_id = image['id']
        response = requests.get(image_url + '.png', headers=headers)
        if response.status_code == 200:

            image = Image.open(BytesIO(response.content))
            predictions = model(image)

            predictions_df = predictions.pandas().xyxy[0]

            results = []

            for confidence, name_ in zip(predictions_df['confidence'], predictions_df['name']):
                results.append({
                    "class": name_,
                    'trustLevel': confidence,
                })
            print(results)

            info['metadata'] = {
                "id": image_id,
                "analysed": 1,
                "date_analysed": datetime.now().isoformat()
            }

            info['predictions'] = []

            if len(results):
                info['predictions'] = results

            print(info)
            update_json_ledger(image_url, headers, info)


# if __name__ == '__main__':
#     root_directory = op.dirname(op.dirname(op.abspath(__file__)))
#     weights_file = op.join(root_directory, 'resources/ai-custom_models/latest_yolov7/yolov7_e6e_8classes.pt')
#
#     model = load_model(weights_file)
#     evaluate_images(model)
