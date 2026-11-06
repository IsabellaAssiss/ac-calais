import { mkdirSync } from "node:fs";
import { join } from "node:path";
import express from "express";
import { criarApp } from "./app.ts";

const PORTA = 3001;
const raiz = join(import.meta.dirname, "..");
const pastaDoBanco = join(raiz, "data");

mkdirSync(pastaDoBanco, { recursive: true });

const app = criarApp(join(pastaDoBanco, "monster-munchies.db"));
app.use(express.static(join(raiz, "dist")));

app.listen(PORTA, "127.0.0.1", () => {
  console.log(`Monster Munchies em http://localhost:${PORTA}`);
});
