import OpenAI from 'openai';
import { config } from '../../config/env';
import { SYSTEM_PROMPT } from '../../config/prompts';

export interface AIResponse {
  text: string;
  error?: string;
}

let client: OpenAI | null = null;
let messageHistory: { role: 'system' | 'user' | 'assistant'; content: string }[] = [];
let currentModel = config.model as string;

const getClient = (): OpenAI => {
  if (!config.openRouterApiKey) {
    throw new Error(
      'OpenRouter API key is not configured.\n\n' +
      'To set up:\n' +
      '1. Get a free API key at: https://openrouter.ai/keys\n' +
      '2. Create a ".env" file in the project root\n' +
      '3. Add: EXPO_PUBLIC_OPENROUTER_API_KEY=sk-or-v1-xxxx\n' +
      '4. Restart the dev server'
    );
  }
  if (!client) {
    client = new OpenAI({
      baseURL: config.baseUrl,
      apiKey: config.openRouterApiKey,
      dangerouslyAllowBrowser: true,
      timeout: config.timeout,
      maxRetries: 1,
      defaultHeaders: {
        'HTTP-Referer': window.location.origin,
        'X-Title': 'SchemeSetu',
      },
    });
  }
  return client;
};

function buildRequest(model: string) {
  return {
    model,
    messages: messageHistory,
    max_tokens: config.maxTokens,
    temperature: config.temperature,
  };
}

function handleModelError(status: number): string | null {
  if (status === 404) return 'model_not_found';
  if (status === 429) return 'rate_limited';
  if (status === 402) return 'insufficient_credits';
  if (status === 401) return 'invalid_key';
  if (status === 503) return 'service_unavailable';
  return null;
}

export async function sendMessage(
  userMessage: string,
  profileContext?: { occupation?: string; details?: Record<string, string> }
): Promise<AIResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.timeout);

  try {
    const openai = getClient();

    if (messageHistory.length === 0) {
      let systemPrompt = SYSTEM_PROMPT;
      if (profileContext?.occupation) {
        const details = profileContext.details || {};
        const detailStr = Object.entries(details)
          .filter(([_, v]) => v)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ');
        systemPrompt += `\n\n## USER PROFILE\nOccupation: ${profileContext.occupation}${detailStr ? '\nDetails: ' + detailStr : ''}\n\nUse this profile to prioritize relevant schemes. For example, if the user is a student, recommend scholarships and education schemes first.`;
      }
      messageHistory.push({ role: 'system', content: systemPrompt });
    }

    messageHistory.push({ role: 'user', content: userMessage });

    const modelsToTry = [config.model, ...config.fallbackModels];
    let lastError: string = '';

    for (let attempt = 0; attempt < modelsToTry.length; attempt++) {
      const model = modelsToTry[attempt];
      currentModel = model;

      try {
        const completion = await openai.chat.completions.create(buildRequest(model), {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const responseText = completion.choices?.[0]?.message?.content?.trim();

        if (!responseText) {
          messageHistory.pop();
          return { text: '', error: 'No response received. Please try again.' };
        }

        messageHistory.push({ role: 'assistant', content: responseText });

        if (messageHistory.length > 20) {
          messageHistory = [messageHistory[0], ...messageHistory.slice(-18)];
        }

        return { text: responseText };
      } catch (modelErr: unknown) {
        const me = modelErr as { status?: number; message?: string; code?: string };
        const errorTag = handleModelError(me.status || 0);

        if (errorTag === 'model_not_found' || errorTag === 'rate_limited' || errorTag === 'service_unavailable') {
          lastError = errorTag;
          continue;
        }

        if (errorTag === 'insufficient_credits') {
          clearTimeout(timeoutId);
          if (messageHistory.length > 1 && messageHistory[messageHistory.length - 1].role === 'user') {
            messageHistory.pop();
          }
          return {
            text: '',
            error: 'Insufficient OpenRouter credits. Add funds at https://openrouter.ai',
          };
        }

        if (errorTag === 'invalid_key') {
          clearTimeout(timeoutId);
          if (messageHistory.length > 1 && messageHistory[messageHistory.length - 1].role === 'user') {
            messageHistory.pop();
          }
          return {
            text: '',
            error: 'Invalid API key. Check EXPO_PUBLIC_OPENROUTER_API_KEY in your .env file.',
          };
        }

        lastError = me.message || 'unknown';
      }
    }

    clearTimeout(timeoutId);

    if (messageHistory.length > 1 && messageHistory[messageHistory.length - 1].role === 'user') {
      messageHistory.pop();
    }

    const errorMessages: Record<string, string> = {
      model_not_found: 'Current AI model is unavailable. Try again later.',
      rate_limited: 'Rate limit reached. Please wait and try again.',
      service_unavailable: 'AI service is temporarily unavailable. Try again later.',
    };

    return {
      text: '',
      error: errorMessages[lastError] || `AI request failed after ${modelsToTry.length} attempts. Please try again.`,
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const error = err as { status?: number; message?: string; code?: string };

    if (messageHistory.length > 1 && messageHistory[messageHistory.length - 1].role === 'user') {
      messageHistory.pop();
    }

    if (error.message?.includes('AbortError') || error.message?.includes('timeout')) {
      return { text: '', error: 'Request timed out. Please try again.' };
    }

    if (error.status === 429) {
      return { text: '', error: 'Rate limit reached. Please wait and try again.' };
    }

    if (error.status === 402) {
      return { text: '', error: 'Insufficient OpenRouter credits. Add funds at https://openrouter.ai' };
    }

    if (error.status === 401) {
      return { text: '', error: 'Invalid API key. Check your .env file.' };
    }

    console.error('OpenRouter error:', error);
    return { text: '', error: 'Something went wrong. Check your connection and try again.' };
  }
}

export function resetChat(): void {
  messageHistory = [];
}

export function getCurrentModel(): string {
  return currentModel;
}
