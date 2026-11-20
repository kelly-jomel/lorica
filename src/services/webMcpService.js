// WebMCP Tool Registration for In-Browser AI Agents
// Spec: navigator.modelContext.registerTool(toolDefinition)

export function registerWebMCPTools() {
  if (typeof window === 'undefined') return;

  // Polyfill/stub navigator.modelContext if absent so inspecting agents find exposed tool definitions
  if (!navigator.modelContext) {
    navigator.modelContext = {
      tools: new Map(),
      registerTool(tool) {
        if (!tool || !tool.name) return;
        this.tools.set(tool.name, tool);
        console.log(`[WebMCP] Registered tool: ${tool.name}`);
      },
      getTools() {
        return Array.from(this.tools.values());
      }
    };
  }

  // 1. Tool: search_prayers
  try {
    navigator.modelContext.registerTool({
      name: 'search_prayers',
      description: 'Search the Lorica treasury for Catholic prayers, litanies, and psalms by keyword, Latin title, or intention.',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Keyword, saint name, or prayer title (e.g. "St. Michael", "Psalm 91", "Pater Noster").'
          }
        },
        required: ['query']
      },
      execute: async ({ query }) => {
        window.location.hash = `#treasury?q=${encodeURIComponent(query || '')}`;
        return {
          status: 'success',
          message: `Opened prayer treasury for query: ${query}`
        };
      }
    });

    // 2. Tool: play_sacred_audio
    navigator.modelContext.registerTool({
      name: 'play_sacred_audio',
      description: 'Trigger audio playback for a prayer or novena in the Lorica sanctuary.',
      inputSchema: {
        type: 'object',
        properties: {
          prayer_id: {
            type: 'string',
            description: 'Slug or identifier of the prayer (e.g. "psalm-91", "st-michael", "surrender-novena").'
          }
        },
        required: ['prayer_id']
      },
      execute: async ({ prayer_id }) => {
        window.location.hash = `#play-${encodeURIComponent(prayer_id)}`;
        return {
          status: 'success',
          prayer_id,
          message: `Activated sacred audio player for ${prayer_id}`
        };
      }
    });

    // 3. Tool: open_novenas_directory
    navigator.modelContext.registerTool({
      name: 'open_novenas_directory',
      description: 'View the 12 complete 9-day Catholic novenas paired with the Holy Rosary.',
      inputSchema: {
        type: 'object',
        properties: {}
      },
      execute: async () => {
        window.location.hash = '#novenas';
        return { status: 'success', message: 'Navigated to Catholic Novenas directory.' };
      }
    });

    // 4. Tool: open_benefactor_portal
    navigator.modelContext.registerTool({
      name: 'open_benefactor_portal',
      description: 'Access the Benefactor & Pilgrim portal to view giving history, cancel PayPal subscriptions, or sign in.',
      inputSchema: {
        type: 'object',
        properties: {}
      },
      execute: async () => {
        window.location.hash = '#portal';
        return { status: 'success', message: 'Opened Benefactor and Pilgrim Portal.' };
      }
    });

  } catch (err) {
    console.warn('[WebMCP] Tool registration failed:', err);
  }
}
