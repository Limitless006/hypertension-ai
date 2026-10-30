export interface Part {
  text: string;
}

export interface Content {
  role: 'user' | 'model' | 'system';
  parts: Part[];
}

export interface ModelParams {
  model: string;
  systemInstruction?: string | { parts: Part[] };
  generationConfig?: {
    temperature?: number;
    topP?: number;
    topK?: number;
    maxOutputTokens?: number;
  };
}

export interface GenerateContentResult {
  response: {
    text: () => string;
  };
}

export interface ChatSession {
  sendMessage: (prompt: string) => Promise<GenerateContentResult>;
}

export interface GenerativeModel {
  generateContent: (contents: string | Content[] | { contents: Content[] }) => Promise<GenerateContentResult>;
  startChat: (options?: { history?: Content[] }) => ChatSession;
}

export class GoogleGenerativeAI {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey || '';
  }

  getGenerativeModel(params: ModelParams): GenerativeModel {
    const apiKey = this.apiKey;
    const model = params.model || 'gemini-1.5-flash';
    const systemInstruction = params.systemInstruction;
    const generationConfig = params.generationConfig;

    return {
      async generateContent(req: string | Content[] | { contents: Content[] }): Promise<GenerateContentResult> {
        let contents: Content[] = [];
        if (typeof req === 'string') {
          contents = [{ role: 'user', parts: [{ text: req }] }];
        } else if (Array.isArray(req)) {
          contents = req;
        } else if (req && req.contents) {
          contents = req.contents;
        }

        const body: any = {
          contents: contents.map((c) => ({
            role: c.role === 'model' ? 'model' : 'user',
            parts: c.parts || [{ text: (c as any).text || '' }],
          })),
        };

        if (systemInstruction) {
          body.systemInstruction =
            typeof systemInstruction === 'string'
              ? { parts: [{ text: systemInstruction }] }
              : systemInstruction;
        }

        if (generationConfig) {
          body.generationConfig = generationConfig;
        }

        const candidateModels = [model, 'gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-2.5-flash'];
        let lastError: any = null;

        for (const targetModel of Array.from(new Set(candidateModels))) {
          try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apiKey}`;
            const res = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
            });

            if (!res.ok) {
              const errText = await res.text();
              lastError = new Error(`Gemini API Error (${res.status}): ${errText}`);
              continue;
            }

            const data = await res.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
            return {
              response: {
                text: () => text,
              },
            };
          } catch (err: any) {
            lastError = err;
          }
        }

        throw lastError || new Error('Failed to generate content from Gemini API');
      },

      startChat(options: { history?: Content[] } = {}): ChatSession {
        const history: Content[] = options.history ? [...options.history] : [];
        const modelRef = this;

        return {
          async sendMessage(message: string): Promise<GenerateContentResult> {
            history.push({ role: 'user', parts: [{ text: message }] });
            const result = await modelRef.generateContent(history);
            const responseText = result.response.text();
            history.push({ role: 'model', parts: [{ text: responseText }] });
            return result;
          },
        };
      },
    };
  }
}
