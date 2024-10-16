# Theia Vision AI Inference API

This repository contains the FastAPI service for running AI inferences using YOLOv7 models. The service integrates with the Solid protocol for secure, decentralized data management, allowing images to be processed for object detection and updating their metadata.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Overview

The Theia Vision AI Inference API allows users to run object detection on images using YOLOv7 models. It integrates Solid credentials for secure data access and storage. This service is part of the larger Theia Vision project, aimed at detecting urban occurrences in real time.

## Features

- **AI Inference**: Run object detection on images using pre-trained YOLOv7 models.
- **Solid Integration**: Secure and decentralized data handling via Solid Pods.
- **Asynchronous Processing**: Efficient image analysis with async support.

## Installation

### Prerequisites

- Python 3.8+
- FastAPI
- Torch
- Solid credentials setup

### Clone the Repository

```bash
git clone https://github.com/yourusername/theia-vision-ai-inference-api.git
cd theia-vision-ai-inference-api```

## Install Dependencies

```bash
pip install -r requirements.txt```

### Environment Variables

Create a `.env` file in the root directory and add the following:

```env
SOLID_USERNAME=your_solid_username
SOLID_PASSWORD=your_solid_password
MODEL_PATH=/path/to/your/yolov7/model```

### Run the Application

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload```
The API should now be running on http://localhost:8000.

### Usage
#### Running Inference

You can trigger inference by sending a `POST` request to the `/ai-models/run-inference` endpoint.

**Example using curl:**

```bash
curl -X POST http://localhost:8000/ai-models/run-inference
Or, you can integrate this request into another application.```
