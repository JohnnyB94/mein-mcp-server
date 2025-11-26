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

    // Tool: calculate (Taschenrechner)
if (method === "calculate") {
  const { a, b, op } = params || {};

  let result;

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
      result = b !== 0 ? a / b : "Division durch 0 nicht erlaubt";
      break;
    default:
      return res.json({
        error: { message: "Unbekannte Operation" }
      });
  }

  return res.json({
    result: {
      a,
      b,
      operation: op,
      result
    }
  });
}

    // Tool: triggerWebhook
if (method === "triggerWebhook") {
  const webhookUrl = "https://pixelkraftwerk.app.n8n.cloud/webhook-test/mcp-webhook";

  const payload = params?.payload || {};

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => null);

  return res.json({
    result: {
      status: response.status,
      responseFromN8n: data
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
