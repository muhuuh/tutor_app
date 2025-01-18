import { supabase } from './supabase';

export const storage = {
  async uploadFile(file: File, fileName: string) {
    const fileExt = file.name.split('.').pop();
    const filePath = `assignments/${fileName}.${fileExt}`;

    const { error } = await supabase.storage
      .from('assignments')
      .upload(filePath, file);

    if (error) throw error;
    return filePath;
  },

  async getFileUrl(filePath: string) {
    const { data } = await supabase.storage
      .from('assignments')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  },

  async deleteFile(filePath: string) {
    const { error } = await supabase.storage
      .from('assignments')
      .remove([filePath]);

    if (error) throw error;
  }
};