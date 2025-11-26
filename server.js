import express from "express";

const app = express();
app.use(express.json());

// MCP-kompatibler Endpoint
app.post("/mcp", async (req, res) => {
  try {
    const { method, params } = req.body;

    if (method === "sayHello") {
      const name = params?.name || "Unbekannt";
      return res.json({
        result: {
          message: `Hallo ${name}, dein MCP Server läuft jetzt stabil online!`
        }
      });
    }

    res.json({
      error: {
        code: -32601,
        message: "Method not found"
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`✅ MCP Server läuft auf Port ${PORT}`);
});
