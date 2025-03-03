import supabase from '$lib/supabaseClient';
import { toasts } from '$lib/stores/toastStore';

export function removeSpaces(str: string) {
    return str.replace(/\s+/g, '-');
}

export async function createStorageBucket(bucketName: string, isPublic: boolean = false) {
    try {
        // console.log('Attempting to create bucket:', bucketName);
        const { data, error } = await supabase.storage.createBucket(bucketName, {
            public: isPublic,
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
            fileSizeLimit: 1024 * 1024 * 2 // 2MB limit
        });

        if (error) {
            console.error('Bucket creation error:', error);
            throw error;
        }
        // console.log('Bucket created successfully:', bucketName);

        // Create both public and anonymous policies
        // console.log('Setting up bucket policies for:', bucketName);
        await Promise.all([
            createPublicAnonymousPolicy(bucketName),
            createPublicAuthenticatedPolicy(bucketName)
        ]);
        
        return data;
    } catch (error) {
        console.error('Failed to create bucket:', bucketName, error);
        toasts.error(`Failed to create bucket: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return null;
    }
}

export async function createPublicAnonymousPolicy(bucketName: string) {
    try {
        const { error } = await supabase.rpc('create_public_anonymous_policy', { bucket_name: bucketName });
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Failed to create anonymous policy:', error);
        return false;
    }
}

export async function createPublicAuthenticatedPolicy(bucketName: string) {
    try {
        const { error } = await supabase.rpc('create_authenticated_bucket_policy', { bucket_name: bucketName });
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Failed to create authenticated policy:', error);
        return false;
    }
}

export async function bucketExists(bucketName: string): Promise<boolean> {
    try {
        const { data, error } = await supabase.storage.getBucket(bucketName);
        if (error) return false;
        return !!data;
    } catch {
        return false;
    }
}

export async function uploadFile(bucketName: string, path: string, file: File) {
    try {
        // Split the path to get just the bucket name (first part)
        const [bucket, ...pathParts] = bucketName.split('/');
        const subfolderPath = pathParts.join('/');
        
        // console.log('Upload request:', { 
        //     originalBucket: bucketName,
        //     bucket,
        //     subfolderPath,
        //     fileName: file.name 
        // });
        
        if (!(await bucketExists(bucket))) {
            // console.log('Bucket does not exist, creating:', bucket);
            await createStorageBucket(bucket, true);
        } else {
            // console.log('Bucket exists:', bucket);
        }

        // Construct the full path for the file
        const cleanFileName = removeSpaces(file.name);
        const fullPath = subfolderPath 
            ? `${subfolderPath}/${cleanFileName}`
            : cleanFileName;
            
        // console.log('Uploading to path:', fullPath);

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(fullPath, file, { upsert: true });

        if (error) {
            console.error('Upload error:', error);
            throw error;
        }
        // console.log('Upload successful:', data);
        return data;
    } catch (error) {
        console.error('Upload failed:', error);
        toasts.error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return null;
    }
}

export function RemovePublicDomain(url: string) {
    return url.replace(import.meta.env.VITE_PUBLIC_SUPABASE_URL + '/storage/v1/object', '');
}

export function getPublicUrl(bucket: string, path: string) {
    if (!path) return '';
    
    // Use the environment variable for Supabase URL
    return `${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/storage/v1/object/${bucket}/${path}`;
}
