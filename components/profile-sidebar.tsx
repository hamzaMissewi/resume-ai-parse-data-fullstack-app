"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Briefcase, GraduationCap, Code } from "lucide-react"

interface Section {
  id: string
  type: string
  data: any
}

interface ProfileSidebarProps {
  sections: Section[]
  onSectionSelect: (section: Section) => void
  selectedSection?: Section
}

export function ProfileSidebar({ sections, onSectionSelect, selectedSection }: ProfileSidebarProps) {
  const getSectionIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "profile":
        return <User className="h-4 w-4" />
      case "experience":
        return <Briefcase className="h-4 w-4" />
      case "education":
        return <GraduationCap className="h-4 w-4" />
      case "skills":
        return <Code className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getSectionCount = (section: Section) => {
    if (section.type.toLowerCase() === "skills") {
      return Array.isArray(section.data) ? section.data.length : 0
    }
    if (Array.isArray(section.data)) {
      return section.data.length
    }
    return 1
  }

  return (
    <Card className="w-80">
      <CardContent className="p-4">
        <h3 className="font-semibold mb-4">Resume Sections</h3>
        <div className="space-y-2">
          {sections.map((section) => (
            <Button
              key={section.id}
              variant={selectedSection?.id === section.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => onSectionSelect(section)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  {getSectionIcon(section.type)}
                  <span className="capitalize">{section.type.toLowerCase()}</span>
                </div>
                <Badge variant="secondary" className="ml-2">
                  {getSectionCount(section)}
                </Badge>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
