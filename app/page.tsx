import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="container mx-auto py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Resume Parser</h1>
        <div>
          <SignedOut>
            <SignInButton>
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>

      <main className="container mx-auto py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">AI-Powered Resume Parser</h2>
          <p className="text-xl text-gray-600 mb-8">
            Upload your resume and let AI extract structured data for easy editing
          </p>

          <SignedOut>
            <SignInButton>
              <Button size="lg">Get Started</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link href="/upload">
              <Button size="lg">Upload Resume</Button>
            </Link>
          </SignedIn>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>1. Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Upload your resume in PDF or text format</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. AI Parse</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Our AI extracts structured data from your resume</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Edit & Save</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Review, edit, and save your structured resume data</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
