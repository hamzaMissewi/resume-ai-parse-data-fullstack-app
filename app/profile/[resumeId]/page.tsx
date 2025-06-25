"use client"

import { useState, useEffect } from "react"
import { ProfileSidebar } from "@/components/profile-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Section {
  id: string
  type: string
  data: any
}

export default function ProfilePage({ params }: { params: { resumeId: string } }) {
  const [sections, setSections] = useState<Section[]>([])
  const [selectedSection, setSelectedSection] = useState<Section | null>(null)

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch(`/api/sections/${params.resumeId}`)
        if (response.ok) {
          const data = await response.json()
          setSections(data.sections)
          if (data.sections.length > 0) {
            setSelectedSection(data.sections[0])
          }
        }
      } catch (error) {
        console.error("Error fetching sections:", error)
      }
    }

    fetchSections()
  }, [params.resumeId])

  const renderSectionContent = (section: Section) => {
    switch (section.type.toLowerCase()) {
      case "profile":
        return (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Name</h3>
              <p>{section.data.name}</p>
            </div>
            <div>
              <h3 className="font-semibold">Email</h3>
              <p>{section.data.email}</p>
            </div>
            <div>
              <h3 className="font-semibold">Phone</h3>
              <p>{section.data.phone}</p>
            </div>
            <div>
              <h3 className="font-semibold">Summary</h3>
              <p>{section.data.summary}</p>
            </div>
          </div>
        )

      case "experience":
        return (
          <div className="space-y-6">
            {section.data.map((exp: any, index: number) => (
              <div key={index} className="border-b pb-4">
                <h3 className="font-semibold">{exp.title}</h3>
                <p className="text-gray-600">{exp.company}</p>
                <p className="text-sm text-gray-500">
                  {exp.start_date} - {exp.end_date}
                </p>
                <p className="mt-2">{exp.description}</p>
              </div>
            ))}
          </div>
        )

      case "education":
        return (
          <div className="space-y-4">
            {section.data.map((edu: any, index: number) => (
              <div key={index} className="border-b pb-4">
                <h3 className="font-semibold">{edu.degree}</h3>
                <p className="text-gray-600">{edu.institution}</p>
                <p className="text-sm text-gray-500">
                  {edu.start_date} - {edu.end_date}
                </p>
              </div>
            ))}
          </div>
        )

      case "skills":
        return (
          <div className="flex flex-wrap gap-2">
            {section.data.map((skill: string, index: number) => (
              <Badge key={index} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        )

      default:
        return <p>No content available</p>
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Resume Profile</h1>

      <div className="flex gap-6">
        <ProfileSidebar sections={sections} onSectionSelect={setSelectedSection} selectedSection={selectedSection} />

        <div className="flex-1">
          {selectedSection ? (
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">{selectedSection.type.toLowerCase()}</CardTitle>
              </CardHeader>
              <CardContent>{renderSectionContent(selectedSection)}</CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">Select a section to view its content</CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
