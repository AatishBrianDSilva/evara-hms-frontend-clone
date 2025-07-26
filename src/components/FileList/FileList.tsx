// components/FileList.tsx
import React, { useEffect, useState } from 'react';
import { Box, Link, Typography, CircularProgress } from '@mui/material';
import { OpenInNew } from '@mui/icons-material';
import { EBuckets, EDocumentTypes } from '../../types/global';
import { useGetSignedUrlMutation } from '../../services/filesApi';

interface FileListProps {
  files: string | string[];
  title?: string;
  bucket?: EBuckets;
  documentType?: EDocumentTypes;
  userId?: string;
  reportId?: string;
}

const FileList: React.FC<FileListProps> = ({
  files,
  title,
  bucket,
  documentType,
  userId,
  reportId,
}) => {
  const fileArray = Array.isArray(files) ? files : [files];
  const uniqueKeys = Array.from(new Set(fileArray)); // de-dupe keys
  const [signedUrls, setSignedUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [getSignedUrl] = useGetSignedUrlMutation();

  useEffect(() => {
    // if no bucket/userId just render the strings
    if (!bucket) {
      setSignedUrls(uniqueKeys);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setSignedUrls([]);

    (async () => {
      const urls: string[] = [];

      for (const f of uniqueKeys) {
        // 1) derive key
        let key = f;
        if (f.startsWith('http')) {
          try {
            key = new URL(f).pathname.replace(/^\//, '');
          } catch {
            // leave as-is
          }
        }

        // 2) extract original userId
        const originalUserId = key.split('/')[0];

        // 3) presign
        const fileName = key.split('/').pop()!;
        const isImage = /\.(jpe?g|png|gif)$/i.test(fileName);
        try {
          const res = await getSignedUrl({
            userId: originalUserId,
            bucket,
            documentType,
            operation: 'getObject',
            fileName,
            expires: 300,
            isImage,
            key,
            reportId,
          }).unwrap();
          if (res.data?.url) {
            urls.push(res.data.url);
          }
        } catch (err) {
          console.error('Presign error for', key, err);
        }
      }

      if (!cancelled) {
        // de-dupe the resulting URLs too
        setSignedUrls(Array.from(new Set(urls)));
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [uniqueKeys.join(), bucket, documentType, userId]);

  return (
    <div>
      <Typography variant="subtitle1" gutterBottom>
        {title || 'File List'}
      </Typography>

      <Box
        display="flex"
        flexDirection="column"
        alignItems={loading ? 'center' : 'stretch'}
        border={1}
        borderColor="grey.300"
        borderRadius={1}
        p={2}
        minHeight={loading ? 80 : undefined}
      >
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          signedUrls.map((url, idx) => {
            // parse out just the filename, decoding any % escapes
            let name: string;
            try {
              name = decodeURIComponent(
                new URL(url).pathname.split('/').pop()!,
              );
            } catch {
              name = url.split('/').pop()!;
            }
            return (
              <Link href={url} target="_blank" key={idx} underline="hover">
                <Typography display="flex" alignItems="center" variant="body1">
                  {`${idx + 1}. ${name}`}
                  <OpenInNew sx={{ ml: 1, fontSize: 16 }} />
                </Typography>
              </Link>
            );
          })
        )}
      </Box>
    </div>
  );
};

export default FileList;
