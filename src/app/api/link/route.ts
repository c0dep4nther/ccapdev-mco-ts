import axios from "axios";

/**
 * Handles the GET request to fetch metadata from a specified URL.
 * Extracts the title, description, and image URL from the response HTML.
 *
 * @param req - The incoming request object.
 * @returns The response object containing the extracted metadata.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const href = url.searchParams.get("url");

  // Check if the required "url" parameter is provided
  if (!href) {
    return new Response("Invalid href", { status: 400 });
  }

  // Fetch the HTML content of the provided URL
  const res = await axios.get(href);

  // Extract the title from the HTML content
  const titleMatch = res.data.match(/<title>(.*?)<\/title>/);
  const title = titleMatch ? titleMatch[1] : "";

  // Extract the description from the HTML content
  const descriptionMatch = res.data.match(
    /<meta name="description" content="(.*?)">/
  );
  const description = descriptionMatch ? descriptionMatch[1] : "";

  // Extract the image URL from the HTML content
  const imageMatch = res.data.match(
    /<meta property="og:image" content="(.*?)"/
  );
  const imageUrl = imageMatch ? imageMatch[1] : "";

  // Return the extracted metadata as a JSON response
  return new Response(
    JSON.stringify({
      success: 1,
      meta: {
        title,
        description,
        image: {
          url: imageUrl,
        },
      },
    })
  );
}
