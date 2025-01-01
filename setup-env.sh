#!/bin/bash

# Load environment variables from .env
if [ -f .env ]; then
    source .env
fi

# Set environment variables
export GEMINI_API_KEY=${GEMINI_API_KEY}
export PINECONE_API_KEY=${PINECONE_API_KEY}
export HUGGINGFACE_TOKEN=${HUGGINGFACE_TOKEN}

echo "Environment variables loaded from .env"
npm run dev