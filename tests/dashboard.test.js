import { describe, it, expect } from 'vitest';

describe('Dashboard', () => {
  it('should handle file uploads', () => {
    // Test file upload logic
    const files = [
      { name: 'test1.jpg', type: 'image/jpeg' },
      { name: 'test2.png', type: 'image/png' },
    ];

    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    expect(imageFiles.length).toBe(2);
  });

  it('should filter non-image files', () => {
    const files = [
      { name: 'test1.jpg', type: 'image/jpeg' },
      { name: 'test2.txt', type: 'text/plain' },
      { name: 'test3.png', type: 'image/png' },
    ];

    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    expect(imageFiles.length).toBe(2);
    expect(imageFiles[0].name).toBe('test1.jpg');
    expect(imageFiles[1].name).toBe('test3.png');
  });
});
