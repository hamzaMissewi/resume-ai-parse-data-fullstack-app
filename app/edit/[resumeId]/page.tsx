"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ResumeForm } from "@/components/resume-form"

interface ResumeData {
  name: string
  email: string
  phone: string
  summary: string
  experience: Array<{
    title: string
    company: string
    start_date: string
    end_date: string
    description: string
  }>
  education: Array<{
    degree: string
    institution: string
    start_date: string
    end_date: string
  }>
  skills: string[]
}

export default function EditResumePage({ params }: { params: { resumeId: string } }) {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Fetch resume data
    const fetchResume = async () => {
      try {
        const response = await fetch(`/api/resume/${params.resumeId}`)
        if (response.ok) {
          const data = await response.json()
          setResumeData(data.parsedData)
        }
      } catch (error) {
        console.error("Error fetching resume:", error)
      }
    }

    fetchResume()
  }, [params.resumeId])

  const handleSubmit = async (data: ResumeData) => {
    setIsLoading(true)

    try {
      const sections = {
        profile: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          summary: data.summary,
        },
        experience: data.experience,
        education: data.education,
        skills: data.skills,
      }

      const response = await fetch("/api/save-sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeId: params.resumeId,
          sections,
        }),
      })

      if (response.ok) {
        router.push(`/profile/${params.resumeId}`)
      } else {
        throw new Error("Save failed")
      }
    } catch (error) {
      console.error("Error saving:", error)
      alert("Failed to save resume. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!resumeData) {
    return <div className="container mx-auto py-8">Loading...</div>
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Resume</h1>
      <ResumeForm initialData={resumeData} onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  )
}
