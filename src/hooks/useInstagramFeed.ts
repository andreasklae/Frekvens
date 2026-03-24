import { useState, useEffect } from 'react';
import type { InstagramPost } from '../types';

export function useInstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/instagram-posts.json')
      .then((res) => res.json())
      .then((data: { posts?: InstagramPost[] }) => {
        setPosts(Array.isArray(data.posts) ? data.posts : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading Instagram feed:', error);
        setPosts([]);
        setLoading(false);
      });
  }, []);

  return { posts, loading };
}
