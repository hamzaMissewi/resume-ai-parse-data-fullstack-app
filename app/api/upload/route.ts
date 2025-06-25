import { type NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['application/pdf', 'text/plain'];

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: 'File too large' },
                { status: 400 }
            );
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type' },
                { status: 400 }
            );
        }

        console.log('before create, user', user, 'file: ', file);

        // Save file metadata
        const resume = await prisma.resume.create({
            data: {
                userId: user.id,
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
            },
        });

        console.log('prisma resume ', resume);

        // Extract text content
        let textContent = '';
        if (file.type === 'text/plain') {
            textContent = await file.text();
        } else if (file.type === 'application/pdf') {
            console.log('file selected is a PDF ');
            // For PDF, you'd typically use a library like pdf-parse
            // For now, we'll simulate text extraction
            textContent = await file.text(); // This won't work for PDF in reality
        }

        return NextResponse.json({
            resumeId: resume.id,
            textContent,
            message: 'File uploaded successfully',
        });
    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: error.message || 'Upload failed' },
            { status: 500 }
        );
    }
}
