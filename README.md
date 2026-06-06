# 🐔 Chicken Disease Classification

An end-to-end deep learning project that classifies chicken fecal images as **Healthy** or **Coccidiosis** using a fine-tuned **VGG16** model. The project includes a full ML pipeline managed by DVC, a FastAPI backend, and a React frontend.

![Python](https://img.shields.io/badge/Python-3.11-blue)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-orange)
![FastAPI](https://img.shields.io/badge/FastAPI-0.136-green)
![React](https://img.shields.io/badge/React-19-blue)
![DVC](https://img.shields.io/badge/DVC-Pipeline-purple)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Project Architecture](#project-architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [DVC Pipeline](#dvc-pipeline)
  - [Pipeline Stages](#pipeline-stages)
  - [Running the Pipeline](#running-the-pipeline)
- [Running the Application](#running-the-application)
  - [Backend (FastAPI)](#backend-fastapi)
  - [Frontend (React + Vite)](#frontend-react--vite)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Model Details](#model-details)
- [Configuration](#configuration)

---

## Overview

Coccidiosis is a parasitic disease that affects poultry and can lead to significant economic losses. This project provides an automated classification system that can detect Coccidiosis from chicken fecal images using deep learning.

**Key Features:**
- 🧠 VGG16-based transfer learning model
- 📊 Reproducible ML pipeline with DVC
- ⚡ FastAPI backend with automatic model loading
- 🎨 Modern React UI with drag-and-drop image upload
- 📈 Model evaluation with tracked metrics

---

## Project Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React Frontend│────▶│  FastAPI Backend │────▶│  VGG16 Model    │
│   (Vite + React)│◀────│  (Uvicorn)      │◀────│  (TensorFlow)   │
│   Port: 5173    │     │  Port: 8080     │     │  model.h5       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │   DVC Pipeline    │
                    │                   │
                    │ 1. Data Ingestion │
                    │ 2. Base Model     │
                    │ 3. Training       │
                    │ 4. Evaluation     │
                    └───────────────────┘
```

---

## Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| ML Model    | TensorFlow / Keras (VGG16)        |
| Pipeline    | DVC (Data Version Control)        |
| Backend     | FastAPI + Uvicorn                 |
| Frontend    | React 19 + Vite 8                 |
| Language    | Python 3.11, JavaScript (ES2022)  |

---

## Getting Started

### Prerequisites

- **Python** 3.11+
- **Node.js** 18+ and npm
- **Git**

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/AviPant/Chicken-disease-classification.git
cd Chicken-disease-classification
```

**2. Create and activate a virtual environment**

```bash
# Windows
python -m venv .venv
.\.venv\Scripts\activate

# macOS / Linux
python3 -m venv .venv
source .venv/bin/activate
```

**3. Install Python dependencies**

```bash
pip install -r requirements.txt
```

**4. Install frontend dependencies**

```bash
cd frontend
npm install
cd ..
```

---

## DVC Pipeline

This project uses [DVC](https://dvc.org/) to manage the ML pipeline, ensuring reproducibility and tracking of data, models, and metrics.

### Pipeline Stages

| Stage               | Command                                                        | Description                                          |
|---------------------|----------------------------------------------------------------|------------------------------------------------------|
| `data_ingestion`    | `python src/cnnClassifier/pipeline/stage_01_data_ingestion.py` | Downloads and extracts chicken fecal image dataset   |
| `prepare_base_model`| `python src/cnnClassifier/pipeline/stage_02_prepare_base_model.py` | Prepares VGG16 base model with custom classification head |
| `training`          | `python src/cnnClassifier/pipeline/stage_03_training.py`       | Fine-tunes the model on the dataset                  |
| `evaluation`        | `python src/cnnClassifier/pipeline/stage_04_evaluation.py`     | Evaluates model performance and saves metrics        |

### Running the Pipeline

```bash
# Run the full pipeline
dvc repro

# Run a specific stage
dvc repro data_ingestion
dvc repro training

# View pipeline DAG
dvc dag

# Check pipeline status
dvc status

# View tracked metrics
dvc metrics show
```

### Pipeline Parameters (`params.yaml`)

```yaml
AUGMENTATION: True
IMAGE_SIZE: [224, 224, 3]
BATCH_SIZE: 16
INCLUDE_TOP: False
EPOCHS: 1
CLASSES: 2
WEIGHTS: imagenet
LEARNING_RATE: 0.01
```

> **Tip:** Modify `params.yaml` to experiment with different hyperparameters, then run `dvc repro` to retrain.

### Running the Full Training Pipeline (without DVC)

```bash
python main.py
```

This runs all four stages sequentially: data ingestion → base model preparation → training → evaluation.

---

## Running the Application

### Backend (FastAPI)

```bash
# Activate virtual environment first
.\.venv\Scripts\activate          # Windows
source .venv/bin/activate         # macOS / Linux

# Start the backend server
python -m uvicorn app:app --host 0.0.0.0 --port 8080
```

The API will be available at **http://localhost:8080**

- Health check: `GET http://localhost:8080/api/health`
- Swagger docs: `GET http://localhost:8080/docs`

> **⚠️ Windows Note:** Do not use `--reload` flag with TensorFlow on Windows, as it causes `[Errno 22]` conflicts between TensorFlow's threading and the async event loop.

### Frontend (React + Vite)

Open a **second terminal**:

```bash
cd frontend
npm run dev
```

The UI will be available at **http://localhost:5173**

### Quick Start (Both together)

| Service  | Terminal | Command                                                     | URL                    |
|----------|----------|-------------------------------------------------------------|------------------------|
| Backend  | 1        | `python -m uvicorn app:app --host 0.0.0.0 --port 8080`     | http://localhost:8080   |
| Frontend | 2        | `cd frontend && npm run dev`                                | http://localhost:5173   |

---

## API Documentation

### `GET /api/health`

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "model_path": "artifacts/training/model.h5"
}
```

### `POST /api/predict`

Upload an image for disease classification.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `file` (image/jpeg, image/png, image/webp)

**Response:**
```json
{
  "prediction": "Coccidiosis",
  "confidence": 100.0,
  "class_index": 0
}
```

**Class Labels:**
| Index | Label        |
|-------|-------------|
| 0     | Coccidiosis |
| 1     | Healthy     |

---

## Project Structure

```
chicken-disease-classification/
├── app.py                          # FastAPI backend application
├── main.py                         # Run full ML pipeline
├── params.yaml                     # Model hyperparameters
├── dvc.yaml                        # DVC pipeline definition
├── dvc.lock                        # DVC pipeline lock file
├── scores.json                     # Model evaluation metrics
├── requirements.txt                # Python dependencies
├── setup.py                        # Package setup
├── config/
│   └── config.yaml                 # Pipeline configuration (paths, URLs)
├── src/cnnClassifier/
│   ├── components/                 # ML components
│   │   ├── data_ingestion.py       #   Data download & extraction
│   │   ├── prepare_base_model.py   #   VGG16 model preparation
│   │   ├── prepare_callbacks.py    #   TensorBoard & checkpoint callbacks
│   │   ├── training.py             #   Model training logic
│   │   └── evaluation.py           #   Model evaluation
│   ├── pipeline/                   # Pipeline stage runners
│   │   ├── stage_01_data_ingestion.py
│   │   ├── stage_02_prepare_base_model.py
│   │   ├── stage_03_training.py
│   │   ├── stage_04_evaluation.py
│   │   └── predict.py              # Prediction pipeline class
│   ├── config/                     # Configuration manager
│   ├── constants/                  # Path constants
│   ├── entity/                     # Data classes / entities
│   └── utils/                      # Utility functions
├── frontend/                       # React frontend (Vite)
│   ├── src/
│   │   ├── App.jsx                 # Main app with upload & results
│   │   ├── components/
│   │   │   ├── Header.jsx          # App header
│   │   │   ├── UploadZone.jsx      # Drag-and-drop image upload
│   │   │   ├── ResultCard.jsx      # Prediction result display
│   │   │   └── InfoSection.jsx     # Model info section
│   │   └── index.css               # Global styles
│   └── package.json
├── artifacts/                      # DVC-managed artifacts (gitignored)
│   ├── data_ingestion/             # Downloaded dataset
│   ├── prepare_base_model/         # Base & updated VGG16 models
│   ├── prepare_callbacks/          # TensorBoard logs & checkpoints
│   └── training/                   # Trained model (model.h5)
├── research/                       # Jupyter notebooks for experiments
└── templates/                      # Legacy HTML templates
```

---

## Model Details

| Property            | Value                          |
|---------------------|--------------------------------|
| Base Architecture   | VGG16 (ImageNet pretrained)    |
| Input Size          | 224 × 224 × 3                  |
| Output Classes      | 2 (Coccidiosis, Healthy)       |
| Transfer Learning   | Top layers replaced, fine-tuned|
| Data Augmentation   | Enabled                        |
| Optimizer           | SGD (lr=0.01)                  |

---

## Configuration

### `config/config.yaml`

Defines paths for data, models, and artifacts:

```yaml
artifacts_root: artifacts

data_ingestion:
  source_URL: https://github.com/entbappy/Branching-tutorial/raw/master/Chicken-fecal-images.zip
  local_data_file: artifacts/data_ingestion/data.zip
  unzip_dir: artifacts/data_ingestion

training:
  root_dir: artifacts/training
  trained_model_path: artifacts/training/model.h5
```

### `params.yaml`

Tune these hyperparameters to improve model performance:

| Parameter       | Default     | Description                     |
|----------------|-------------|---------------------------------|
| `IMAGE_SIZE`   | [224,224,3] | Input image dimensions          |
| `BATCH_SIZE`   | 16          | Training batch size             |
| `EPOCHS`       | 1           | Number of training epochs       |
| `LEARNING_RATE`| 0.01        | Optimizer learning rate         |
| `AUGMENTATION` | True        | Enable data augmentation        |
| `WEIGHTS`      | imagenet    | Pretrained weights source       |
| `INCLUDE_TOP`  | False       | Use VGG16 classifier head       |
| `CLASSES`      | 2           | Number of output classes        |

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Author

**Avi Pant** — [GitHub](https://github.com/AviPant) · [Email](mailto:AviPant092@gmail.com)