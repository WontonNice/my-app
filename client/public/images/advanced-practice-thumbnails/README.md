# Advanced Practice Thumbnails

Place passage cover images in this folder. Use JPG, PNG, or WebP files with a 16:9 aspect ratio; 1200 x 675 pixels is recommended.

Then add the public path to the passage entry in `client/src/content/advancedPractice/passages.ts`:

```ts
thumbnail: "/images/advanced-practice-thumbnails/signals-in-the-fog.webp",
```

Keep `thumbnailAlt` descriptive for students using screen readers. Cards automatically show their built-in cover design when no thumbnail is provided.
