# DeepTeam Troubleshooting Guide 🔧

This document captures the specific issues we encountered when setting up DeepTeam and the solutions we implemented.

## 🚨 Issues Encountered During Initial Setup

### Issue 1: Ollama Configuration in config.yaml

**Problem**: The original `config.yaml` had an `ollama` section that was not recognized by DeepTeam.

**Original (Broken) Configuration**:
```yaml
# Ollama configuration
ollama:
  base_url: "http://localhost:11434"  # Default Ollama server URL
  timeout: 300  # Request timeout in seconds

# Red teaming models (separate from target)
models:
  simulator: gpt-3.5-turbo-0125
  evaluation: gpt-4o
```

**Error**: DeepTeam would not recognize this configuration format and would fail to load.

**Root Cause**: DeepTeam does not support a separate `ollama` section in the configuration file. The `ollama` section is not a valid configuration format.

### Issue 2: Incorrect Model Provider Specification

**Problem**: The models were specified as simple strings without provider information.

**Original (Broken) Configuration**:
```yaml
models:
  simulator: gpt-3.5-turbo-0125
  evaluation: gpt-4o
```

**Error**: DeepTeam would try to use these as OpenAI models by default, but the user wanted to use Ollama.

**Root Cause**: When no provider is specified, DeepTeam defaults to OpenAI, which requires API keys and internet connectivity.

## ✅ Solutions Implemented

### Solution 1: Proper Ollama Provider Configuration

**Correct Configuration**:
```yaml
# Red teaming models (separate from target)
models:
  simulator:
    provider: ollama
    model: llama3:latest
    base_url: http://localhost:11434
    temperature: 0
  evaluation:
    provider: ollama
    model: llama3:8b
    base_url: http://localhost:11434
    temperature: 0.1

# Target system configuration
target:
  purpose: "A helpful AI assistant"
  model:
    provider: ollama
    model: llama3:latest
    base_url: http://localhost:11434
    temperature: 0
```

**Key Changes**:
- Removed the invalid `ollama` section
- Added `provider: ollama` to each model specification
- Specified `base_url` for each model (defaults to `http://localhost:11434`)
- Added `temperature` parameters for better control

### Solution 2: Alternative CLI-Based Configuration

**CLI Command Alternative**:
```bash
# Set Ollama globally for all DeepTeam operations
deepteam set-ollama llama3:latest --base-url "http://localhost:11434"
```

**Benefits**:
- Simpler configuration management
- Global setting applies to all operations
- No need to modify config files for different models

## 🔍 Deep Dive: Why the Original Configuration Failed

### Configuration Loading Process

1. **DeepTeam loads config.yaml** using YAML parser
2. **Model specifications are parsed** by the `load_model()` function
3. **Provider detection** happens in this order:
   - If `provider` field exists → use specified provider
   - If no provider → default to "openai"
   - If provider is "ollama" → instantiate `OllamaModel`

### Code Analysis from DeepTeam Source

```python
def load_model(spec: Union[str, Dict[str, Any], None]) -> DeepEvalBaseLLM:
    if spec is None or isinstance(spec, str):
        # use deepeval helper which respects global config
        model, _ = initialize_model(spec)
        return model

    provider = str(spec.get("provider", "openai")).lower()  # Defaults to "openai"
    model_name = spec.get("model") or spec.get("model_name")
    temperature = spec.get("temperature", 0)

    if provider == "ollama":
        return OllamaModel(
            model=model_name,
            base_url=spec.get("base_url", "http://localhost:11434"),
            temperature=temperature,
        )
    # ... other providers
```

**Key Insights**:
- The `ollama` section in the original config was completely ignored
- Only model specifications under `models` and `target` are processed
- Provider defaults to "openai" if not specified

## 🛠️ Alternative Configuration Approaches

### Approach 1: Provider-Specific Config Files

Create separate config files for different providers:

```bash
# Copy the appropriate config for your provider
cp sample_configs/03_ollama_config.yaml config.yaml
cp sample_configs/01_openai_config.yaml config.yaml
cp sample_configs/06_anthropic_config.yaml config.yaml
```

### Approach 2: Mixed Provider Strategy

Use different providers for different purposes:

```yaml
models:
  simulator:
    provider: ollama          # Cost-effective attack generation
    model: llama3:latest
    base_url: http://localhost:11434
  evaluation:
    provider: openai          # High-quality evaluation
    model: gpt-4o
```

### Approach 3: Environment-Based Configuration

Use environment variables and CLI commands:

```bash
# Set provider globally
deepteam set-ollama llama3:latest

# Run with minimal config
deepteam run config.yaml
```

## 📋 Configuration Validation Checklist

Before running DeepTeam, ensure:

- [ ] **No invalid sections** like `ollama:` at the root level
- [ ] **Provider specified** for each model (`provider: ollama`)
- [ ] **Model names valid** for the specified provider
- [ ] **Base URLs correct** for local models
- [ ] **API keys set** for cloud providers (if applicable)
- [ ] **Models available** (e.g., Ollama models pulled)

## 🚀 Best Practices Learned

1. **Always specify provider** in model configurations
2. **Use sample configs** as starting points
3. **Test configurations** with simple commands first
4. **Keep configs minimal** - only include necessary fields
5. **Use CLI commands** for global provider settings
6. **Validate model availability** before running tests

## 🔗 Related Documentation

- [Sample Configurations](../sample_configs/) - Working examples for all providers
- [Main README](../README.md) - Project overview and setup guide
- [DeepTeam Documentation](https://docs.confident-ai.com/) - Official documentation

---

**Lesson Learned**: DeepTeam requires explicit provider specification in model configurations. The `ollama` section approach doesn't work - you must specify `provider: ollama` for each model that should use Ollama.
