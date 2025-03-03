import { toasts } from '$lib/stores/toastStore';
import supabase from '$lib/supabaseClient';
import type { FileObject } from '@supabase/storage-js';

export interface ImageUploadResult {
	url: string;
	path: string;
}

export const imageService = {
	/**
	 * Upload an image to Supabase storage
	 */
	async uploadImage(
		file: Blob | File,
		bucket: string = 'profile-images'
	): Promise<ImageUploadResult> {
		try {
			const fileExt = file instanceof File ? file.name.split('.').pop() : 'jpg';
			const fileName = `${Date.now()}.${fileExt}`;

			// console.log('Uploading file:', fileName);

			const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, {
				contentType: 'image/jpeg',
				upsert: true
			});

			if (error) throw error;
			if (!data) throw new Error('Upload failed - no data returned');

			// console.log('Upload successful:', data);

			const {
				data: { publicUrl }
			} = supabase.storage.from(bucket).getPublicUrl(data.path);

			// console.log('Public URL:', publicUrl);

			return {
				url: publicUrl,
				path: data.path
			};
		} catch (error) {
			console.error('Error uploading image:', error);
			throw new Error('Failed to upload image');
		}
	},

	/**
	 * Delete an image from Supabase storage
	 */
	async deleteImage(path: string, bucket: string = 'profile-images'): Promise<void> {
		try {
			// console.log('Deleting image:', path);
			const { error } = await supabase.storage.from(bucket).remove([path]);

			if (error) {
				console.error('Supabase delete error:', error);
				throw error;
			}
			toasts.success('Image deleted successfully');
		} catch (error) {
			console.error('Error deleting image:', error);
			toasts.error('Failed to delete image');
			throw new Error('Failed to delete image');
		}
	},

	/**
	 * List all images in a bucket
	 */
	async listImages(bucket: string = 'profile-images'): Promise<FileObject[]> {
		try {
			const { data, error } = await supabase.storage.from(bucket).list();

			if (error) throw error;
			if (!data) return [];

			return data;
		} catch (error) {
			console.error('Error listing images:', error);
			throw new Error('Failed to list images');
		}
	},

	/**
	 * Get public URL for an image
	 */
	getPublicUrl(path: string, bucket: string = 'profile-images'): string {
		const {
			data: { publicUrl }
		} = supabase.storage.from(bucket).getPublicUrl(path);

		return publicUrl;
	}
};
