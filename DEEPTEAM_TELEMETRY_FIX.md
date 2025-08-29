# DeepTeam Telemetry Fix Documentation

## Problem Description

When running `deepteam config.yaml`, users encounter the following error:

```
TypeError: capture() takes 2 positional arguments but 3 were given
```

This error occurs during the telemetry initialization phase when DeepTeam tries to capture usage analytics.

## Root Cause

The issue is in the `deepteam/telemetry.py` file where the `posthog.capture()` method is called incorrectly. The PostHog `capture()` method expects:

- **First argument**: Event name (string)
- **Keyword arguments**: `distinct_id`, `properties`, etc.

However, the original code was calling it with the wrong argument order:

```python
# INCORRECT - This causes the TypeError
posthog.capture(get_unique_id(), f"Invoked redteamer")
posthog.capture(get_unique_id(), f"Invoked guardrail")
```

## Affected Versions

This fix applies to:
- **DeepTeam version**: 0.2.4 (as seen in the installed package)
- **PostHog version**: 6.7.0+ (which changed the API signature)

## Solution

### Step 1: Locate the Problem File

The issue is in the DeepTeam telemetry module:
```
deepteam-playground/lib/python3.9/site-packages/deepteam/telemetry.py
```

### Step 2: Fix the Incorrect Function Calls

Replace the incorrect calls in the `capture_red_teamer_run` and `capture_guardrail_run` functions:

**Before (Incorrect):**
```python
@contextmanager
def capture_red_teamer_run(vulnerabilities: List[str], attacks: List[str]):
    if not telemetry_opt_out():
        with tracer.start_as_current_span(f"Invoked redteamer") as span:
            posthog.capture(get_unique_id(), f"Invoked redteamer")  # WRONG
            # ... rest of function

@contextmanager
def capture_guardrail_run(type: str, guards: List[str]):
    if not telemetry_opt_out():
        with tracer.start_as_current_span(f"Invoked guardrail") as span:
            posthog.capture(get_unique_id(), f"Invoked guardrail")  # WRONG
            # ... rest of function
```

**After (Correct):**
```python
@contextmanager
def capture_red_teamer_run(vulnerabilities: List[str], attacks: List[str]):
    if not telemetry_opt_out():
        with tracer.start_as_current_span(f"Invoked redteamer") as span:
            posthog.capture("Invoked redteamer", distinct_id=get_unique_id())  # CORRECT
            # ... rest of function

@contextmanager
def capture_guardrail_run(type: str, guards: List[str]):
    if not telemetry_opt_out():
        with tracer.start_as_current_span(f"Invoked guardrail") as span:
            posthog.capture("Invoked guardrail", distinct_id=get_unique_id())  # CORRECT
            # ... rest of function
```

### Step 3: Verify the Fix

After applying the fix, the correct PostHog API usage should be:

```python
posthog.capture("Invoked redteamer", distinct_id=get_unique_id())
posthog.capture("Invoked guardrail", distinct_id=get_unique_id())
```

## Why This Happened

The PostHog library changed its API signature between versions 5.3.0 and 6.0.0. The old signature allowed:

```python
posthog.capture(distinct_id, event_name)
```

But the new signature enforces:

```python
posthog.capture(event_name, distinct_id=distinct_id)
```

This change was made to prevent confusion and enforce proper argument ordering.

## Alternative Solutions

### Option 1: Downgrade PostHog (Not Recommended)
```bash
pip install "posthog<6.0.0"
```
**Note**: This may cause compatibility issues with other packages.

### Option 2: Update DeepTeam (Recommended)
```bash
pip install --upgrade deepteam
```
**Note**: This fix should be included in future versions of DeepTeam.

## Verification

After applying the fix, running `deepteam config.yaml` should no longer produce the TypeError. Instead, you'll get the expected error about missing API keys:

```
OpenAIError: The api_key client option must be set either by passing api_key to the client or by setting the OPENAI_API_KEY environment variable
```

This indicates the telemetry issue is resolved and the application is proceeding normally.

## Related Issues

This same pattern of incorrect PostHog `capture()` calls may exist in other parts of the codebase. If you encounter similar errors, search for:

```bash
grep -r "posthog\.capture(" /path/to/deepteam/installation
```

And look for calls that don't use the `distinct_id=` keyword argument format.

## Support

If you continue to experience issues after applying this fix:

1. Check that you're using the correct PostHog version
2. Verify the fix was applied to the correct file
3. Ensure there are no other incorrect `posthog.capture()` calls
4. Consider upgrading to the latest version of DeepTeam

## File Locations

The fix applies to these specific functions in `deepteam/telemetry.py`:
- `capture_red_teamer_run()` - around line 136
- `capture_guardrail_run()` - around line 160
