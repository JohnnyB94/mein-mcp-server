// ===============================
// ✅ server.js
// ===============================


import express from "express";
import { MCPServer } from "@modelcontextprotocol/sdk/server/index.js";


const app = express();
app.use(express.json());


const server = new MCPServer({
name: "mein-mcp-server",
version: "1.0.0",
});


server.tool("sayHello", {
description: "Gibt eine Begrüßung zurück",
inputSchema: {
type: "object",
properties: {
name: { type: "string" }
},
required: ["name"]
},
handler: async ({ name }) => {
return { message: `Hallo ${name}, dein MCP Server läuft online!` };
}
});


app.post("/mcp", async (req, res) => {
try {
const response = await server.handleRequest(req.body);
res.json(response);
} catch (error) {
res.status(500).json({ error: error.message });
}
});


const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
console.log(`✅ MCP Server läuft auf Port ${PORT}`);
});
