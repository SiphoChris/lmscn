// import { NextResponse } from "next/server"
// import registry from "@/registry.json"
// import fs from "fs"
// import path from "path"

// export async function GET(
//   _req: Request,
//   { params }: { params: Promise<{ name: string }> }
// ) {
//   const { name } = await params
//   const cleanName = name.replace(/\.json$/, "")
//   const item = registry.items.find((i) => i.name === cleanName)

//   if (!item) {
//     return NextResponse.json({ error: "Not found" }, { status: 404 })
//   }

//   const filesWithContent = item.files.map((file) => {
//     const filePath = path.join(process.cwd(), file.path)
//     const content = fs.readFileSync(filePath, "utf-8")
//     return { ...file, content }
//   })

//   return NextResponse.json({ ...item, files: filesWithContent })
// }



// install components into @/components/lms/

import { NextResponse } from "next/server"
import registry from "@/registry.json"
import fs from "fs"
import path from "path"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params
  const cleanName = name.replace(/\.json$/, "")
  const item = registry.items.find((i) => i.name === cleanName)

  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const filesWithContent = item.files.map((file) => {
    const filePath = path.join(process.cwd(), file.path)
    const content = fs.readFileSync(filePath, "utf-8")

    const filename = path.basename(file.path)
    const target = `components/lms/${filename}`

    console.log("[registry] file.path:", file.path, "-> target:", target)

    return { ...file, target, content }
  })

  return NextResponse.json({ ...item, files: filesWithContent })
}