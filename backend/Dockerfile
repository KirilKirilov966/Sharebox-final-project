FROM python:3.13-alpine

WORKDIR /app

RUN apk add --no-cache build-base gcc musl-dev libffi-dev openssl-dev

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "app.py"]