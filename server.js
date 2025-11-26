import express from "express";

const app = express();
app.use(express.json());

// MCP Endpoint
app.post("/mcp", async (req, res) => {
  try {
    const { method, params } = req.body;

    // Tool 1: sayHello
    if (method === "sayHello") {
      const name = params?.name || "Unbekannt";

      return res.json({
        result: {
          message: `Hallo ${name}, dein MCP Server läuft jetzt stabil online!`
        }
      });
    }

    // Tool 2: reverseText
    if (method === "reverseText") {
      const text = params?.text || "";
      const reversed = text.split("").reverse().join("");

      return res.json({
        result: {
          original: text,
          reversed: reversed
        }
      });
    }

    // Tool 3: getServerTime
    if (method === "getServerTime") {
      const now = new Date();

      return res.json({
        result: {
          iso: now.toISOString(),
          timestamp: now.getTime()
        }
      });
    }

    // Fallback wenn Methode nicht existiert
    return res.json({
      error: {
        code: -32601,
        message: "Method not found"
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Server starten
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`✅ MCP Server läuft auf Port ${PORT}`);
});
