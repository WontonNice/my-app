export function getFloorLabel(floor: number) {
  if (floor === 0) return "LL";
  if (floor === 1) return "L";
  return String(floor);
}

export function getFloorName(floor: number) {
  return `Floor ${getFloorLabel(floor)}`;
}
