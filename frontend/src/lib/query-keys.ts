/**
 * @module queryKeys
 */

/**
 * Query keys used for React Query.
 * @namespace QueryKeys
 */
const QueryKeys = {
  /**
   * Key for fetching user data.
   * @constant {string}
   * @default
   */
  USER: "user",

  /**
   * Key for fetching dasahboard data.
   * @constant {string}
   * @default
   */
  DASHBOARD: "dashboard",

  /**
   * Key for fetching uploaded files data.
   * @constant {string}
   * @default
   */
  UPLOADED_FILES: "uploaded-files",

  /**
   * Key for fetching comments related to a specific post.
   * @constant {function}
   * @param {number} postId - The ID of the post for which comments are fetched.
   * @returns {string} The key for fetching comments of a specific post.
   * @example
   * const commentsKey = QueryKeys.COMMENTS(1); // returns 'comments/1'
   */
  COMMENTS: (postId: string) => `comments/${postId}`,

  /**
   * Key for fetching user settings.
   * @constant {string}
   * @default
   */
  SETTINGS: "settings",
};

export default QueryKeys;
