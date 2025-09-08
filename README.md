
# Conversation Flow Builder

A **React + TypeScript + Vite** app for visually designing chatbot conversation flows. Export your flows as YAML or JSON for use in Playwright/MCP tests.

## Features

- **Visual Editor**: Drag-and-drop interface to build conversation flows.
- **Nodes**: Each node represents a step in the conversation, with:
  - `id`: Unique identifier
  - `label`: Human-friendly label (editable)
  - *(Planned)* `utterance`: What the user says at this step
  - *(Planned)* `expected`: Object with:
    - `intent`: Expected intent from the chatbot API
    - `key`: Key expected in the chatbot response
    - `bot`: Expected chatbot reply
- **Edges**: Connect nodes to represent conversation branching (`source` and `target`).
- **Editing**:
  - Add new nodes (button)
  - Edit node labels
  - Connect nodes by dragging
- **Export**: Output flows as simplified YAML or JSON for test automation.

## Example Export (YAML)

```yaml
nodes:
  - id: "1"
    label: "Start: User utterance"
edges:
  - source: "1"
    target: "2"
```

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Start the development server:**
   ```sh
   npm run dev
   ```
3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

- `src/` — Main source code
- `src/types/flow.ts` — Type definitions for nodes and edges
- `public/` — Static assets
- `vite.config.ts` — Vite configuration

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

MIT
