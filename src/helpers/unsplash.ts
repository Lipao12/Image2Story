export async function fetchRandomImage() {
    try {
      const response = await fetch(`https://api.unsplash.com/photos/random?query=landscape&client_id=${import.meta.env.VITE_API}`);

      const data = await response.json();
      return data.urls.regular;
    } catch (error) {
      console.error('Error fetching random image:', error);
      return null;
    }
  }