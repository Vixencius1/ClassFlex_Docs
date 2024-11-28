export default function getMonthYear() {
  const fecha = new Date();
  let year = fecha.getFullYear();
  let month = fecha.getMonth() + 1;

  return `${month}-${year}`;
}