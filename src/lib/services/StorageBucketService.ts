import supabase from '$lib/supabaseClient';
import { toasts } from '$lib/stores/toastStore';

export function removeSpaces(str: string) {
    return str.replace(/\s+/g, '-');
}

export async function createStorageBucket(bucketName: string, isPublic: boolean = false) {
    try {
        const { data, error } = await supabase.storage.createBucket(bucketName, {
            public: isPublic,
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
            fileSizeLimit: 1024 * 1024 * 2 // 2MB limit
        });

        if (error) throw error;

        // Create both public and authenticated policies
        await Promise.all([
            createPublicAnonymousPolicy(bucketName),
            createPublicAuthenticatedPolicy(bucketName)
        ]);
        
        toasts.success(`Bucket ${bucketName} created successfully`);
        return data;
    } catch (error) {
        console.error('Failed to create bucket:', error);
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
        // Check if bucket exists, create if it doesn't
        if (!(await bucketExists(bucketName))) {
            await createStorageBucket(bucketName, true);
        }

        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(path, file);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Upload error:', error);
        toasts.error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return null;
    }
}
