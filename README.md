# DUME Project Overview

Welcome to the DUME repository! This project consists of three main components: Solid Server, BackOffice, and TheiaVision App.

## Project Description

Urban environments face a myriad of challenges, from waste mismanagement to infrastructure deterioration, which necessitate robust monitoring and management systems. Traditional centralized platforms, such as Theia Vision, though effective, often compromise user data sovereignty and privacy. Project DUME addresses these concerns by shifting towards a decentralized framework, thereby enhancing data control, privacy, and user engagement.

To achieve these goals, Project DUME leverages the Solid Protocol to handle large-scale media datasets in a decentralized manner. The key developments implemented include extending the Solid Protocol for efficient media data management to be used on advanced AI models like EfficientDet and YOLO for real-time urban event detection and characterization. These technological advancements enable seamless and efficient management of urban data while maintaining user sovereignty over their contributions.

## Project Architecture

Below is the architecture diagram of the DUME project:

![DUME Project Architecture](docs/architecture.jpg)


## Components

### Solid Server

The **Solid Server** is an implementation of the [Solid Protocol](https://solidproject.org/), designed to decentralize data storage and management. Our implementation is based on [node-solid-server](https://github.com/nodeSolidServer/node-solid-server), which provides secure and scalable decentralized data management.

For more details about Solid, check out the [Solid Project](https://solidproject.org/about).

[SolidServer Documentation](SolidServer/README.md)

### BackOffice

The **BackOffice** application is built using Next.js. It serves as the administrative interface for managing the various aspects of the Solid Server and TheiaVision App. The BackOffice provides functionalities for user management, data administration, and system monitoring, allowing administrators to oversee the decentralized network effectively.

[BackOffice Documentation](BackOffice/README.md)

### TheiaVision App

The **TheiaVision App** is a mobile application developed using Flutter. The app is designed to offer a user-friendly interface for interacting with the Solid Server and accessing decentralized data. It supports advanced AI models like EfficientDet and YOLO for real-time urban event detection and characterization. The app is available for download on the Google Play Store.

[Download TheiaVision App](https://play.google.com/store/apps/details?id=com.logimade.theia_vision_app)


[TheiaVision_App Documentation](TheiaVision_App/README.md)

### AI Models API

The **AI Models API** provides a collection of machine learning and deep learning models designed to process and analyze data for TheiaVision and other integrated applications. This API supports functionalities such as image recognition, object detection, and data anonymization, ensuring efficient and scalable AI-driven solutions.

[AI Models API Documentation](AIModelsAPI/README.md)

## Getting Started

To get started with any of these components, follow the instructions below.

1. **Clone the repository:**
    ```bash
    git clone https://github.com/NGI-TRUSTCHAIN/DUME.git
    cd DUME/<folderName>
    ```

2. **Install the necessary dependencies**

3. **Set Up the configurations required in each folder's README**

## **Setting Up the Infrastructure**

To deploy and run the entire DUME project infrastructure, follow these steps:

---

### **Step 1: Clone the Repository**
Clone the DUME project repository:
```bash
git clone https://github.com/NGI-TRUSTCHAIN/DUME.git
cd DUME
```

## Step 2: Install System Requirements

Ensure the following tools and libraries are installed on your machine:

- **Node.js** (for Solid Server and BackOffice)
- **Flutter SDK** (for TheiaVision App)
- **Docker** (for containerized deployment)
- **Python 3.x** (for AI Models API)
- **NVIDIA CUDA** (if using AI models with GPU acceleration)

## Step 3: Configure the Solid Server

### Navigate to the Solid Server directory:
```bash
cd DUME/SolidServer
npm install
```

### Set Up Configuration:

1. Edit the `SolidServer/config/defaults.js` file to define your server settings (e.g., port, data folder, authentication options).
2. Example configuration:
   ```json
   {
     "port": 8443,
     "auth: 'oidc',
     "configPath: './config',
     "dbPath": './.db'
   }
   ```
### Run the Server:

Start the server using the following command:

```bash
npm start
```
The Solid Server will be running at: https://localhost:8443.

## Step 4: Set Up the BackOffice

### Navigate to the BackOffice directory:
```bash
cd DUME/BackOffice
```

### Install Dependencies:
Run the following command to install the necessary dependencies:
```bash
npm install
```

### Configure the Environment:

1. Create an `.env` file:
   ```bash
   touch .env
   ```
   
2. Add the following environment variables to the .env file:
 ```bash
 SOLID_SERVER_URL=https://localhost:8443
 DATABASE_URL=postgis://localhost:27017
 JWT_SECRET=your_jwt_secret
 ```
### Run the Development Server:
Start the server with the following command:
```bash
npm run dev
```
Visit http://localhost:3000 in your browser.

## Step 5: Deploy AI Models API

### Navigate to the AI Models API directory:
```bash
cd DUME/AIModelsAPI
```

### Set Up a Virtual Environment:
Create and activate a virtual environment using the following commands:
```bash
python3 -m venv venv
source venv/bin/activate
```

### Install Dependencies:
Run the following command to install the necessary dependencies:
```bash
pip install -r requirements.txt
```

### Run the API Server:
Start the API server with the following command:
```bash
python app/api/main.py
```
The API will be accessible at http://localhost:8000.

## Step 6: Deploy the TheiaVision App

### Navigate to the TheiaVision directory::
```bash
cd DUME/TheiaVision_App
```

### Install Flutter Dependencies:
Run the following command to install Flutter dependencies:
```bash
flutter pub get
```

### Run the App:
Start the application using the following command
```bash
flutter run
```

### Connect to Solid Server:
Once the app is running, configure the server URL in the app settings (/controller/solid-protocol/request_service.dart) to point to your Solid Server: https://localhost:8443.

## Contributing

We welcome contributions from the community. If you would like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch with a descriptive name.
3. Make your changes and commit them with descriptive messages.
4. Push your changes to your fork.
5. Create a pull request with a description of your changes.

## Contact

If you have any questions or feedback, please feel free to reach out to us.

