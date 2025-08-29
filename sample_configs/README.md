# DeepTeam Sample Configurations

This folder contains example configuration files for different model providers supported by DeepTeam.

## Available Configurations

### 1. **OpenAI** (`01_openai_config.yaml`)
- Uses OpenAI's GPT models (GPT-4o, GPT-3.5-turbo)
- Requires `OPENAI_API_KEY` environment variable
- **CLI Setup**: `deepteam set-api-key sk-proj-abc123...`

### 2. **Azure OpenAI** (`02_azure_openai_config.yaml`)
- Uses Azure OpenAI service
- Requires Azure OpenAI endpoint, API key, and deployment names
- **CLI Setup**: `deepteam set-azure-openai --openai-api-key "key" --openai-endpoint "endpoint" --openai-api-version "version" --openai-model-name "model" --deployment-name "deployment"`

### 3. **Ollama** (`03_ollama_config.yaml`)
- Uses local Ollama models
- Requires Ollama to be running locally
- **CLI Setup**: `deepteam set-ollama llama3:latest --base-url "http://localhost:11434"`
- **Prerequisites**: `ollama pull llama3:latest`

### 4. **Local Model** (`04_local_model_config.yaml`)
- Uses custom local model servers
- Requires local model server running
- **CLI Setup**: `deepteam set-local-model model-name --base-url "http://localhost:8000"`

### 5. **Google Gemini** (`05_gemini_config.yaml`)
- Uses Google's Gemini models
- Two options: API Key or Google Cloud (Vertex AI)
- **CLI Setup**: `deepteam set-gemini --google-api-key "key"` or `deepteam set-gemini --project-id "project" --location "location"`

### 6. **Anthropic** (`06_anthropic_config.yaml`)
- Uses Anthropic's Claude models
- Requires `ANTHROPIC_API_KEY` environment variable
- **CLI Setup**: `deepteam set-api-key sk-ant-abc123...`

### 7. **Amazon Bedrock** (`07_bedrock_config.yaml`)
- Uses AWS Bedrock service
- Requires AWS credentials and region
- **Setup**: Set AWS environment variables or use AWS CLI configuration

### 8. **Custom Model** (`08_custom_model_config.yaml`)
- Uses custom Python classes
- Requires implementing `DeepEvalBaseLLM` interface
- **Setup**: Create custom model class and specify file path

## Usage

1. **Copy** the desired configuration file to your project root
2. **Rename** it to `config.yaml` or use with `-c` flag
3. **Update** the configuration with your specific values
4. **Set up** the required API keys or credentials
5. **Run** with: `deepteam run config.yaml`

## Common Commands

```bash
# Set API keys
deepteam set-api-key sk-proj-abc123...          # OpenAI
deepteam set-api-key sk-ant-abc123...           # Anthropic

# Set Ollama
deepteam set-ollama llama3:latest

# Set local model
deepteam set-local-model my-model --base-url "http://localhost:8000"

# Set Gemini
deepteam set-gemini --google-api-key "key"

# Run with specific config
deepteam run my_config.yaml

# Run with overrides
deepteam run config.yaml -c 20 -a 5 -o results
```

## Important Notes

- **API Keys**: Never commit API keys to version control
- **Environment Variables**: Use environment variables for sensitive data
- **Temperature**: Controls randomness (0 = deterministic, higher = more random)
- **Base URLs**: Default Ollama URL is `http://localhost:11434`
- **Custom Models**: Must implement the `DeepEvalBaseLLM` interface

## Troubleshooting

- **Ollama**: Ensure Ollama is running and models are pulled
- **Local Models**: Verify your model server is accessible
- **API Keys**: Check environment variables and CLI configuration
- **Network**: Ensure firewall/network allows connections to model providers
