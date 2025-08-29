# DeepTeam Playground 🚀

A comprehensive playground and learning environment for [DeepTeam](https://github.com/confident-ai/deepteam), an AI red teaming framework for testing and evaluating LLM applications.

## 🎯 What is DeepTeam?

DeepTeam is an AI red teaming framework that helps you:
- **Simulate adversarial attacks** on your LLM applications
- **Evaluate security vulnerabilities** like PII leakage, bias, toxicity, and RBAC bypass
- **Test model robustness** against prompt injection and roleplay attacks
- **Generate comprehensive risk assessments** for AI systems

## 🏗️ Project Structure

```
deepteam-playground/
├── config.yaml                 # Main configuration file (Ollama setup)
├── sample_configs/            # Example configurations for all providers
│   ├── 01_openai_config.yaml      # OpenAI GPT models
│   ├── 02_azure_openai_config.yaml # Azure OpenAI service
│   ├── 03_ollama_config.yaml      # Local Ollama models
│   ├── 04_local_model_config.yaml # Custom local servers
│   ├── 05_gemini_config.yaml      # Google Gemini models
│   ├── 06_anthropic_config.yaml   # Anthropic Claude models
│   ├── 07_bedrock_config.yaml     # Amazon Bedrock service
│   ├── 08_custom_model_config.yaml # Custom Python models
│   ├── 09_mixed_providers_config.yaml # Mixed provider setup
│   └── README.md                   # Provider-specific documentation
├── results/                   # Red teaming results (auto-generated)
└── README.md                  # This file
```

## 🚀 Quick Start

### 1. Prerequisites

- Python 3.8+
- DeepTeam installed: `pip install deepteam`
- Access to at least one LLM provider (API key, local model, etc.)

### 2. Basic Setup

```bash
# Clone this repository
git clone https://github.com/dgabrielli/deepteam-playground.git
cd deepteam-playground

# Install DeepTeam
pip install deepteam

# Choose a configuration and set up your provider
```

### 3. Choose Your Provider

#### Option A: Use Sample Configurations
Copy any sample config from `sample_configs/` to your project root:

```bash
# For OpenAI
cp sample_configs/01_openai_config.yaml config.yaml

# For Ollama (local models)
cp sample_configs/03_ollama_config.yaml config.yaml

# For mixed providers
cp sample_configs/09_mixed_providers_config.yaml config.yaml
```

#### Option B: Use CLI Commands
Set up providers globally using DeepTeam CLI:

```bash
# OpenAI
deepteam set-api-key sk-proj-abc123...

# Anthropic
deepteam set-api-key sk-ant-abc123...

# Ollama (local)
deepteam set-ollama llama3:latest

# Google Gemini
deepteam set-gemini --google-api-key "your-key"
```

### 4. Run Red Teaming

```bash
# Basic run
deepteam run config.yaml

# With custom parameters
deepteam run config.yaml -c 20 -a 5 -o results
```

## 🔧 Configuration Options

### Model Providers Supported

| Provider | Setup | Use Case |
|----------|-------|----------|
| **OpenAI** | API Key | Production, high-quality models |
| **Azure OpenAI** | Azure credentials | Enterprise, compliance |
| **Anthropic** | API Key | Safety-focused models |
| **Google Gemini** | API Key or Vertex AI | Google ecosystem |
| **Ollama** | Local installation | Cost-effective, privacy |
| **Local Models** | Custom server | Full control, offline |
| **Amazon Bedrock** | AWS credentials | AWS ecosystem |
| **Custom Models** | Python classes | Specialized requirements |

### Configuration Parameters

```yaml
# Red teaming models
models:
  simulator: gpt-4o          # Generates attacks
  evaluation: gpt-4o         # Evaluates responses

# Target system
target:
  purpose: "A helpful AI assistant"
  model: gpt-3.5-turbo      # System to test

# System settings
system_config:
  max_concurrent: 10         # Parallel operations
  attacks_per_vulnerability_type: 3  # Attacks per vulnerability
  run_async: true            # Async execution
  output_folder: "results"   # Results location
```

## 🎭 Vulnerability Types

DeepTeam can test for various vulnerabilities:

- **PII Leakage**: Direct disclosure, social manipulation
- **Bias**: Race, gender, age discrimination
- **Toxicity**: Profanity, insults, harmful content
- **RBAC**: Role bypass, privilege escalation
- **Prompt Injection**: Malicious prompt manipulation
- **Roleplay**: Unauthorized role assumption

## 📊 Understanding Results

After running red teaming, check the `results/` folder for:

- **JSON reports** with detailed vulnerability findings
- **Attack examples** that successfully exploited vulnerabilities
- **Risk scores** for each vulnerability type
- **Recommendations** for improving model security

## 🛠️ Advanced Usage

### Custom Vulnerabilities

```yaml
default_vulnerabilities:
  - name: "CustomVuln"
    types: ["type1", "type2"]
```

### Custom Attacks

```yaml
attacks:
  - name: "CustomAttack"
  - name: "SocialEngineering"
```

### Mixed Provider Strategy

Use different providers for different purposes:

```yaml
models:
  simulator:
    provider: ollama          # Cost-effective attack generation
    model: llama3:latest
  evaluation:
    provider: openai          # High-quality evaluation
    model: gpt-4o
```

## 🔒 Security Best Practices

1. **Never commit API keys** - Use environment variables
2. **Use .gitignore** - Exclude sensitive files and results
3. **Regular testing** - Run red teaming regularly
4. **Monitor results** - Track vulnerability trends over time
5. **Update models** - Keep models and configurations current

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch
3. **Add** new sample configurations
4. **Improve** documentation
5. **Submit** a pull request

### Adding New Provider Examples

1. Create a new config file in `sample_configs/`
2. Follow the naming convention: `XX_provider_config.yaml`
3. Include comprehensive comments and setup instructions
4. Update the main README with new provider information

## 📚 Resources

- [DeepTeam Documentation](https://docs.confident-ai.com/)
- [DeepTeam GitHub](https://github.com/confident-ai/deepteam)
- [Red Teaming Best Practices](https://docs.confident-ai.com/guides/guides-red-teaming)
- [Custom Model Development](https://docs.confident-ai.com/guides/guides-using-custom-llms)

## 🆘 Troubleshooting

### Common Issues

**Ollama Connection Error**
```bash
# Ensure Ollama is running
ollama serve

# Check if models are pulled
ollama list
```

**API Key Issues**
```bash
# Verify API key is set
deepteam set-api-key your-key-here

# Check environment variables
echo $OPENAI_API_KEY
```

**Permission Errors**
```bash
# Ensure proper file permissions
chmod 644 config.yaml
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Confident AI](https://confident-ai.com/) for creating DeepTeam
- The open source community for contributions and feedback
- All contributors to this playground

---

**Happy Red Teaming! 🎯**

*Remember: The goal is to make AI systems more secure and robust through systematic testing and evaluation.*
