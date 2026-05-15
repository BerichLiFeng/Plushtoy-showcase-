import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function filePath(table: string): string {
  return path.join(DATA_DIR, `${table}.json`);
}

export function readData<T extends { id: number }>(table: string): T[] {
  ensureDir();
  const fp = filePath(table);
  if (!fs.existsSync(fp)) return [];
  try {
    return JSON.parse(fs.readFileSync(fp, "utf-8"));
  } catch {
    return [];
  }
}

export function writeData<T>(table: string, data: T[]): void {
  ensureDir();
  fs.writeFileSync(filePath(table), JSON.stringify(data, null, 2), "utf-8");
}

let _nextId: Record<string, number> = {};

function nextId(table: string): number {
  if (!_nextId[table]) {
    const data = readData<{ id: number }>(table);
    _nextId[table] = data.length > 0 ? Math.max(...data.map((d) => d.id)) + 1 : 1;
  }
  return _nextId[table]++;
}

export function getAll<T extends { id: number }>(table: string): T[] {
  return readData<T>(table);
}

export function getById<T extends { id: number }>(table: string, id: number): T | undefined {
  return readData<T>(table).find((d) => d.id === id);
}

export function create<T extends { id: number }>(table: string, item: Omit<T, "id">): T {
  const data = readData<T>(table);
  const newItem = { ...item, id: nextId(table) } as T;
  data.push(newItem);
  writeData(table, data);
  return newItem;
}

export function update<T extends { id: number }>(table: string, id: number, updates: Partial<T>): T | null {
  const data = readData<T>(table);
  const idx = data.findIndex((d) => d.id === id);
  if (idx === -1) return null;
  data[idx] = { ...data[idx], ...updates };
  writeData(table, data);
  return data[idx];
}

export function remove<T extends { id: number }>(table: string, id: number): boolean {
  const data = readData<T>(table);
  const idx = data.findIndex((d) => d.id === id);
  if (idx === -1) return false;
  data.splice(idx, 1);
  writeData(table, data);
  return true;
}

/** Seed initial data if the table is empty */
export function seedData<T extends { id: number }>(table: string, items: Omit<T, "id">[]): void {
  const existing = readData<T>(table);
  if (existing.length > 0) return;
  const seeded = items.map((item, i) => ({ ...item, id: i + 1 } as T));
  writeData(table, seeded);
  _nextId[table] = seeded.length + 1;
}