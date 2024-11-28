# Eurocode 2 Concrete Structure Analysis Application

## Overview

In this project I am combining my experienced gained during my civil and structural engineering degree, with my interests in web development and ai.

This application leverages advanced AI technologies to provide comprehensive analysis of concrete structures using the Eurocode 2 (EN 1992) design standard. It enables engineers and researchers to upload project documents and ask questions about concrete design, structural failure analysis, and compliance with Eurocode 2 guidelines.

## Key Features

- **Document Upload**: Upload project documents, case studies, or structural analysis reports
- **AI-Powered Insights**: Extract and analyze key information using advanced AI technologies
- **Knowledge Base Querying**: Perform similarity searches against a Eurocode 2 vector embedding database
- **Personalized Recommendations**: Receive context-aware insights based on Eurocode 2 standards

## Technologies Used

- Next.js
- Pinecone Vector Database
- Shadcn/ui
- Vercel AI SDK
- Hugging Face Inference API
- Vector Embeddings for Eurocode 2 Knowledge Base

## Prerequisites

- Node.js (version 18 or later)
- Pinecone Account
- Hugging Face Account
- OpenAI or Google AI API Key

## Installation

1. Clone the repository

```bash
git clone https://github.com/emmanueluwa/civil-search-chat
cd civil-search-chat
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env.local` file with the following environment variables:

```
PINECONE_API_KEY=your_pinecone_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
OPENAI_API_KEY=your_openai_api_key
```

4. Prepare the Eurocode 2 Knowledge Base

- Collect relevant Eurocode 2 documents
- Convert documents to vector embeddings
- Index embeddings in Pinecone

5. Run the development server

```bash
npm run dev
```

## Usage

1. Upload a concrete structure project document
2. Let the AI extract key information
3. Verify and confirm the extracted data
4. Ask specific questions about the document, design standards, or structural analysis

## Knowledge Base Creation

The application uses vector embeddings of Eurocode 2 documents to provide contextually relevant answers. The knowledge base is created by:

- found here [[link to knowledge base repository](https://github.com/emmanueluwa/civil-search)]
- Preprocessing Eurocode 2 documentation
- Generating vector embeddings using Hugging Face models
- Indexing embeddings in Pinecone for efficient similarity search

## Future Improvements

- Enhanced image analysis capabilities
- Support for more document formats
- Expanded Eurocode 2 knowledge base
- More advanced structural design recommendations
