//import 'dotenv/config';



export async function fetchRandomImage() {
    try {
      //const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
      //const response = await fetch(`https://api.unsplash.com/photos/random?query=landscape&client_id=${accessKey}`);
      const response = await fetch("https://api.unsplash.com/photos/random?query=landscape&client_id=uNQvjMoBp6ySwHzKcDcpiymadKT1NW2mjJY7j46fagc");

      const data = await response.json();
      return data.urls.regular;
    } catch (error) {
      console.error('Error fetching random image:', error);
      return null;
    }
  }