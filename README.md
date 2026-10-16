<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,12,18&height=200&section=header&text=# Crop Doctor AI

An intelligent full-stack web application that uses deep learning to detect crop diseases from plant images, helping farmers diagnose and treat plant health issues instantly.

## Features

- Real-Time Disease Detection: Upload a leaf image and get instant AI-powered diagnosis
- - Custom TensorFlow Model: Trained on crop disease datasets with high accuracy
  - - Multi-Crop Support: Detects diseases across multiple crop varieties
    - - Confidence Scores: Shows prediction confidence percentage for each diagnosis
      - - Treatment Suggestions: Provides actionable treatment recommendations
        - - Modern Web UI: Beautiful Next.js frontend with Radix UI components
          - - Fast API Backend: FastAPI server for high-performance ML inference
            - - Responsive Design: Works on desktop and mobile devices
             
              - ## Tech Stack
             
              - ### Frontend
              - - Next.js 16 (React framework with SSR/SSG)
                - - TypeScript (Type-safe development)
                  - - Tailwind CSS 4 (Utility-first styling)
                    - - Radix UI (Accessible component library)
                      - - Recharts (Data visualization)
                        - - React Hook Form + Zod (Form management & validation)
                         
                          - ### Backend / AI
                          - - FastAPI (High-performance Python API)
                            - - TensorFlow / Keras (Deep learning model)
                              - - Pillow (PIL) (Image preprocessing)
                                - - NumPy (Numerical computations)
                                  - - Uvicorn (ASGI server)
                                   
                                    - ## Project Structure
                                   
                                    - crop-doctor-ai/
                                    - # Crop Doctor AI
                                   
                                    - An intelligent full-stack web application that uses deep learning to detect crop diseases from plant images, helping farmers diagnose and treat plant health issues instantly.
                                   
                                    - ## Features
                                   
                                    - - Real-Time Disease Detection: Upload a leaf image and get instant AI-powered diagnosis
                                      - - Custom TensorFlow Model: Trained on crop disease datasets with high accuracy
                                        - - Multi-Crop Support: Detects diseases across multiple crop varieties
                                          - - Confidence Scores: Shows prediction confidence percentage for each diagnosis
                                            - - Treatment Suggestions: Provides actionable treatment recommendations
                                              - - Modern Web UI: Beautiful Next.js frontend with Radix UI components
                                                - - Fast API Backend: FastAPI server for high-performance ML inference
                                                  - - Responsive Design: Works on desktop and mobile devices
                                                   
                                                    - ## Tech Stack
                                                   
                                                    - ### Frontend
                                                    - - Next.js 16 (React framework with SSR/SSG)
                                                      - - TypeScript (Type-safe development)
                                                        - - Tailwind CSS 4 (Utility-first styling)
                                                          - - Radix UI (Accessible component library)
                                                            - - Recharts (Data visualization)
                                                              - - React Hook Form + Zod (Form management & validation)
                                                               
                                                                - ### Backend / AI
                                                                - - FastAPI (High-performance Python API)
                                                                  - - TensorFlow / Keras (Deep learning model)
                                                                    - - Pillow (PIL) (Image preprocessing)
                                                                      - - NumPy (Numerical computations)
                                                                        - - Uvicorn (ASGI server)
                                                                         
                                                                          - ## Project Structure
                                                                         
                                                                          - crop-doctor-ai/
                                                                          - app/ (Next.js App Router)
                                                                          - components/ (Reusable React components)
                                                                          - backend/ (Python FastAPI server)
                                                                          -   app.py (Main API server)
                                                                          -     train.py (Model training script)
                                                                          -   crop_doctor_model.keras (Trained AI model)
                                                                          -     class_names.json (Disease class labels)
                                                                          - dataset/ (Training dataset)
                                                                          - hooks/ (Custom React hooks)
                                                                          - lib/ (Utility functions)
                                                                          - package.json (Node.js dependencies)
                                                                         
                                                                          - ## Getting Started
                                                                         
                                                                          - ### Prerequisites
                                                                          - - Node.js 18+ and npm
                                                                            - - Python 3.9+
                                                                             
                                                                              - ### 1. Clone the Repository
                                                                              - git clone https://github.com/rohitsingh-dev-85/crop-doctor-ai.git
                                                                              - cd crop-doctor-ai
                                                                             
                                                                              - ### 2. Frontend Setup
                                                                              - npm install
                                                                              - npm run dev
                                                                             
                                                                              - ### 3. Backend Setup
                                                                              - cd backend
                                                                              - python -m venv venv
                                                                              - venv\Scripts\activate
                                                                              - pip install -r requirements.txt
                                                                              - python train.py
                                                                              - python app.py
                                                                             
                                                                              - ## API Reference
                                                                             
                                                                              - ### POST /predict
                                                                              - Upload a crop image and get disease prediction.
                                                                             
                                                                              - Response:
                                                                              - {
                                                                              -   "label": "Tomato Early Blight",
                                                                              -     "confidence": 0.9427
                                                                              - }
                                                                             
                                                                              - ## Author
                                                                             
                                                                              - Rohit Singh
                                                                              - Full Stack Developer & ML Engineer
                                                                              - 
