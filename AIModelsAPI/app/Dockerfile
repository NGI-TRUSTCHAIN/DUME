
FROM python:3.10

WORKDIR ./Server_Folder

COPY ./requirements.txt /Server_Folder/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /Server_Folder/requirements.txt

COPY ./app /Server_Folder/app

EXPOSE 9000

CMD [ "uvicorn", "app.main:app", "--proxy-headers", "--host", "0.0.0.0", "--port", "9000"]


