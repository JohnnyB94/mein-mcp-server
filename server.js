import express from "express";

const app = express();
app.use(express.json());

// ===============================
// TOOL DEFINITIONEN
// ===============================

const tools = [
  {
    name: "sayHello",
    description: "Gibt eine personalisierte Begrüßung zurück",
    inputs: {
      type: "object",
      properties: {
        name: { type: "string" }
      },
      required: ["name"]
    }
  },
  {
    name: "getServerTime",
    description: "Gibt die aktuelle Serverzeit zurück",
    inputs: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "calculate",
    description: "Ein einfacher Taschenrechner",
    inputs: {
      type: "object",
      properties: {
        a: { type: "number" },
        b: { type: "number" },
        op: {
          type: "string",
          enum: ["add", "sub", "mul", "div"]
        }
      },
      required: ["a", "b", "op"]
    }
  }
];

// ===============================
// MCP TOOL DISCOVERY (für AI Agent)
// ===============================

app.get("/mcp/tools", (req, res) => {
  res.json({
    tools: tools.map(tool => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputs
    }))
  });
});

// ===============================
// MCP STREAM ENDPOINT
// ===============================

app.post("/mcp", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Transfer-Encoding", "chunked");

  const { tool, arguments: args } = req.body || {};
  let result = null;

  // 🔹 sayHello
  if (tool === "sayHello") {
    result = {
      message: `Hallo ${args?.name || "Unbekannt"}! 👋`
    };
  }

  // 🔹 getServerTime
  if (tool === "getServerTime") {
    const now = new Date();
    result = {
      iso: now.toISOString(),
      readable: now.toLocaleString(),
      timestamp: now.getTime()
    };
  }

  // 🔹 calculate
  if (tool === "calculate") {
    const { a, b, op } = args || {};

    switch (op) {
      case "add":
        result = a + b;
        break;
      case "sub":
        result = a - b;
        break;
      case "mul":
        result = a * b;
        break;
      case "div":
        result = b !== 0 ? a / b : null;
        break;
      default:
        result = "Unbekannte Operation";
    }
  }

  // Fallback falls Tool nicht existiert
  if (!result) {
    result = {
      error: "Unbekanntes Tool oder fehlende Parameter"
    };
  }

  res.write(JSON.stringify({ result }));
  res.end();
});

// ===============================
// HEALTH CHECK
// ===============================

app.get("/health", (req, res) => {
  res.json({ status: "✅ MCP Server läuft" });
});

// ===============================
// SERVER START
// ===============================

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`✅ MCP Server läuft auf Port ${PORT}`);
});
