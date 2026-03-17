function degToPx(deg, screenWidthPx = window.innerWidth, assumedDistanceCm = 60) {
  const pxPerCm = screenWidthPx / 34; // assume ~13.3" laptop (~34 cm width)
  const sizeCm = 2 * assumedDistanceCm * Math.tan((deg/2) * Math.PI/180);
  return sizeCm * pxPerCm;
}