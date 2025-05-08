/**
 * Bookmark API utility functions
 */

/**
 * Toggle a bookmark (add or remove)
 * @param id The opportunity ID to bookmark/unbookmark
 * @param accessToken The user's access token
 * @param isBookmarked Whether the opportunity is currently bookmarked (true to remove, false to add)
 * @returns Promise resolving to a boolean indicating success
 */
export async function BookmarkCrud(
  id: string,
  accessToken: string,
  isBookmarked: boolean
): Promise<boolean> {
  if (!accessToken) {
    return false;
  }

  try {
    const endpoint = `https://akil-backend.onrender.com/bookmarks/${id}`;
    const method = !isBookmarked ? "POST" : "DELETE";
    
    const requestOptions = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      method,
      body: !isBookmarked ? JSON.stringify({}) : null,
    };

    const res = await fetch(endpoint, requestOptions);
    const result = await res.json();

    // Handle case where bookmark already exists
    if (res.status === 409 && !isBookmarked) {
      return true; // Consider it a success since the bookmark already exists
    }

    if (!res.ok) {
      throw new Error(
        `${!isBookmarked ? "Adding" : "Removing"} bookmark failed: ${result.message || "Unknown error"}`
      );
    }


    // Return the success status to manage UI updates
    return result.success;
  } catch (error) {
    return false; // Return false if there's an error
  }
}

/**
 * Fetch all bookmarks for the current user
 * @param accessToken The user's access token
 * @returns Promise resolving to an array of bookmarks
 */
export async function getBookmarks(accessToken: string): Promise<any[]> {
  if (!accessToken) {
    return [];
  }

  try {
    const endpoint = `https://akil-backend.onrender.com/bookmarks`;
    const requestOptions = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      method: "GET",
    };

    const res = await fetch(endpoint, requestOptions);
    const responseData = await res.json();
    
    if (!res.ok) {
      throw new Error(`Failed to fetch bookmarks: ${responseData.message || res.statusText}`);
    }
    
    const { data } = responseData;

    // Return an empty array if no data is present to avoid errors
    return data || [];
  } catch (error) {
    return []; // Return an empty array if there's an error
  }
}
