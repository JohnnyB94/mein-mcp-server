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

    if (method === "reverseText") {
      const text = params?.text || "";
      const reversed = text.split("").reverse().join("");

      return res.json({
        result: {
          original: text,
          reversed
        }
      });
    }

    // Fallback
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
