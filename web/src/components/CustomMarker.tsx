const CustomMarker = (color: 'blue' | 'red'): string => {
  const svg = `
    <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
      <style>
        @keyframes pulse {
          0% { r: 10; opacity: 0.8; }
          50% { r: 15; opacity: 0.8; }
          100% { r: 10; opacity: 0.8; }
        }
        .outer-circle { animation: pulse 1.5s ease-in-out infinite; }
      </style>
      <circle class="outer-circle" cx="15" cy="15" r="15" fill="${color === 'blue' ? 'rgba(0, 150, 255, 0.3)' : 'rgba(255, 0, 0, 0.3)'}" />
      <circle cx="15" cy="15" r="8" fill="${color === 'blue' ? 'rgba(0, 150, 255, 1)' : 'rgba(255, 0, 0, 1)'}" />
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export default CustomMarker;