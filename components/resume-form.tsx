"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

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

interface ResumeFormProps {
  initialData?: ResumeData
  onSubmit: (data: ResumeData) => void
  isLoading?: boolean
}

export function ResumeForm({ initialData, onSubmit, isLoading }: ResumeFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResumeData>({
    defaultValues: initialData || {
      name: "",
      email: "",
      phone: "",
      summary: "",
      experience: [{ title: "", company: "", start_date: "", end_date: "", description: "" }],
      education: [{ degree: "", institution: "", start_date: "", end_date: "" }],
      skills: [""],
    },
  })

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: "experience",
  })

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: "education",
  })

  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control,
    name: "skills",
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            {...register("name", { required: "Name is required" })}
            placeholder="Full Name"
            error={errors.name?.message}
          />
          <Input
            {...register("email", { required: "Email is required" })}
            type="email"
            placeholder="Email"
            error={errors.email?.message}
          />
          <Input {...register("phone")} placeholder="Phone Number" />
          <Textarea {...register("summary")} placeholder="Professional Summary" rows={4} />
        </CardContent>
      </Card>

      {/* Experience Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Work Experience</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendExperience({ title: "", company: "", start_date: "", end_date: "", description: "" })}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Experience
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {experienceFields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Experience {index + 1}</h4>
                {experienceFields.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeExperience(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input {...register(`experience.${index}.title`)} placeholder="Job Title" />
                <Input {...register(`experience.${index}.company`)} placeholder="Company" />
                <Input {...register(`experience.${index}.start_date`)} placeholder="Start Date" />
                <Input {...register(`experience.${index}.end_date`)} placeholder="End Date" />
              </div>
              <Textarea {...register(`experience.${index}.description`)} placeholder="Job Description" rows={3} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Education Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Education</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendEducation({ degree: "", institution: "", start_date: "", end_date: "" })}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {educationFields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Education {index + 1}</h4>
                {educationFields.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeEducation(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input {...register(`education.${index}.degree`)} placeholder="Degree" />
                <Input {...register(`education.${index}.institution`)} placeholder="Institution" />
                <Input {...register(`education.${index}.start_date`)} placeholder="Start Date" />
                <Input {...register(`education.${index}.end_date`)} placeholder="End Date" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Skills Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Skills</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={() => appendSkill("")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Skill
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {skillFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input {...register(`skills.${index}`)} placeholder="Skill" className="flex-1" />
              {skillFields.length > 1 && (
                <Button type="button" variant="ghost" size="sm" onClick={() => removeSkill(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Resume"}
      </Button>
    </form>
  )
}
