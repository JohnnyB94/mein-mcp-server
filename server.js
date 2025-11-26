import express from "express";

const app = express();
app.use(express.json());

// Tool-Definition für MCP Client
const tools = [
  {
    name: "sayHello",
    description: "Gibt eine Begrüßung zurück",
    inputs: {
      type: "object",
      properties: {
        name: { type: "string" }
      }
    }
  },
  {
    name: "getServerTime",
    description: "Gibt die aktuelle Serverzeit zurück",
    inputs: {
      type: "object"
    }
  },
  {
    name: "calculate",
    description: "Einfacher Taschenrechner",
    inputs: {
      type: "object",
      properties: {
        a: { type: "number" },
        b: { type: "number" },
        op: { type: "string" }
      }
    }
  }
];

// MCP Tool Discovery (für n8n MCP Client)
app.get("/mcp/tools", (req, res) => {
  res.json({ tools });
});

// MCP Stream Endpoint (kompatibel mit HTTP Streamable)
app.post("/mcp", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Transfer-Encoding", "chunked");

  const { tool, arguments: args } = req.body || {};

  let result = null;

  if (tool === "sayHello") {
    result = { message: `Hallo ${args?.name || "Unbekannt"}` };
  }

  if (tool === "getServerTime") {
    const now = new Date();
    result = {
      iso: now.toISOString(),
      timestamp: now.getTime()
    };
  }

  if (tool === "calculate") {
    const { a, b, op } = args || {};
    switch (op) {
      case "add": result = a + b; break;
      case "sub": result = a - b; break;
      case "mul": result = a * b; break;
      case "div": result = b !== 0 ? a / b : null; break;
    }
  }

  res.write(JSON.stringify({ result }));
  res.end();
});

// Server starten
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`✅ MCP Stream Server läuft auf Port ${PORT}`);
});
