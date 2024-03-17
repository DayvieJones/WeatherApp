async function fetchForecast(weatherlocation) {
  try {
    if (!weatherlocation) {
      throw new Error("Invalid input!");
    }

    const response = await fetch(
      `${BASE_URL}/forecast.json?key=${API_KEY}&q=${weatherlocation}&days=3`
    );

    if (!response.ok) {
      throw new Error(
        `Response to network was not okay. Status: ${response.status}`
      );
    }

    const result = await response.json();

    console.log(result);

    if (Object.keys(result).length === 0) {
      throw new Error("Invalid input!");
    }

    return result;
  } catch (error) {
    throw error;
  }
}
