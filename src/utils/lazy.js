import React from "react";

const retry = (fn, retriesLeft = 4, interval = 300) => {
  return new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch(error => {
        setTimeout(() => {
          if (retriesLeft === 1) {
            reject(error);
            return;
          }
          retry(fn, retriesLeft - 1, interval).then(resolve, reject);
        }, interval);
      });
  });
};

const lazy = fn => React.lazy(() => retry(() => fn()));
export { lazy };
