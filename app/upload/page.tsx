'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, FileText, Loader2 } from 'lucide-react';

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isParsing, setIsParsing] = useState(false);
    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);

        try {
            // Upload file
            const formData = new FormData();
            formData.append('file', file);

            const uploadResponse = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!uploadResponse.ok) {
                throw new Error('Upload failed');
            }

            const { resumeId, textContent } = await uploadResponse.json();

            setIsUploading(false);
            setIsParsing(true);

            // Parse resume
            const parseResponse = await fetch('/api/parse-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeId, textContent }),
            });

            if (!parseResponse.ok) {
                throw new Error('Parsing failed');
            }

            console.log('parse response', parseResponse);

            const { parsedData } = await parseResponse.json();

            // Redirect to edit form with parsed data
            router.push(`/edit/${resumeId}`);
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setIsUploading(false);
            setIsParsing(false);
        }
    };

    return (
        <div className='container mx-auto py-8'>
            <Card className='max-w-md mx-auto'>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        <Upload className='h-5 w-5' />
                        Upload Resume
                    </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center'>
                        <FileText className='h-12 w-12 mx-auto text-gray-400 mb-4' />
                        <Input
                            type='file'
                            accept='.pdf,.txt'
                            onChange={handleFileChange}
                            className='mb-4'
                        />
                        <p className='text-sm text-gray-600'>
                            Upload PDF or text files (max 10MB)
                        </p>
                    </div>

                    {file && (
                        <div className='text-sm text-gray-600'>
                            Selected: {file.name} (
                            {(file.size / 1024 / 1024).toFixed(2)} MB)
                        </div>
                    )}

                    <Button
                        onClick={handleUpload}
                        disabled={!file || isUploading || isParsing}
                        className='w-full'>
                        {isUploading && (
                            <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                        )}
                        {isParsing && (
                            <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                        )}
                        {isUploading
                            ? 'Uploading...'
                            : isParsing
                            ? 'Parsing...'
                            : 'Upload & Parse'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
