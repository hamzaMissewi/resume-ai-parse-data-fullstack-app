import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { groq } from "@ai-sdk/groq"
import { z } from "zod"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const ResumeSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  summary: z.string(),
  experience: z.array(
    z.object({
      title: z.string(),
      company: z.string(),
      start_date: z.string(),
      end_date: z.string(),
      description: z.string(),
    }),
  ),
  education: z.array(
    z.object({
      degree: z.string(),
      institution: z.string(),
      start_date: z.string(),
      end_date: z.string(),
    }),
  ),
  skills: z.array(z.string()),
})

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    const { resumeId, textContent } = await request.json()

    if (!resumeId || !textContent) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify resume belongs to user
    const resume = await prisma.resume.findFirst({
      where: { id: resumeId, userId: user.id },
    })

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 })
    }

    // Parse resume with Groq
    const { object: parsedData } = await generateObject({
      model: groq("llama-3.1-70b-versatile"),
      schema: ResumeSchema,
      prompt: `
        Extract structured information from this resume text and return it as JSON.
        
        Resume text:
        ${textContent}
        
        Please extract:
        - Personal information (name, email, phone)
        - Professional summary
        - Work experience with job titles, companies, dates, and descriptions
        - Education with degrees, institutions, and dates
        - Skills as an array of strings
        
        Return only the JSON object with the exact structure requested.
      `,
    })

    // Update resume with parsed data
    await prisma.resume.update({
      where: { id: resumeId },
      data: { parsedData: parsedData as any },
    })

    return NextResponse.json({ parsedData })
  } catch (error) {
    console.error("Parse error:", error)
    return NextResponse.json({ error: "Parsing failed" }, { status: 500 })
  }
}
