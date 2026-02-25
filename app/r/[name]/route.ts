import { NextResponse } from "next/server"
import registry from "@/registry.json"
import fs from "fs"
import path from "path"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params
  const item = registry.items.find((i) => i.name === name)

  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const filesWithContent = item.files.map((file) => {
    const filePath = path.join(process.cwd(), file.path)
    const content = fs.readFileSync(filePath, "utf-8")
    return { ...file, content }
  })

  return NextResponse.json({ ...item, files: filesWithContent })
}