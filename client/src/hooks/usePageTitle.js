import { useEffect } from 'react';

const usePageTitle = (title) => {
  useEffect(() => {
    document.title = title
      ? `${title} | CodeSentinel`
      : 'CodeSentinel | AI Code Security Scanner';
  }, [title]);
};

export default usePageTitle;