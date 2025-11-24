// import fetch from 'node-fetch';

async function testQuizSave() {
  const url = 'http://localhost:3002/quiz/progresso';
  const data = {
    usuario_id: 1, // Assuming user 1 exists
    modulo_id: 1,
    acertos: 5,
    total: 5
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Error response:', response.status, text);
    } else {
      const json = await response.json();
      console.log('Success:', json);
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testQuizSave();
