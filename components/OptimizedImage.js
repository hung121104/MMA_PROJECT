import React, { useState } from 'react';
import { Image, View, Text } from 'react-native';

export default function OptimizedImage({ 
  source, 
  style, 
  width = 300, 
  height = 200, 
  quality = 'auto',
  format = 'auto',
  fallbackText = 'Image not available'
}) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Function to optimize Cloudinary URL
  const optimizeCloudinaryUrl = (url) => {
    if (!url || !url.includes('cloudinary')) {
      return url;
    }

    // If URL already has transformations, add to them
    if (url.includes('/upload/')) {
      const parts = url.split('/upload/');
      const transformations = `w_${width},h_${height},c_fill,q_${quality},f_${format}`;
      return `${parts[0]}/upload/${transformations}/${parts[1]}`;
    }

    return url;
  };

  const optimizedSource = typeof source === 'string' 
    ? { uri: optimizeCloudinaryUrl(source) }
    : { ...source, uri: optimizeCloudinaryUrl(source.uri) };

  if (imageError) {
    return (
      <View style={[style, { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#666', fontSize: 12 }}>{fallbackText}</Text>
      </View>
    );
  }

  return (
    <Image
      source={optimizedSource}
      style={style}
      onLoadStart={() => setImageLoading(true)}
      onLoadEnd={() => setImageLoading(false)}
      onError={() => setImageError(true)}
      resizeMode="cover"
    />
  );
} 