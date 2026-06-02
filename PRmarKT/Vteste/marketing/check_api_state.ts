async function check() {
  try {
    const res = await fetch('http://localhost:3000/api/state');
    const data = await res.json();
    console.log('--- API STATE ---');
    console.log(JSON.stringify(data, null, 2));
  } catch (e: any) {
    console.error('Error:', e.message);
  }
}
check();
