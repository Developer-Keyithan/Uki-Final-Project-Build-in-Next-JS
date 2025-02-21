import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!
    },
});

const uploadFileToS3 = async (file: Buffer, fileName: string, contentType: string, userId: string, fileType: string) => {
    let directory = '';

    if (fileType === 'profile') {
        directory = `${userId}/Profile/`;
    } else if (fileType === 'product') {
        directory = `${userId}/Products/`;
    } else if (fileType === 'document') {
        directory = `${userId}/Documents/`;
    } else {
        throw new Error('Unsupported file type');
    }

    const fileKey = `User:${directory}${fileName}-${Date.now()}`;

    const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: fileKey,
        Body: file,
        ContentType: contentType
    };

    try {
        const command = new PutObjectCommand(uploadParams);
        await s3Client.send(command);
        return fileKey;
    } catch (error) {
        console.error('Error uploading file to S3:', error);
        throw new Error('Error uploading file to S3');
    }
};

export const POST = async (req: NextRequest) => {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        const fileType = formData.get('fileType') as string | null;
        const userId = formData.get('userId') as string | null;

        if (!file || !userId || !fileType) {
            return NextResponse.json({ error: 'File, userId, and fileType are required.' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        if (!(file instanceof File)) {
            return NextResponse.json({ error: 'Invalid file.' }, { status: 400 });
        }

        const fileKey = await uploadFileToS3(buffer, file.name, file.type, userId, fileType);
        const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${fileKey}`;

        return NextResponse.json({ success: true, imageUrl }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error uploading file.' }, { status: 500 });
    }
};
