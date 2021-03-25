import { Storage } from 'aws-amplify';

export interface S3File {
  key: string;
}

export async function s3Upload(file: File) {
  const filename = `${Date.now()}-${file.name}`;

  const stored = await Storage.vault.put(filename, file, {
    contentType: file.type
  }) as S3File;

  return stored.key;
}
