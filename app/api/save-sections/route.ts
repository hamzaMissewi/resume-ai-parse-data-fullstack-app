import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import type { SectionType } from "@prisma/client"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    const { resumeId, sections } = await request.json()

    // Verify resume belongs to user
    const resume = await prisma.resume.findFirst({
      where: { id: resumeId, userId: user.id },
    })

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 })
    }

    // Delete existing sections
    await prisma.section.deleteMany({
      where: { resumeId },
    })

    // Create new sections
    const sectionPromises = Object.entries(sections).map(([type, data]) => {
      return prisma.section.create({
        data: {
          resumeId,
          type: type.toUpperCase() as SectionType,
          data: data as any,
        },
      })
    })

    await Promise.all(sectionPromises)

    return NextResponse.json({ message: "Sections saved successfully" })
  } catch (error) {
    console.error("Save error:", error)
    return NextResponse.json({ error: "Save failed" }, { status: 500 })
  }
}
