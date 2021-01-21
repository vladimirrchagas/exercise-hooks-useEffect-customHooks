import React, { createContext, useState, useEffect } from 'react';
import { getPostsBySubreddit } from '../services/redditAPI';

export const Context = createContext();

function RedditProvider({children}) {
  const [postsBySubreddit, updatePosts] = useState({frontend: {}, reactjs: {}});
  const [selectedSubreddit, updateSelection] = useState('reactjs');
  const [shouldRefreshSubreddit, updateRefresh] = useState(false);
  const [isFetching, udateFetching] = useState(false);

  const fetchPosts = () => {
    if (!shouldFetchPosts()) return;

    updateRefresh(false);
    udateFetching(true);

    getPostsBySubreddit(selectedSubreddit)
      .then(handleFetchSuccess, handleFetchError);
  };


  useEffect(() => fetchPosts());

  const shouldFetchPosts = () => {
    const posts = postsBySubreddit[selectedSubreddit];

    if (!posts.items) return true;
    if (isFetching) return false;
    return shouldRefreshSubreddit;
  };

  const handleFetchSuccess = (json) => {
    const lastUpdated = Date.now();
    const items = json.data.children.map((child) => child.data);

    updateRefresh(false);
    udateFetching(false);
    updatePosts((current) => ({
      ...current, [selectedSubreddit]: {
        items,
        lastUpdated,
      }
    }));
  };

  const handleFetchError = (error) => {
    updateRefresh(false);
    udateFetching(false);
    updatePosts((current) => ({
      ...current,
      [selectedSubreddit]: {
      error: error.message,
      items: [],
    }}));
  };

  const handleSubredditChange = (selectedSubreddit) => {
    updateSelection(selectedSubreddit);
  };

  const handleRefreshSubreddit = () => {
    updateRefresh(true);
  };

    const context = {
      postsBySubreddit,
      selectedSubreddit,
      shouldRefreshSubreddit,
      isFetching,
      selectSubreddit: handleSubredditChange,
      fetchPosts: fetchPosts,
      refreshSubreddit: handleRefreshSubreddit,
      availableSubreddits: Object.keys(postsBySubreddit),
      posts: postsBySubreddit[selectedSubreddit].items,
    };

    return (
      <Context.Provider value={context}>
        {children}
      </Context.Provider>
    );
}

export default RedditProvider;