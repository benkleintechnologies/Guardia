// src/components/CustomMarker.tsx

const CustomMarker = (color: 'blue' | 'red'): string => {
  const svg = `
    <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
      <circle cx="15" cy="15" r="12" fill="${color === 'blue' ? 'rgba(0, 150, 255, 0.3)' : 'rgba(255, 0, 0, 0.3)'}" />
      <circle cx="15" cy="15" r="8" fill="${color === 'blue' ? 'rgba(0, 150, 255, 1)' : 'rgba(255, 0, 0, 1)'}" />
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export default CustomMarker;